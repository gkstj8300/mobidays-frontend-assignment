# 폴더 구조 설계서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 폴더 구조 설계서 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-16 |
| 기반 문서 | `.claude/spec/MAIN.md`, `.claude/rules/conventions.md` |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-16 | Claude | 신규 작성 |

---

## 2. 설계 원칙

- **Feature-Sliced Design (FSD)** 기반. `conventions.md` 섹션 5 참조.
- **관심사 분리**: API 호출 → 데이터 전처리 → 상태 관리 → UI 렌더링 계층 분리.
- **단방향 의존**: `shared` ← `entities` ← `features` ← `widgets` ← `app`.

---

## 3. 전체 구조

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 루트 레이아웃 (QueryProvider, 글로벌 스타일)
│   ├── page.tsx                  # 대시보드 메인 페이지
│   └── globals.css               # Tailwind 글로벌 스타일
│
├── widgets/                      # 독립적인 화면 블록 (features 조합)
│   └── dashboard/
│       └── DashboardLayout.tsx   # 대시보드 전체 레이아웃 조합
│
├── features/                     # 도메인별 독립 기능 단위
│   ├── filter/                   # 3.1 글로벌 필터
│   │   ├── components/
│   │   │   ├── GlobalFilter.tsx
│   │   │   ├── DateRangePicker.tsx
│   │   │   ├── StatusFilter.tsx
│   │   │   └── PlatformFilter.tsx
│   │   ├── store/
│   │   │   └── useFilterStore.ts
│   │   └── constants.ts
│   │
│   ├── daily-chart/              # 3.2 일별 추이 차트
│   │   ├── components/
│   │   │   ├── DailyTrendChart.tsx
│   │   │   └── MetricToggle.tsx
│   │   └── hooks/
│   │       └── useDailyChartData.ts
│   │
│   ├── campaign-table/           # 3.3 캠페인 관리 테이블
│   │   ├── components/
│   │   │   ├── CampaignTable.tsx
│   │   │   ├── CampaignSearch.tsx
│   │   │   ├── BulkStatusChange.tsx
│   │   │   └── Pagination.tsx
│   │   ├── hooks/
│   │   │   └── useCampaignTable.ts
│   │   └── constants.ts
│   │
│   ├── campaign-form/            # 3.4 캠페인 등록 모달
│   │   ├── components/
│   │   │   ├── CampaignFormModal.tsx
│   │   │   └── FormField.tsx
│   │   ├── hooks/
│   │   │   └── useCampaignForm.ts
│   │   └── constants.ts
│   │
│   ├── platform-chart/           # 4.1 플랫폼별 성과 차트 (선택)
│   │   ├── components/
│   │   │   └── PlatformDonutChart.tsx
│   │   └── hooks/
│   │       └── usePlatformChartData.ts
│   │
│   └── ranking/                  # 4.2 캠페인 랭킹 Top3 (선택)
│       ├── components/
│       │   └── CampaignRankingTop3.tsx
│       └── hooks/
│           └── useRankingData.ts
│
├── entities/                     # 비즈니스 실체
│   └── campaign/
│       ├── api/
│       │   ├── campaignApi.ts    # API 호출 함수
│       │   └── queryKeys.ts     # TanStack Query 키 팩토리
│       ├── hooks/
│       │   ├── useCampaigns.ts   # 캠페인 목록 쿼리 훅
│       │   ├── useDailyStats.ts  # 일별 통계 쿼리 훅
│       │   └── useCampaignMutation.ts  # 등록/상태변경 뮤테이션
│       └── model/
│           └── normalizers.ts    # 데이터 정규화 함수
│
├── shared/                       # 프로젝트 전반 재사용
│   ├── api/
│   │   └── apiClient.ts          # fetch 래퍼 (base URL 설정)
│   ├── lib/
│   │   ├── metrics.ts            # 파생 지표 계산 (CTR, CPC, ROAS)
│   │   ├── utils.ts              # safeDivide 등 범용 유틸
│   │   ├── date.ts               # 날짜 유틸 (정규화, 포맷, 범위)
│   │   └── constants.ts          # 전역 상수
│   ├── ui/                       # 범용 UI 컴포넌트
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Checkbox.tsx
│   │   └── Select.tsx
│   └── providers/
│       └── QueryProvider.tsx      # TanStack Query Provider
│
├── types/                        # 타입 정의
│   ├── api.ts                    # API 응답 원본 타입 (raw)
│   ├── entities.ts               # 정규화 후 UI 타입
│   └── common.ts                 # 필터, 페이지네이션 등 공통 타입
│
├── db.json                       # json-server 데이터 (원본 복사)
└── ...config files
```

---

## 4. 계층별 의존 규칙

| 계층 | import 가능 대상 | import 금지 대상 |
|------|-----------------|-----------------|
| `app/` | `widgets`, `features`, `entities`, `shared`, `types` | — |
| `widgets/` | `features`, `entities`, `shared`, `types` | `app` |
| `features/` | `entities`, `shared`, `types` | `app`, `widgets`, 다른 `features` |
| `entities/` | `shared`, `types` | `app`, `widgets`, `features` |
| `shared/` | `types` | `app`, `widgets`, `features`, `entities` |
| `types/` | — | 모든 계층 |

### 예외

- `features/filter/store`는 다른 features에서 import 가능 (글로벌 필터 상태는 모든 위젯이 구독)
- `features/platform-chart`에서 `features/filter/store` import 허용 (양방향 필터 연동)

---

## 5. 파일 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `GlobalFilter.tsx`, `CampaignTable.tsx` |
| 훅 | camelCase, `use` 접두어 | `useFilterStore.ts`, `useCampaigns.ts` |
| 유틸/상수 | camelCase | `metrics.ts`, `constants.ts` |
| 타입 | camelCase | `entities.ts`, `api.ts` |
| 폴더 | kebab-case | `daily-chart/`, `campaign-table/` |
