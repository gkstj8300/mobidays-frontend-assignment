# 데이터 분석 & 전처리 설계서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 데이터 분석 & 전처리 설계서 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-16 |
| 기반 문서 | `.claude/spec/MAIN.md`, `db.json` |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-16 | Claude | 신규 작성 — data.json 전수 분석 결과 반영 |

---

## 2. 데이터 규모

| 항목 | 수량 |
|------|------|
| campaigns | 80건 |
| daily_stats | 1,422건 |
| 날짜 범위 | 2026-01-05 ~ 2026-10-29 |

---

## 3. 발견된 예외 사항 (db.json 원본)

### 3.1 Campaign 예외

| 캠페인 ID | 예외 유형 | 상세 |
|-----------|-----------|------|
| `GGL-002` | 날짜 포맷 불일치 | `startDate: "2026/04/12"` (슬래시 구분자) |
| `GGL-003` | null 필드 | `budget: null` |
| `META-002` | null 필드 | `name: null` |
| `NAV-010` | null 필드 | `endDate: null` |
| `NAV-004` | 플랫폼명 비표준 | `platform: "네이버"` (한글) |
| `META-007` | 플랫폼명 비표준 | `platform: "Facebook"` (Meta가 아닌 Facebook) |
| `META-009` | 플랫폼명 비표준 | `platform: "facebook"` (소문자) |
| `NAV-003` | 상태값 비표준 | `status: "stopped"` (ended가 아닌 stopped) |
| `GGL-012` | 상태값 비표준 | `status: "running"` (active가 아닌 running) |

### 3.2 DailyStat 예외

| 통계 ID | 예외 유형 | 상세 |
|---------|-----------|------|
| `STAT-00003` | Division by Zero | `impressions: 0, clicks: 0, cost: 0` |
| `STAT-00050` | Division by Zero (CTR) | `impressions: 0, clicks: 867` (노출 0인데 클릭 존재) |
| `STAT-00100` | Division by Zero (CPC) | `clicks: 0, impressions: 35180, cost: 357450` |
| `STAT-00154` | Division by Zero | `impressions: 0, clicks: 0, cost: 0` |
| `STAT-00200` | Division by Zero (CTR) | `impressions: 0, clicks: 259` |
| `STAT-00300` | Division by Zero (CPC) | `clicks: 0, impressions: 63915, cost: 2639898` |
| `STAT-00500` | null 필드 | `conversionsValue: null` |

---

## 4. 전처리 전략

### 4.1 플랫폼 정규화

API에서 조회한 직후, UI 계층에 전달하기 전에 정규화한다.

```typescript
const PLATFORM_NORMALIZE_MAP: Record<string, Platform> = {
  'Google': 'Google',
  'Meta': 'Meta',
  'Naver': 'Naver',
  'Facebook': 'Meta',
  'facebook': 'Meta',
  '네이버': 'Naver',
};
```

매핑되지 않는 값이 발견되면 원본 값을 유지하되 콘솔 경고를 출력한다.

### 4.2 상태 정규화

```typescript
const STATUS_NORMALIZE_MAP: Record<string, CampaignStatus> = {
  'active': 'active',
  'paused': 'paused',
  'ended': 'ended',
  'running': 'active',
  'stopped': 'ended',
};
```

### 4.3 날짜 포맷 정규화

모든 날짜 문자열을 `YYYY-MM-DD` 포맷으로 통일한다.

```typescript
// "2026/04/12" → "2026-04-12"
const normalizeDate = (dateStr: string): string =>
  dateStr.replace(/\//g, '-');
```

### 4.4 Null Safety 처리

| 필드 | null 처리 전략 |
|------|---------------|
| `campaign.name` | `"(이름 없음)"` 또는 캠페인 ID로 대체 표시 |
| `campaign.budget` | `0`으로 처리 |
| `campaign.endDate` | `null` 유지 — UI에서 `"진행중"` 또는 `"-"` 표시 |
| `dailyStat.conversionsValue` | `0`으로 처리 (ROAS 계산 시 분자 0) |

### 4.5 Division by Zero 방어

| 파생 지표 | 계산식 | 분모 0 처리 |
|-----------|--------|-------------|
| CTR (%) | (클릭수 / 노출수) × 100 | 노출수 = 0 → `0` 반환 |
| CPC (원) | 집행비용 / 클릭수 | 클릭수 = 0 → `0` 반환 |
| ROAS (%) | (전환가치 / 집행비용) × 100 | 집행비용 = 0 → `0` 반환 |

```typescript
const safeDivide = (numerator: number, denominator: number): number =>
  denominator === 0 ? 0 : numerator / denominator;
```

---

## 5. 전처리 파이프라인

```
[db.json] → json-server → [API 응답 (raw)]
                              ↓
                     normalizeCampaign()
                     - 플랫폼 정규화
                     - 상태 정규화
                     - 날짜 포맷 정규화
                     - null 처리
                              ↓
                     [정규화된 Campaign[]]
                              ↓
                     필터 적용 (글로벌 필터)
                              ↓
                     파생 지표 계산 (CTR, CPC, ROAS)
                              ↓
                     [UI 렌더링 데이터]
```

### 전처리 함수 위치

| 함수 | 파일 위치 | 역할 |
|------|-----------|------|
| `normalizeCampaign` | `src/lib/normalizers.ts` | Campaign raw → 정규화 |
| `normalizeDailyStat` | `src/lib/normalizers.ts` | DailyStat raw → 정규화 |
| `calcCTR`, `calcCPC`, `calcROAS` | `src/lib/metrics.ts` | 파생 지표 계산 |
| `safeDivide` | `src/lib/utils.ts` | 안전 나눗셈 |

---

## 6. 플랫폼·상태 분포 (정규화 후)

### 플랫폼

| 플랫폼 | 원본 수 | 정규화 매핑 |
|--------|---------|-------------|
| Google | 33 | 그대로 유지 |
| Meta | 20 + 2 = 22 | `Facebook`, `facebook` → `Meta` |
| Naver | 24 + 1 = 25 | `네이버` → `Naver` |

### 상태

| 상태 | 원본 수 | 정규화 매핑 |
|------|---------|-------------|
| active | 31 + 1 = 32 | `running` → `active` |
| paused | 21 | 그대로 유지 |
| ended | 26 + 1 = 27 | `stopped` → `ended` |
