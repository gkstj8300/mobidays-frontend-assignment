# 구현·검토·테스트 보고서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 구현·검토·테스트 보고서 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-20 |
| 기반 문서 | `.claude/spec/MAIN.md`, `.claude/frontend/06-implementation-plan.md`, `.claude/rules/phase-review-rule.md` |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-20 | Claude | MAIN.md 전 섹션(§1~§5) 구현·검토·테스트 결과 정리 — 신규 작성 |
| v1.1.0 | 2026-04-20 | Claude | §9 캠페인 랭킹 CPC 정렬 버그 수정 — 분모 0 캠페인 제외 로직 추가 및 검증 결과 반영 |
| v1.2.0 | 2026-04-20 | Claude | §8 플랫폼 Donut 차트 — 비선택 플랫폼 흐림 처리 동작으로 변경. 훅에서 플랫폼 필터 미적용, 컴포넌트에서 opacity로 표현 |
| v1.3.0 | 2026-04-20 | Claude | §7 캠페인 등록 — 입력 집행금액을 초기 DailyStat으로 생성하여 테이블·차트에 실제 반영되도록 개선 |

---

## 2. 개요

본 문서는 `.claude/spec/MAIN.md`의 각 요구사항 섹션이 어떤 방식으로 구현되고, 어떻게 검토·테스트되었는지를 1:1 대응시켜 기록한다. 각 섹션은 아래 공통 형식을 따른다.

| 소단락 | 내용 |
|--------|------|
| 요구사항 | MAIN.md 원문 항목 요약 |
| 구현 | 적용된 파일·함수 위치와 핵심 로직 |
| 검토 | Phase 완료 시 수행한 자동화/수동 검증 |
| 테스트 | 단위 테스트 또는 브라우저 검증 내역 |
| 커밋 | 관련 Git 커밋 해시(축약) |

MAIN.md 섹션 번호를 그대로 사용한다. 원본 §1(과제 개요)는 지시 사항이 아니므로 생략하고, §2부터 다룬다.

---

## 3. §2 — 데이터 명세 및 전처리

### 3.1 요구사항

- `db.json` 원본은 **수정 금지**
- 비동기 API 통신 (`json-server` 또는 `msw`) 필수, `import` 방식 금지
- 파생 지표 CTR/CPC/ROAS 실시간 계산
- 예외 데이터 **안전 처리** 필수 (평가 포인트)
  - Division by Zero
  - Null Safety
  - 데이터 정규화(포맷 불일치)

### 3.2 구현

| 영역 | 파일 | 핵심 로직 |
|------|------|-----------|
| 원본 보호 | `package.json:8` | `dev:api` 스크립트에서 `db.json → db.serve.json` 복사 후 json-server가 복사본 사용 |
| API 클라이언트 | `src/shared/api/apiClient.ts` | `fetch` 래퍼, base URL `http://localhost:4000` |
| 정규화 (Campaign) | `src/entities/campaign/model/normalizers.ts:14-34` | 플랫폼·상태·날짜 정규화 + null 병합 |
| 정규화 (DailyStat) | `src/entities/campaign/model/normalizers.ts:36-47` | `conversionsValue ?? 0` |
| 정규화 맵 | `src/shared/lib/constants.ts:21-36` | `PLATFORM_NORMALIZE_MAP`, `STATUS_NORMALIZE_MAP` |
| Division by Zero | `src/shared/lib/utils.ts:5-10` | `safeDivide` |
| 파생 지표 | `src/shared/lib/metrics.ts:8-20` | `calcCTR`, `calcCPC`, `calcROAS` — 전부 `safeDivide` 경유 |

### 3.3 예외 데이터 처리 매트릭스

| db.json 케이스 | 원본 값 | 처리 결과 |
|---------------|---------|-----------|
| `GGL-002.startDate` | `"2026/04/12"` | `"2026-04-12"` |
| `GGL-003.budget` | `null` | `0` |
| `META-002.name` | `null` | `"(이름 없음)"` |
| `NAV-010.endDate` | `null` | `null` 유지 → UI에서 "진행중" 표시 |
| `NAV-004.platform` | `"네이버"` | `"Naver"` |
| `META-007.platform` | `"Facebook"` | `"Meta"` |
| `META-009.platform` | `"facebook"` | `"Meta"` |
| `NAV-003.status` | `"stopped"` | `"ended"` |
| `GGL-012.status` | `"running"` | `"active"` |
| `STAT-00003/00154` | 전 지표 0 | CTR/CPC/ROAS 모두 `0` |
| `STAT-00050/00200` | 노출=0, 클릭>0 | CTR=`0` (분모 0 방어) |
| `STAT-00100/00300` | 클릭=0, 비용>0 | CPC=`0` |
| `STAT-00500.conversionsValue` | `null` | `0` → ROAS 계산 시 분자 `0` |

### 3.4 검토

- `npm run dev` 실행 시 json-server가 `db.serve.json`만 변경 → 원본 `db.json`의 git 상태 clean 유지 확인.
- `grep`으로 `import.*db\.json` 문자열이 소스 트리에 없음 확인 → `import` 금지 준수.

### 3.5 테스트

| 테스트 파일 | 대상 | 케이스 수 |
|-------------|------|----------|
| `src/entities/campaign/model/__tests__/normalizers.test.ts` | `normalizeCampaign`, `normalizeDailyStat` | 표준·플랫폼·상태·날짜·null 각 정규화 |
| `src/shared/lib/__tests__/metrics.test.ts` | CTR/CPC/ROAS | 정상 계산 + 분모 0 방어 |
| `src/shared/lib/__tests__/utils.test.ts` | `safeDivide` | 정상·분모 0 |

`npm test` 전 케이스 통과 (exit 0).

### 3.6 관련 커밋

- `2f1b757` feat: 타입 정의 및 데이터 정규화 함수 구현
- `b09b0ec` test: 데이터 정규화 및 파생 지표 단위 테스트
- `b7d390f` chore: dev 스크립트 concurrently 적용 및 db.json 원본 보호
- `3b4c7c3` fix: Windows 환경에서 db.serve.json 복사 실패 수정

---

## 4. §3.1 — 글로벌 필터

### 4.1 요구사항

- 집행 기간 필터 (초기값: 당월 1일~말일)
- 상태 필터 (다중 선택, 초기값: 전체)
- 매체 필터 (다중 선택, 초기값: 전체)
- 초기화 버튼
- AND 조합 적용, 변경 시 **모든 위젯 실시간 동기화**

### 4.2 구현

| 영역 | 파일 | 핵심 로직 |
|------|------|-----------|
| 스토어 | `src/features/filter/store/useFilterStore.ts:30-70` | Zustand — `dateRange`, `statuses`, `platforms` + 액션 |
| 초기값 (기간) | `src/shared/lib/date.ts` | `getFirstDayOfMonth` / `getLastDayOfMonth` |
| 초기값 (상태·매체) | `useFilterStore.ts` | 빈 배열 = "전체" 의미 |
| AND 필터링 | `src/features/campaign-table/hooks/useCampaignTable.ts:25-52` (+ 각 차트 훅) | 날짜 범위 → 상태 → 매체 순 `filter` 체이닝 |
| UI | `src/features/filter/components/GlobalFilter.tsx` | `DateRangePicker`, `StatusFilter`, `PlatformFilter`, 초기화 버튼 |
| 연동 구독 | 각 차트/테이블 훅 | `useFilterStore((s) => s.xxx)` 셀렉터 구독 |

### 4.3 설계 결정

- **`statuses: []` / `platforms: []` = 전체 선택**
  - 초기값이 "전체"임을 체크박스 개별 상태와 독립적으로 표현하기 위해 빈 배열 관례 채택.
  - `length > 0`일 때만 필터 적용 → AND 로직이 자연스럽게 성립.
- **서버 사이드 필터링 미사용**
  - json-server 쿼리 파라미터 제약(날짜 범위 불가)과 데이터 규모(80/1422건)를 고려해 클라이언트 필터링이 더 효율적이라고 판단. (`.claude/frontend/04-state-management.md §4.2`)

### 4.4 검토

- 필터 UI가 참고 이미지 `.claude/images/image_3-1.png`와 유사하게 렌더링되는지 브라우저 확인.
- 초기화 버튼 클릭 시 `dateRange`=당월, `statuses`=`[]`, `platforms`=`[]`로 복구되는지 확인.
- 필터 변경 시 하단 차트·테이블이 즉시 재렌더링되는지 확인.

### 4.5 테스트

- 스토어 단위 테스트는 Tier 2(권장) 범위로 문서화되어 있으나, 시간 배분상 파생지표 Tier 1에 집중하고 수동 검증으로 커버.

### 4.6 관련 커밋

- `717ccd4` feat: 글로벌 필터 Zustand 스토어 구현
- `a4ece7e` feat: 글로벌 필터 UI 컴포넌트 구현
- `c1f2b0f` feat: Figma 기반 DatePicker 공통 컴포넌트 구현 및 필터 적용

---

## 5. §3.2 — 일별 추이 차트

### 5.1 요구사항

- X축(날짜), Y축(수치), 범례 표시
- 메트릭 토글: 노출수·클릭수 (초기값 둘 다 활성)
- **최소 1개 지표 선택 유지** 제약
- 호버 시 날짜별 수치 툴팁

### 5.2 구현

| 영역 | 파일 | 핵심 로직 |
|------|------|-----------|
| 데이터 훅 | `src/features/daily-chart/hooks/useDailyChartData.ts` | 필터 적용 → 날짜별 합산 |
| 차트 | `src/features/daily-chart/components/DailyTrendChart.tsx` | Recharts `LineChart` + 듀얼 Y축 |
| 메트릭 토글 | `src/features/daily-chart/components/MetricToggle.tsx:25-32` | `active.length <= minActive` 시 제거 차단 |

### 5.3 검토

- 글로벌 필터 변경 → 차트 갱신 실시간 확인.
- 활성 메트릭이 1개만 남았을 때 토글 off 시도 → UI 반응 없음(제약 동작) 확인.
- Recharts `Tooltip` 훅 자동 제공, 호버 시 날짜·수치 표시 확인.

### 5.4 테스트

- 수동 검증 (시나리오: 전체 → 매체=Google → 상태=active 단계 변경 시 차트 데이터 일관성).

### 5.5 관련 커밋

- `6bd344b` feat: 일별 추이 차트 데이터 훅 구현
- `891f410` feat: 일별 추이 차트 UI 및 인터랙션 구현
- `eb7b868` fix: DailyTrendChart 미사용 Legend import 제거

---

## 6. §3.3 — 캠페인 관리 테이블

### 6.1 요구사항

- 컬럼 8개: 캠페인명, 상태, 매체, 집행기간, 총 집행금액, CTR, CPC, ROAS
- 정렬 가능 5개: 집행기간, 총 집행금액, CTR, CPC, ROAS
- 캠페인명 실시간 검색 (**테이블에만 적용**, 글로벌 필터 영향 X)
- 결과 건수 / 전체 건수 표시
- 페이지네이션 10건/페이지
- 체크박스 일괄 상태 변경 (평가 포인트)

### 6.2 구현

| 영역 | 파일 | 핵심 로직 |
|------|------|-----------|
| 데이터 훅 | `src/features/campaign-table/hooks/useCampaignTable.ts` | 필터 → 파생지표 계산 → 검색 → 정렬 → 페이지네이션 파이프라인 |
| 테이블 | `src/features/campaign-table/components/CampaignTable.tsx:141` | `columns` 배열 8개 정의 |
| 정렬 대상 | `src/features/campaign-table/constants.ts:5` | `SORTABLE_COLUMNS = ['period','totalCost','ctr','cpc','roas']` |
| 검색 | `src/features/campaign-table/components/CampaignSearch.tsx` | 로컬 `useState`, 글로벌 스토어 비구독 |
| 건수 표시 | `CampaignSearch.tsx:38-40` | `{resultCount}건 / {totalCount}건` |
| 페이지네이션 | `src/features/campaign-table/components/Pagination.tsx` + `ROWS_PER_PAGE=10` (`shared/lib/constants.ts:7`) | |
| 일괄 상태 변경 | `src/features/campaign-table/components/BulkStatusChange.tsx` + `useUpdateCampaignStatus` | `PATCH /campaigns/:id` × N + `invalidateQueries` |

### 6.3 설계 결정

- **검색은 로컬 `useState`, 필터는 Zustand**
  - 검색어는 테이블에만 영향 → 다른 위젯 리렌더 방지 목적.
- **파생지표 계산은 필터 후 1회**
  - `useMemo`로 `campaigns × dailyStats` 조합 계산을 캐싱 → 정렬·페이지 변경 시 재계산 방지.

### 6.4 검토

- 8개 컬럼 및 5개 정렬 동작 브라우저 확인.
- 검색어 "Google" 입력 시 글로벌 차트 불변 → 테이블만 필터링됨을 확인.
- 10건 초과 시 페이지네이션 정상 분할.
- 체크박스 일괄 변경 → 상태 Badge 즉시 갱신(`invalidateQueries` 경로).

### 6.5 관련 커밋

- `65a3a5f` feat: 캠페인 테이블 데이터 훅 및 파생 지표 연동
- `92ff98c` feat: 캠페인 테이블 UI 구현 (검색, 정렬, 페이지네이션, 일괄 상태 변경)

---

## 7. §3.4 — 캠페인 등록 모달

### 7.1 요구사항

| 필드 | 유효성 규칙 |
|------|-------------|
| 캠페인명 | 2자~100자 |
| 광고 매체 | Google / Meta / Naver 중 택1 |
| 예산 | 정수, 100원 ~ 10억원 |
| 집행 금액 | 정수, 0원 ~ 10억원, 예산 초과 불가 |
| 시작일 | 필수 |
| 종료일 | 시작일 이후 |

기타:
- 검사 실패 시 필드 하단 에러 메시지
- 등록 성공 시 `status=active` 고정, ID 자동 생성
- **새로고침 없이 목록·차트 즉시 반영** (평가 포인트)
- 신규 캠페인 지표는 `0` 또는 `-`로 표시 (daily_stats 없음)

### 7.2 구현

| 영역 | 파일 | 핵심 로직 |
|------|------|-----------|
| 폼 훅 | `src/features/campaign-form/hooks/useCampaignForm.ts:62-90` | 필드별 유효성 검사 → `errors` 객체 누적 |
| 모달 | `src/features/campaign-form/components/CampaignFormModal.tsx` | `status: 'active'` 고정, `id: NEW-${Date.now()}` |
| 뮤테이션 | `src/entities/campaign/hooks/useCampaignMutation.ts:14-20` | `POST /campaigns` 성공 후 `invalidateQueries(campaignKeys.all)` |
| 에러 메시지 | `CampaignFormModal.tsx` 각 `FormField` | `errorMessage` prop으로 필드 하단 렌더링 |
| 신규 지표 0 표시 | `useCampaignTable.ts:54-77` | dailyStats 필터 결과 빈 배열 → 합산 0 → safeDivide로 0 |

### 7.3 검토

- 케이스별 검증:
  - 이름 1자 / 101자 → 에러.
  - 예산 99 / 1,000,000,001 → 에러.
  - 집행 금액 > 예산 → 에러.
  - 종료일 < 시작일 → 에러.
- 정상 입력 후 등록 → 모달 자동 닫힘, 테이블 최상단에 신규 행 추가, 차트 데이터 갱신(신규 dailyStats 없으므로 일별 합산은 불변이지만 캐시 재조회 확인).
- 신규 캠페인의 `총 집행금액=₩0`, `CTR=0.00%`, `CPC=0`, `ROAS=0.00%` 표시 확인 — MAIN.md가 "0 또는 -" 허용하므로 0 표시로 충족.

### 7.4 관련 커밋

- `fd8f6e3` feat: 공통 Modal 컴포넌트 구현
- `4142fd7` feat: 캠페인 등록 모달 폼, 유효성 검사, 등록 후 동기화 구현
- `a9b2d8a` fix: DatePicker Portal 전환 및 캠페인 등록 모달 UI 개선

### 7.5 개선 — 집행금액 입력값 실제 반영

**배경**: 초기 구현은 폼에서 `집행금액(cost)`을 입력·검증하되 서버 페이로드에 포함시키지 않아, MAIN.md §3.4 "과제 편의상 초기값으로 직접 입력받습니다"의 의도가 실현되지 않았다. 테이블의 "총 집행금액" 컬럼은 신규 캠페인 등록 시 항상 `₩0`이었다.

**Campaign 스키마 제약**: Campaign 타입에는 `cost` 필드가 없고 `DailyStat`에만 존재한다. 따라서 Campaign에 필드를 추가하는 방식은 명세 위반이다.

**해결**: 등록 성공 후 입력값을 초기 `DailyStat` 한 건으로 생성한다. `startDate` 기준 노출/클릭/전환 = 0, cost만 입력값으로 채움.

| 파일 | 변경 |
|------|------|
| `src/entities/campaign/api/campaignApi.ts` | `createDailyStat` 함수 추가 (`POST /daily_stats`) |
| `src/entities/campaign/hooks/useCampaignMutation.ts` | `useCreateCampaign` 시그니처를 `{ campaign, initialCost }`로 변경, `initialCost > 0`일 때 `createCampaign → createDailyStat` 체이닝. `invalidateQueries`에 `dailyStatKeys.all` 추가 |
| `src/features/campaign-form/components/CampaignFormModal.tsx` | mutate 호출 시 `initialCost: Number(formData.cost)` 전달 |

**효과**:
- 테이블 "총 집행금액" 컬럼에 입력값 즉시 표시
- 플랫폼 Donut의 cost 메트릭에도 집계됨
- CTR/CPC/ROAS는 클릭·노출이 0이므로 여전히 0 (명세 §3.4 "0 또는 -" 허용 범위 내)
- 일별 추이 차트의 해당 `startDate` 포인트에 cost 포인트만 추가 (노출/클릭은 0)

**엣지 케이스**: `initialCost === 0`이면 DailyStat을 생성하지 않음(빈 레코드 회피). 결과적으로 기존 동작(테이블 ₩0)과 동일.

---

## 8. §4.1 — 플랫폼별 성과 차트 (선택)

### 8.1 요구사항

- Donut 차트, 플랫폼별(Google/Meta/Naver) 비중
- 메트릭 토글: 비용/노출수/클릭수/전환수 (기본값 비용)
- 수치와 비중(%) 동시 표기
- **차트 클릭 시 글로벌 필터 양방향 연동** (평가 포인트)

### 8.2 구현

| 영역 | 파일 | 핵심 로직 |
|------|------|-----------|
| 데이터 훅 | `src/features/platform-chart/hooks/usePlatformChartData.ts` | 필터 적용 → 플랫폼별 집계 |
| 차트 | `src/features/platform-chart/components/PlatformDonutChart.tsx:108` | `PieChart + innerRadius={55}` |
| 메트릭 토글 | 동 파일 `:27-32` | 기본값 `'cost'` |
| 수치+% | 동 파일 `:171-175` | `value.toLocaleString` + `percentage.toFixed(1)` |
| 양방향 연동 | 동 파일 `:111` | `onClick={() => togglePlatform(platform)}` |

### 8.3 검토

- Google 영역 클릭 → 글로벌 필터의 매체 `Google` 토글 → 모든 위젯 데이터 재필터링.
- 재클릭 시 필터 해제.

### 8.4 관련 커밋

- `d51fa8a` feat: 플랫폼별 성과 Donut 차트 + 글로벌 필터 양방향 연동

### 8.5 동작 변경 — 비선택 플랫폼 흐림 처리

**현상 (수정 전)**: 글로벌 매체 필터에서 일부 플랫폼(예: Google, Naver)만 선택하면 Donut에 해당 2개 슬라이스만 표시되고 나머지(Meta)는 완전히 사라짐.

**기대 동작**: 참고 이미지 `.claude/images/image_4-1.png`와 같이 3개 플랫폼 모두 표시하되, 비선택 플랫폼은 opacity를 낮춰 흐림 처리.

**설계 판단**: 도넛 차트는 "플랫폼 분포 개요" 위젯으로, 양방향 연동(차트 클릭 → 필터 토글)이 주 사용 방식이다. 플랫폼 필터를 차트 데이터 집계에도 적용하면 필터를 건 순간 위젯이 축소되어 양방향 연동의 효용이 사라진다. 따라서 **이 위젯만 예외적으로 플랫폼 필터를 집계에서 제외**하고 시각적 강조/흐림으로 표현한다. 날짜·상태 필터는 기존대로 집계에 적용된다.

**구현**: `src/features/platform-chart/hooks/usePlatformChartData.ts` 의 `filterCampaigns`에서 `platforms` 파라미터 제거. 컴포넌트 `PlatformDonutChart.tsx:117-121, 141, 156, 168` 의 `opacity` 분기는 이미 존재하여 수정 불필요.

**기타 위젯과의 차이 (의도된 예외)**: 일별 추이 차트·캠페인 테이블·랭킹은 모두 플랫폼 필터를 집계에 반영한다. 도넛 차트만 집계에서 제외하는 이유는 위젯의 의미론적 역할 차이 때문이다.

---

## 9. §4.2 — 캠페인 랭킹 Top3 (선택)

### 9.1 요구사항

- 수평 Bar, 상위 3개 캠페인
- 메트릭 토글: ROAS / CTR / CPC (기본값 ROAS)
- **정렬 방향**: ROAS·CTR은 내림차순(높을수록 상위), CPC는 오름차순(낮을수록 상위) — 평가 포인트

### 9.2 구현

| 영역 | 파일 | 핵심 로직 |
|------|------|-----------|
| 데이터 훅 | `src/features/ranking/hooks/useRankingData.ts:96-98` | `metric === 'cpc' ? (a-b) : (b-a)` 분기 |
| 차트 | `src/features/ranking/components/CampaignRankingTop3.tsx` | flex 기반 수평 bar + 상대 길이 계산 |
| 메트릭 토글 | 동 파일 | 기본값 `'roas'` |

### 9.3 검토

- 각 메트릭 전환 시 Top3 순서가 재계산되고, CPC 선택 시 낮은 값이 1위로 올라오는지 확인.
- 글로벌 필터 변경과 연동되는지 확인.

### 9.4 관련 커밋

- `af58e54` feat: 캠페인 랭킹 Top3 차트 구현

### 9.5 버그 수정 — CPC 정렬 시 분모 0 캠페인이 1·2위로 올라오는 문제

**현상**: CPC 탭 선택 시 필터 기간 내 클릭이 전혀 없는 캠페인이 CPC=0으로 계산되어 오름차순 정렬의 최상단에 노출됨.

**원인**: `safeDivide`는 Division by Zero 방어용으로 `0`을 반환하는데, 이 값이 랭킹 정렬에서는 "정의 불가(undefined)"가 아닌 "최저값"으로 해석됨.

**해결**: `useRankingData.ts`에서 정렬 직전, 선택 메트릭의 **분모가 0인 캠페인을 랭킹 대상에서 제외**.

| 메트릭 | 분모 | 제외 조건 |
|--------|------|----------|
| CPC | 클릭수 | `totalClicks > 0` 통과 |
| CTR | 노출수 | `totalImpressions > 0` 통과 |
| ROAS | 집행비용 | `totalCost > 0` 통과 |

**영향 범위**: `src/features/ranking/hooks/useRankingData.ts` 단일 파일. 랭킹 차트 외 영역(테이블·도넛·일별 추이)은 변경 없음.

**타 영역 재검토**:
- 도넛 차트(`usePlatformChartData.ts:101`)는 이미 `value > 0` 필터가 있어 동일 이슈 없음.
- 테이블(`useCampaignTable.ts`)은 전체 리스트 탐색용 view이며, MAIN.md가 신규 캠페인 지표 "0 또는 -" 표시를 허용하므로 정렬 동작을 유지.

---

## 10. §5 — 제출 및 문서화

### 10.1 요구사항

- `README.md`: 실행 방법, 기술 스택 선택 근거, 폴더 구조, 컴포넌트 설계
- `AI_USAGE.md`: AI 도구·프롬프트·의사결정·수정 사례

### 10.2 산출물

| 파일 | 라인 수 | 포함 섹션 |
|------|--------|-----------|
| `README.md` | 171 | 실행방법 / 기술스택(Next.js·Zustand·TanStack Query·Recharts·Tailwind) 선택근거 / FSD 폴더구조 / 컴포넌트 설계 원칙 |
| `AI_USAGE.md` | 55 | 사용 도구(Claude Code + Figma MCP) / 프롬프트·의사결정 요약 / 직접 수정 사례 |

### 10.3 관련 커밋

- `2b78875` docs: README.md 작성
- `c0e1333` docs: AI_USAGE.md 작성

---

## 11. 자동화 검증 종합

최종 점검(2026-04-20) 결과:

| 검증 | 명령 | 결과 |
|------|------|------|
| 타입 체크 | `npx tsc --noEmit` | exit 0 |
| 린트 | `npm run lint` | exit 0 |
| 빌드 | `npm run build` | exit 0 |
| 단위 테스트 | `npm test` | exit 0 |

---

## 12. Phase ↔ 평가 포인트 매핑

| Phase | MAIN.md 섹션 | 관련 평가 항목(배점) |
|-------|-------------|---------------------|
| 1 | §2 데이터 명세 | 데이터 전처리(10), 코드 품질(15), 아키텍처(20 일부) |
| 2 | §3.1 글로벌 필터 | 상태관리·데이터 흐름(10) |
| 3 | §3.2 일별 추이 차트 | 구현 완성도(10 일부) |
| 4 | §3.3 캠페인 테이블 | 구현 완성도(10), 상태관리(10 일부) |
| 5 | §3.4 캠페인 등록 | 상태관리·데이터 흐름(10) |
| 6 | §4.1 플랫폼 차트 | 선택 과제(10 일부) |
| 7 | §4.2 캠페인 랭킹 | 선택 과제(10 일부) |
| 8 | 전체 통합 | AI 활용도(20), UX·접근성(10), 렌더링 성능(5) |

---

## 13. 한계 및 트레이드오프

| 항목 | 결정 | 사유 |
|------|------|------|
| 스토어 단위 테스트 미작성 | `useFilterStore` 테스트 생략 | 시간 배분상 Tier 1(전처리)에 집중. 수동 검증으로 커버 |
| 서버 사이드 필터링 미사용 | 클라이언트 필터링 | json-server 쿼리 제약 + 데이터 규모 작음(80/1422건) |
| 신규 캠페인 지표 표시 | `0`으로 표시 | MAIN.md가 "0 또는 -" 허용. 별도 "-" 렌더 분기 추가 시 복잡도 증가 |
