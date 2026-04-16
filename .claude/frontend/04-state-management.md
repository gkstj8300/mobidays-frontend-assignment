# 상태 관리 설계서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 상태 관리 설계서 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-16 |
| 기반 문서 | `.claude/spec/MAIN.md`, `.claude/frontend/01-tech-stack.md` |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-16 | Claude | 신규 작성 |

---

## 2. 상태 분류

| 분류 | 관리 도구 | 설명 |
|------|-----------|------|
| 글로벌 필터 상태 | Zustand | 집행 기간, 상태, 매체 필터. 모든 위젯이 구독 |
| 서버 데이터 | TanStack Query | campaigns, daily_stats API 캐시 |
| 로컬 UI 상태 | React useState | 모달 열림/닫힘, 테이블 검색어, 정렬, 페이지 등 |
| 폼 상태 | React useState | 캠페인 등록 모달 입력값, 유효성 에러 |

---

## 3. Zustand 스토어 설계

### 3.1 useFilterStore

글로벌 필터 상태. 모든 차트와 테이블이 이 스토어를 구독한다.

```typescript
interface FilterState {
  // 상태
  dateRange: { start: string; end: string };  // YYYY-MM-DD
  statuses: CampaignStatus[];                  // 다중 선택, 빈 배열 = 전체
  platforms: Platform[];                       // 다중 선택, 빈 배열 = 전체

  // 액션
  setDateRange: (range: { start: string; end: string }) => void;
  toggleStatus: (status: CampaignStatus) => void;
  togglePlatform: (platform: Platform) => void;
  reset: () => void;
}
```

**초기값:**
- `dateRange`: 당월 1일 ~ 말일 (2026-04-01 ~ 2026-04-30)
- `statuses`: `[]` (전체)
- `platforms`: `[]` (전체)

**reset()**: 모든 필터를 초기값으로 복구.

**4.1 양방향 연동 (선택 과제):**
- `togglePlatform`을 도넛 차트 클릭 시에도 호출하여 글로벌 필터와 동기화.

---

## 4. TanStack Query 설계

### 4.1 Query Key 팩토리

```typescript
const campaignKeys = {
  all: ['campaigns'] as const,
  list: () => [...campaignKeys.all, 'list'] as const,
};

const dailyStatKeys = {
  all: ['dailyStats'] as const,
  list: () => [...dailyStatKeys.all, 'list'] as const,
};
```

### 4.2 쿼리 훅

| 훅 | queryKey | 역할 |
|----|----------|------|
| `useCampaigns` | `campaignKeys.list()` | 전체 캠페인 목록 조회 + 정규화 |
| `useDailyStats` | `dailyStatKeys.list()` | 전체 일별 통계 조회 + 정규화 |

**설계 결정**: 필터링은 서버가 아닌 클라이언트에서 수행한다.
- json-server의 필터 기능은 제한적 (날짜 범위 쿼리 불가)
- 전체 데이터(80건, 1422건)를 한 번 로드 후 클라이언트 필터링이 더 효율적
- queryKey에 필터를 포함하지 않아 캐시 효율 극대화

### 4.3 뮤테이션

| 훅 | 용도 | 성공 후 동작 |
|----|------|-------------|
| `useCreateCampaign` | 캠페인 등록 | `invalidateQueries(campaignKeys.all)` → 목록+차트 즉시 반영 |
| `useUpdateCampaignStatus` | 일괄 상태 변경 | `invalidateQueries(campaignKeys.all)` |

---

## 5. 데이터 흐름

```
[json-server]
    ↓ GET /campaigns, GET /daily_stats
[TanStack Query 캐시]
    ↓ useCampaigns(), useDailyStats() — 정규화 포함
[정규화된 데이터]
    ↓
[useFilterStore] → 필터 조건
    ↓
[커스텀 훅에서 필터링] — useDailyChartData, useCampaignTable 등
    ↓
[UI 컴포넌트 렌더링]
```

### 필터링 로직 위치

| 위젯 | 커스텀 훅 | 필터 적용 내용 |
|------|-----------|---------------|
| 일별 추이 차트 | `useDailyChartData` | 필터 조건에 맞는 캠페인의 일별 데이터 합산 |
| 캠페인 테이블 | `useCampaignTable` | 필터 + 검색어 + 정렬 + 페이지네이션 |
| 플랫폼별 성과 | `usePlatformChartData` | 필터 조건에 맞는 플랫폼별 집계 |
| 캠페인 랭킹 | `useRankingData` | 필터 조건에 맞는 캠페인 Top3 |

---

## 6. 리렌더링 최적화

| 전략 | 적용 위치 |
|------|-----------|
| Zustand 셀렉터 | 각 컴포넌트가 필요한 필터 값만 구독 |
| `useMemo` | 필터링/정렬/계산 결과 메모이제이션 |
| `React.memo` | 차트 컴포넌트 (props 변경 없으면 리렌더 방지) |
| TanStack Query `select` | API 데이터에서 필요한 부분만 선택 |

### 리렌더링 시나리오

| 사용자 액션 | 리렌더 대상 | 리렌더 제외 |
|------------|------------|------------|
| 날짜 필터 변경 | 모든 위젯 | — |
| 상태 필터 변경 | 모든 위젯 | — |
| 매체 필터 변경 | 모든 위젯 | — |
| 테이블 검색어 입력 | 캠페인 테이블만 | 차트, 필터 |
| 테이블 정렬 변경 | 캠페인 테이블만 | 차트, 필터 |
| 페이지 변경 | 캠페인 테이블만 | 차트, 필터 |
| 캠페인 등록 | 모든 위젯 (캐시 무효화) | — |
