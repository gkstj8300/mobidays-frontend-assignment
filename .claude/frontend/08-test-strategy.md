# 테스트 전략서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 테스트 전략서 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-17 |
| 기반 문서 | `.claude/spec/MAIN.md`, `.claude/frontend/02-data-analysis.md` |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-17 | Claude | 신규 작성 |

---

## 2. 목적

과제 평가 "선택 과제 (가산점, 10점)" 항목에 테스트 코드가 포함되어 있다. 제한된 시간 내 최대 효과를 위해 **비즈니스 로직 핵심 함수**에 집중하여 테스트를 작성한다.

### 테스트 원칙

- **순수 함수 우선**: UI 컴포넌트 테스트보다 순수 함수 단위 테스트가 ROI가 높다.
- **예외 데이터 커버**: db.json에 의도적으로 포함된 9건의 예외 상황을 테스트로 검증한다.
- **평가자 관점**: 테스트 코드를 통해 데이터 전처리(10점)와 코드 품질(15점) 항목의 근거를 보여준다.

---

## 3. 테스트 도구

| 도구 | 용도 |
|------|------|
| Vitest | 테스트 러너. Next.js + TypeScript 호환, Jest 호환 API |
| @testing-library/react | 컴포넌트 테스트 (선택적) |

### Vitest 선정 근거

- Jest 대비 ESM 네이티브 지원, Vite 기반으로 빠른 실행 속도
- Jest 호환 API (`describe`, `it`, `expect`)로 학습 비용 없음
- TypeScript 설정 불필요 (자동 해석)

---

## 4. 테스트 대상 및 우선순위

### Tier 1 — 필수 (데이터 전처리 10점 + 코드 품질 15점 직결)

| 대상 함수 | 파일 위치 | 테스트 포인트 |
|-----------|-----------|--------------|
| `normalizeCampaign` | `entities/campaign/model/normalizers.ts` | 플랫폼 정규화, 상태 정규화, 날짜 포맷, null 처리 |
| `normalizeDailyStat` | `entities/campaign/model/normalizers.ts` | conversionsValue null 처리 |
| `calcCTR` | `shared/lib/metrics.ts` | 정상 계산, 노출수 0 방어 |
| `calcCPC` | `shared/lib/metrics.ts` | 정상 계산, 클릭수 0 방어 |
| `calcROAS` | `shared/lib/metrics.ts` | 정상 계산, 집행비용 0 방어 |
| `safeDivide` | `shared/lib/utils.ts` | 분모 0, 정상 나눗셈 |

### Tier 2 — 권장 (상태관리 & 데이터 흐름 10점 연관)

| 대상 | 파일 위치 | 테스트 포인트 |
|------|-----------|--------------|
| `useFilterStore` | `features/filter/store/useFilterStore.ts` | 초기값, toggleStatus, togglePlatform, reset |
| 필터링 로직 | 각 feature 훅 | 날짜 범위 필터, 상태 필터, 매체 필터 AND 조합 |

### Tier 3 — 선택 (시간 여유 시)

| 대상 | 파일 위치 | 테스트 포인트 |
|------|-----------|--------------|
| 유효성 검사 | `features/campaign-form/` | 캠페인명 2~100자, 예산 범위, 종료일 > 시작일 |
| 날짜 유틸 | `shared/lib/date.ts` | 날짜 정규화, 범위 계산 |

---

## 5. 테스트 케이스 상세

### 5.1 normalizeCampaign

```
describe('normalizeCampaign')
  ✓ 표준 캠페인 데이터를 그대로 반환한다
  ✓ platform "Facebook" → "Meta"로 정규화한다
  ✓ platform "facebook" → "Meta"로 정규화한다
  ✓ platform "네이버" → "Naver"로 정규화한다
  ✓ status "running" → "active"로 정규화한다
  ✓ status "stopped" → "ended"로 정규화한다
  ✓ startDate "2026/04/12" → "2026-04-12"로 정규화한다
  ✓ name이 null이면 "(이름 없음)"으로 대체한다
  ✓ budget이 null이면 0으로 처리한다
  ✓ endDate가 null이면 null을 유지한다
```

### 5.2 normalizeDailyStat

```
describe('normalizeDailyStat')
  ✓ 표준 데이터를 그대로 반환한다
  ✓ conversionsValue가 null이면 0으로 처리한다
```

### 5.3 calcCTR

```
describe('calcCTR')
  ✓ (클릭수 / 노출수) × 100을 반환한다
  ✓ 노출수가 0이면 0을 반환한다
  ✓ 클릭수가 0이면 0을 반환한다
```

### 5.4 calcCPC

```
describe('calcCPC')
  ✓ (집행비용 / 클릭수)를 반환한다
  ✓ 클릭수가 0이면 0을 반환한다
```

### 5.5 calcROAS

```
describe('calcROAS')
  ✓ (전환가치 / 집행비용) × 100을 반환한다
  ✓ 집행비용이 0이면 0을 반환한다
  ✓ 전환가치가 0이면 0을 반환한다
```

### 5.6 safeDivide

```
describe('safeDivide')
  ✓ 정상 나눗셈 결과를 반환한다
  ✓ 분모가 0이면 0을 반환한다
```

### 5.7 useFilterStore (Tier 2)

```
describe('useFilterStore')
  ✓ 초기 dateRange가 당월 1일~말일이다
  ✓ 초기 statuses가 빈 배열이다 (전체)
  ✓ 초기 platforms가 빈 배열이다 (전체)
  ✓ toggleStatus로 상태를 추가/제거한다
  ✓ togglePlatform으로 매체를 추가/제거한다
  ✓ reset으로 모든 필터가 초기값으로 복구된다
```

---

## 6. 테스트 파일 배치

```
src/
├── entities/campaign/model/
│   ├── normalizers.ts
│   └── __tests__/
│       └── normalizers.test.ts
├── shared/lib/
│   ├── metrics.ts
│   ├── utils.ts
│   └── __tests__/
│       ├── metrics.test.ts
│       └── utils.test.ts
└── features/filter/store/
    ├── useFilterStore.ts
    └── __tests__/
        └── useFilterStore.test.ts
```

### 배치 규칙

- 테스트 파일은 대상 파일과 같은 디렉터리의 `__tests__/` 하위에 배치한다.
- 파일명은 `{대상파일명}.test.ts` 형식을 따른다.

---

## 7. 실행 스크립트

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

---

## 8. 테스트 작성 시점

| Phase | 테스트 대상 | 사유 |
|-------|------------|------|
| Phase 1 | `normalizers`, `metrics`, `utils` | 전처리 함수 구현과 동시에 작성 |
| Phase 2 | `useFilterStore` | 스토어 구현과 동시에 작성 |
| Phase 5 | 유효성 검사 (시간 여유 시) | 폼 로직 구현 후 |

### Phase 1 커밋 계획 수정

기존 커밋 `feat: 타입 정의 및 데이터 정규화 함수 구현` 에 테스트를 포함하거나, 별도 커밋으로 분리한다.

- `feat: 타입 정의 및 데이터 정규화 함수 구현`
- `test: 데이터 정규화 및 파생 지표 단위 테스트`

---

## 9. 평가 포인트 연결

| 평가 항목 | 배점 | 테스트로 어필하는 포인트 |
|-----------|------|------------------------|
| 데이터 전처리 | 10 | 9건 예외 데이터 전수 테스트로 전처리 완전성 증명 |
| 코드 품질 | 15 | 테스트 가능한 순수 함수 분리 = 좋은 설계의 근거 |
| 선택 과제 (가산점) | 10 | 테스트 코드 존재 자체가 가산점 |
