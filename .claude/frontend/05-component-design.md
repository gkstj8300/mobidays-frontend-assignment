# 컴포넌트 설계서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 컴포넌트 설계서 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-16 |
| 기반 문서 | `.claude/spec/MAIN.md`, `.claude/frontend/03-folder-structure.md`, `.claude/frontend/07-design-system.md` |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-16 | Claude | 신규 작성 |
| v1.1.0 | 2026-04-16 | Claude | Figma 디자인 시스템 반영 — Badge 색상 매핑, 공통 UI 컴포넌트 상세 추가 |

---

## 2. 컴포넌트 계층 구조

```
app/page.tsx
└── DashboardLayout
    ├── GlobalFilter                    ← 3.1
    │   ├── DateRangePicker
    │   ├── StatusFilter
    │   ├── PlatformFilter
    │   └── Button (초기화)
    │
    ├── DailyTrendChart                 ← 3.2
    │   └── MetricToggle
    │
    ├── [선택] PlatformDonutChart       ← 4.1
    ├── [선택] CampaignRankingTop3      ← 4.2
    │
    └── CampaignTable                   ← 3.3
        ├── CampaignSearch
        ├── BulkStatusChange
        ├── Table (헤더 + 바디)
        ├── Pagination
        └── CampaignFormModal           ← 3.4
            └── FormField (반복)
```

---

## 3. 필수 컴포넌트 상세 (3.1 ~ 3.4)

### 3.1 GlobalFilter

| Props | 타입 | 설명 |
|-------|------|------|
| — | — | 스토어 직접 구독 (props 없음) |

**내부 동작:**
- `useFilterStore`에서 상태와 액션을 구독한다.
- 각 서브 컴포넌트에 값과 핸들러를 전달한다.

#### DateRangePicker

| Props | 타입 | 설명 |
|-------|------|------|
| `startDate` | `string` | 시작일 (YYYY-MM-DD) |
| `endDate` | `string` | 종료일 (YYYY-MM-DD) |
| `onChange` | `(range: { start: string; end: string }) => void` | 변경 핸들러 |

#### StatusFilter

| Props | 타입 | 설명 |
|-------|------|------|
| `selected` | `CampaignStatus[]` | 선택된 상태 목록 |
| `onToggle` | `(status: CampaignStatus) => void` | 토글 핸들러 |

#### PlatformFilter

| Props | 타입 | 설명 |
|-------|------|------|
| `selected` | `Platform[]` | 선택된 매체 목록 |
| `onToggle` | `(platform: Platform) => void` | 토글 핸들러 |

---

### 3.2 DailyTrendChart

| Props | 타입 | 설명 |
|-------|------|------|
| — | — | 내부에서 훅으로 데이터 조회 |

**내부 동작:**
- `useDailyChartData()` 훅으로 필터링된 일별 합산 데이터를 가져온다.
- `MetricToggle`로 노출수/클릭수 토글을 제어한다.
- Recharts `<LineChart>`로 렌더링. 듀얼 Y축 (노출수 좌, 클릭수 우).

#### MetricToggle

| Props | 타입 | 설명 |
|-------|------|------|
| `options` | `{ key: string; label: string }[]` | 토글 옵션 목록 |
| `active` | `string[]` | 활성화된 메트릭 키 |
| `onToggle` | `(key: string) => void` | 토글 핸들러 |
| `minActive` | `number` | 최소 활성 개수 (기본값 1) |

---

### 3.3 CampaignTable

| Props | 타입 | 설명 |
|-------|------|------|
| — | — | 내부에서 훅으로 데이터 조회 |

**내부 상태 (useState):**
- `searchKeyword`: 캠페인명 검색어
- `sortConfig`: `{ key: string; direction: 'asc' | 'desc' } | null`
- `currentPage`: 현재 페이지 (1-based)
- `selectedIds`: 체크된 캠페인 ID Set

**컬럼 정의:**

| 컬럼 | 데이터 키 | 정렬 | 포맷 |
|------|-----------|------|------|
| 캠페인명 | `name` | X | 텍스트 |
| 상태 | `status` | X | Badge (진행중=`#DDFFD3`/`#1C9E34`, 일시중지=`#FFEFDE`/`#FF9030`, 종료=`#EBEBEB`/`#7D7D7D`) |
| 매체 | `platform` | X | 텍스트 |
| 집행기간 | `startDate ~ endDate` | O | YYYY.MM.DD ~ YYYY.MM.DD |
| 총 집행금액 | `totalCost` | O | ₩{숫자} (천 단위 콤마) |
| CTR (%) | `ctr` | O | 소수점 2자리 |
| CPC (원) | `cpc` | O | 정수 (천 단위 콤마) |
| ROAS (%) | `roas` | O | 소수점 2자리 |

#### CampaignSearch

| Props | 타입 | 설명 |
|-------|------|------|
| `value` | `string` | 검색어 |
| `onChange` | `(value: string) => void` | 변경 핸들러 |
| `resultCount` | `number` | 검색 결과 건수 |
| `totalCount` | `number` | 전체 건수 |

#### BulkStatusChange

| Props | 타입 | 설명 |
|-------|------|------|
| `selectedCount` | `number` | 선택된 캠페인 수 |
| `onChangeStatus` | `(status: CampaignStatus) => void` | 상태 변경 핸들러 |
| `disabled` | `boolean` | 선택 없으면 비활성화 |

#### Pagination

| Props | 타입 | 설명 |
|-------|------|------|
| `currentPage` | `number` | 현재 페이지 |
| `totalPages` | `number` | 전체 페이지 수 |
| `onPageChange` | `(page: number) => void` | 페이지 변경 핸들러 |

---

### 3.4 CampaignFormModal

| Props | 타입 | 설명 |
|-------|------|------|
| `isOpen` | `boolean` | 모달 열림 상태 |
| `onClose` | `() => void` | 닫기 핸들러 |

**폼 필드:**

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| `name` | `text` | O | 2자 ~ 100자 |
| `platform` | `select` | O | Google / Meta / Naver |
| `budget` | `number` | O | 정수, 100 ~ 1,000,000,000 |
| `cost` | `number` | O | 정수, 0 ~ 1,000,000,000, ≤ budget |
| `startDate` | `date` | O | 필수 |
| `endDate` | `date` | O | startDate 이후 |

**등록 성공 후:**
1. `useCreateCampaign` 뮤테이션 호출
2. `invalidateQueries` → 목록 + 차트 자동 갱신
3. 모달 닫기
4. 상태: `active` 고정, ID: 자동 생성 (`NEW-{timestamp}`)

---

## 4. 선택 컴포넌트 (4.1 ~ 4.2)

### 4.1 PlatformDonutChart

| Props | 타입 | 설명 |
|-------|------|------|
| — | — | 내부에서 훅으로 데이터 조회 |

**내부 동작:**
- `usePlatformChartData()` 훅으로 플랫폼별 집계 데이터를 가져온다.
- 메트릭 토글: 비용 / 노출수 / 클릭수 / 전환수 (기본값: 비용)
- Recharts `<PieChart>` + `<Pie innerRadius>` 로 Donut 렌더링.
- 각 세그먼트에 수치 + 비중(%) 표시.
- **클릭 이벤트**: 세그먼트 클릭 시 `useFilterStore.togglePlatform()` 호출.

### 4.2 CampaignRankingTop3

| Props | 타입 | 설명 |
|-------|------|------|
| — | — | 내부에서 훅으로 데이터 조회 |

**내부 동작:**
- `useRankingData()` 훅으로 메트릭 기준 상위 3개 캠페인을 가져온다.
- 메트릭 토글: ROAS / CTR / CPC (기본값: ROAS)
- 정렬 방향: ROAS·CTR은 내림차순(높을수록 상위), CPC는 오름차순(낮을수록 상위).
- Recharts `<BarChart layout="vertical">` 로 수평 바 차트 렌더링.

---

## 5. 공통 UI 컴포넌트 (shared/ui)

> Figma 컴포넌트와의 상세 매핑은 `.claude/frontend/07-design-system.md` 섹션 7을 참조한다.

| 컴포넌트 | Figma 컴포넌트 | 용도 |
|----------|---------------|------|
| `Modal` | — (직접 구현) | 캠페인 등록 모달. 오버레이(`rgba(5,27,60,0.5)`) + 닫기 |
| `Badge` | `tag_state` | 상태 뱃지. Status 색상 토큰 적용 |
| `Button` | `button` | variant(primary/secondary/tertiary), size(default/small). height 36px/30px, radius 8px |
| `Input` | `input` | 검색, 폼 입력. radius 8px, stroke 1px. focused/error 상태 |
| `Checkbox` | `checkbox` | 테이블 체크박스. select/default/hover/disable 4상태 |
| `Select` | `Dropdown` | 드롭다운. 일괄 상태 변경, 매체 선택. default/open/hover/disabled 4상태 |
