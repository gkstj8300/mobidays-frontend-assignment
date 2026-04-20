# 마케팅 캠페인 성과 대시보드

(주)모비데이즈 프론트엔드 과제 — 마케팅 캠페인 성과 대시보드

## 실행 방법

### 사전 요구사항

- Node.js 20+
- npm 10+

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Next.js + json-server 동시 실행)
npm run dev
```

- 프론트엔드: http://localhost:3000
- API 서버: http://localhost:4000

### 기타 스크립트

```bash
npm run build       # 프로덕션 빌드
npm run lint        # ESLint 실행
npm test            # 단위 테스트 실행 (Vitest)
npm run test:watch  # 테스트 watch 모드
```

---

## 기술 스택 및 선택 근거

### 필수 스택

| 기술 | 버전 | 선택 근거 |
|------|------|-----------|
| Next.js | 16 (App Router) | 과제 요건(React/Next.js). App Router 기반 파일 라우팅 |
| TypeScript | 5 | 과제 요건. strict 모드 활성화 |

### 상태 관리

| 기술 | 역할 | 선택 근거 | 트레이드오프 |
|------|------|-----------|-------------|
| Zustand | 글로벌 필터 상태 | 보일러플레이트 최소, 셀렉터 기반 리렌더링 최적화 | Redux 대비 미들웨어 생태계 제한적이나 과제 규모에서 불필요 |
| TanStack Query v5 | 서버 데이터 캐싱 | 캐시 무효화로 등록/변경 후 즉시 반영. `select`로 정규화 적용 | SWR 대비 mutation/invalidation이 명시적 |

**분리 근거**: 필터 상태는 클라이언트 UI 상태(Zustand), API 데이터는 서버 상태(TanStack Query)로 관심사 분리. 필터 변경 시 Zustand 구독 → 커스텀 훅에서 클라이언트 필터링 → 불필요한 API 재요청 없이 즉시 반영.

### 차트

| 기술 | 선택 근거 | 트레이드오프 |
|------|-----------|-------------|
| Recharts | React 선언형 API. Line/Pie 차트 지원, 툴팁·범례 내장 | D3 대비 커스터마이징 한계. 과제 요구사항 범위에서 충분 |

### 스타일링

| 기술 | 선택 근거 |
|------|-----------|
| Tailwind CSS v4 | 유틸리티 기반 빠른 구현. Figma 디자인 토큰을 CSS 변수로 직접 매핑 |

### 데이터 서버

| 환경 | 기술 | 역할 |
|------|------|------|
| 로컬 개발 | json-server + concurrently | `db.json` 기반 REST API. `npm run dev`로 Next.js와 동시 실행 |
| 프로덕션 (Vercel 등) | MSW (Mock Service Worker) | 브라우저 서비스 워커가 `fetch`를 가로채 db.json으로 응답 |

**선택 근거**: MAIN.md §2.2가 "json-server, msw 등"을 허용. 로컬 개발은 json-server의 실제 HTTP·파일 영속성을 활용하고, 외부 서버가 없는 Vercel 배포 환경에서는 MSW가 같은 API 시그니처로 브라우저 내부에서 응답하여 동일한 프론트엔드 코드가 양쪽 모두에서 동작.

**db.json 원본 보호**: json-server POST/PATCH 시 파일이 변경되므로, 실행 시 `db.serve.json` 복사본을 생성하여 사용. 원본 `db.json`은 항상 초기 상태 유지. MSW도 메모리 내 복사본만 조작.

**환경별 분기**: `NODE_ENV === 'production'`이면 MSW 활성화. `process.env.NEXT_PUBLIC_API_URL`을 명시하면 해당 URL을 우선 사용 (외부 json-server에 연결할 때).

### 테스트

| 기술 | 선택 근거 |
|------|-----------|
| Vitest | ESM 네이티브, Jest 호환 API, TypeScript 자동 해석. 28개 단위 테스트 |

---

## 폴더 구조 및 아키텍처

Feature-Sliced Design (FSD) 아키텍처를 채택했습니다. 비즈니스 로직의 응집도를 높이고 계층 간 단방향 의존을 보장합니다.

```
src/
├── app/                          # Next.js App Router 진입점
│   ├── layout.tsx                # 루트 레이아웃 (QueryProvider)
│   ├── page.tsx                  # 대시보드 메인 페이지
│   └── globals.css               # 디자인 시스템 토큰 + 글로벌 스타일
│
├── widgets/dashboard/            # 화면 블록 조합
│   └── DashboardLayout.tsx       # 필터 + 차트 + 테이블 + 모달 배치
│
├── features/                     # 도메인별 독립 기능 단위
│   ├── filter/                   # 글로벌 필터 (집행기간, 상태, 매체)
│   ├── daily-chart/              # 일별 추이 차트 (Line Chart)
│   ├── campaign-table/           # 캠페인 관리 테이블
│   ├── campaign-form/            # 캠페인 등록 모달
│   ├── platform-chart/           # 플랫폼별 성과 (Donut Chart)
│   └── ranking/                  # 캠페인 랭킹 Top3
│
├── entities/campaign/            # 비즈니스 실체
│   ├── api/                      # API 호출 + Query Key 팩토리
│   ├── hooks/                    # TanStack Query 훅 (조회/뮤테이션)
│   └── model/                    # 데이터 정규화 함수
│
├── shared/                       # 프로젝트 전반 재사용
│   ├── api/                      # fetch 래퍼 (apiClient)
│   ├── lib/                      # 유틸 (metrics, date, constants)
│   ├── ui/                       # Figma 디자인 시스템 기반 공통 컴포넌트
│   └── providers/                # TanStack Query Provider
│
└── types/                        # 타입 정의
    ├── api.ts                    # API 원본 타입 (raw)
    ├── entities.ts               # 정규화 후 UI 타입
    └── common.ts                 # 필터, 정렬, 페이지네이션
```

### 계층 간 의존 규칙

`shared` ← `entities` ← `features` ← `widgets` ← `app` (단방향)

예외: `features/filter/store`는 다른 features에서 글로벌 필터 구독을 위해 import 허용.

---

## 컴포넌트 설계

### 재사용성: Figma 디자인 시스템 기반 공통 UI

Figma 디자인 시스템을 분석하여 8개 공통 UI 컴포넌트(`shared/ui/`)를 구현했습니다. 모든 feature 컴포넌트는 인라인 스타일 대신 이 공통 컴포넌트를 사용합니다.

| 컴포넌트 | Figma 원본 | Props |
|----------|-----------|-------|
| `Button` | `button` | variant(primary/secondary/tertiary), size(default/small) |
| `Input` | `input` | inputType(default/search), status(default/error) |
| `Badge` | `tag_state` | status(active/paused/ended/error/info), size(sm/lg) |
| `Checkbox` | `checkbox` | checked, onChange |
| `ToggleChip` | `Tap-BK` | isActive, size(sm/lg) |
| `Select` | `Dropdown` | options, placeholder |
| `DatePicker` | `date picker` | value, calendarSize(sm/md/lg), Portal 렌더링 |
| `Modal` | overlay+card | isOpen, ESC/오버레이 클릭 닫기, body scroll lock |

### 확장성: 커스텀 훅으로 데이터 로직 분리

각 feature는 `hooks/` 디렉터리에 데이터 로직을 분리하여 컴포넌트는 렌더링에만 집중합니다.

| 훅 | 역할 |
|----|------|
| `useDailyChartData` | 필터 적용 + 일별 합산 |
| `useCampaignTable` | 필터 + 검색 + 정렬 + 파생지표 + 페이지네이션 |
| `usePlatformChartData` | 플랫폼별 메트릭 집계 |
| `useRankingData` | 메트릭 기준 Top3 정렬 |
| `useCampaignForm` | 폼 상태 + 유효성 검사 |

### 데이터 전처리

`db.json`에 의도적으로 포함된 9건의 예외 데이터를 정규화 함수에서 처리합니다.

| 예외 유형 | 건수 | 처리 |
|-----------|------|------|
| 플랫폼 비표준 (`Facebook`, `네이버`) | 3건 | 정규화 맵으로 변환 |
| 상태 비표준 (`running`, `stopped`) | 2건 | 정규화 맵으로 변환 |
| 날짜 포맷 불일치 (`2026/04/12`) | 1건 | `/` → `-` 변환 |
| null 필드 (name, budget, endDate, conversionsValue) | 4건 | 기본값 대체 |
| Division by Zero (impressions=0, clicks=0) | 6건 | `safeDivide` 방어 |

28개 단위 테스트로 전처리 완전성을 검증합니다.

---

## 의도된 UI 동작 (예외 데이터 처리 결과)

아래 항목은 `db.json`의 예외 데이터를 안전 처리한 결과로 발생하는 **정상 동작**입니다.

| 화면 현상 | 원인 | 처리 방식 |
|-----------|------|-----------|
| 캠페인명에 `(이름 없음)` 표시 | `META-002.name = null` | 정규화 시 `raw.name ?? '(이름 없음)'` |
| 집행기간 종료일이 `-` 또는 비어있음 | `NAV-010.endDate = null` | `endDate`는 `null` 유지 → UI에서 분기 |
| 플랫폼이 `Facebook → Meta`, `네이버 → Naver`로 표시됨 | 원본 데이터의 플랫폼명 비표준 | `PLATFORM_NORMALIZE_MAP` 적용 |
| 상태가 `running → 진행중`, `stopped → 종료`로 표시됨 | 원본 데이터의 상태값 비표준 | `STATUS_NORMALIZE_MAP` 적용 |
| 날짜 `2026/04/12` → `2026.04.12` 표시 | `GGL-002.startDate`가 슬래시 포맷 | `normalizeDate`로 하이픈 변환 |
| 테이블에서 일부 캠페인의 CTR/CPC/ROAS가 `0.00` | 필터 기간 내 clicks·impressions·cost가 0 | `safeDivide`로 Division by Zero 방어 |
| 신규 등록 캠페인의 지표가 전부 `0` | `daily_stats` 미존재 | 과제 명세 §3.4 "지표는 0 또는 -으로 표시되어도 무방" |
| 캠페인 랭킹 Top3에서 지표 0인 캠페인이 제외됨 | Division by Zero 방어의 `0`을 "최저값"으로 오해하는 것 방지 | 랭킹 대상을 분모 > 0인 캠페인으로 제한 |
| 플랫폼 Donut 차트에 특정 플랫폼 미노출 | 해당 플랫폼의 메트릭 합계가 0 | `value > 0` 필터 적용 |
| 플랫폼 필터 선택 시 Donut에서 비선택 플랫폼이 흐림 처리로 유지됨 | Donut은 "플랫폼 분포 개요" 위젯이며, 필터는 슬라이스 제거가 아닌 강조/흐림으로 표현 | 훅 집계에서 플랫폼 필터 미적용, 컴포넌트에서 `opacity: 0.3` 적용 (양방향 연동 유지) |
