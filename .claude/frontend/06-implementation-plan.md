# 구현 계획서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 구현 계획서 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-16 |
| 기반 문서 | `.claude/spec/MAIN.md`, `.claude/frontend/01-tech-stack.md` ~ `05-component-design.md` |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-16 | Claude | 신규 작성 |

---

## 2. Phase 총괄

| Phase | 범위 | 산출물 | 커밋 접두어 |
|-------|------|--------|-------------|
| 1 | 프로젝트 초기 설정 + 데이터 API | 프로젝트 뼈대, json-server, 전처리 유틸 | `chore:`, `feat:` |
| 2 | 글로벌 필터 | 필터 UI + Zustand 스토어 | `feat:` |
| 3 | 일별 추이 차트 | 라인 차트 + 메트릭 토글 | `feat:` |
| 4 | 캠페인 관리 테이블 | 테이블 + 정렬/검색/페이지네이션/일괄변경 | `feat:` |
| 5 | 캠페인 등록 모달 | 모달 폼 + 유효성 검사 + 등록 후 동기화 | `feat:` |
| 6 | 플랫폼별 성과 차트 (선택) | Donut 차트 + 양방향 필터 연동 | `feat:` |
| 7 | 캠페인 랭킹 Top3 (선택) | 수평 바 차트 + 메트릭 전환 | `feat:` |
| 8 | 최종 통합 + 문서화 + 최적화 | README, AI_USAGE, 성능 최적화 | `docs:`, `refactor:` |

---

## 3. Phase 상세

### Phase 1 — 프로젝트 초기 설정 + 데이터 API

**목표**: 개발 환경 구축 및 데이터 계층 완성

**작업 목록:**

1. Next.js + TypeScript 프로젝트 생성
2. Tailwind CSS v4 설정
3. ESLint + Prettier 설정
4. json-server 설정 (`db.json` 원본 복사, 실행 스크립트)
5. 폴더 구조 생성 (FSD 기반)
6. 타입 정의 (`types/api.ts`, `types/entities.ts`, `types/common.ts`)
7. 데이터 정규화 함수 (`entities/campaign/model/normalizers.ts`)
8. 파생 지표 계산 함수 (`shared/lib/metrics.ts`)
9. API 클라이언트 + fetch 래퍼 (`shared/api/apiClient.ts`)
10. TanStack Query Provider 설정
11. Query Key 팩토리 (`entities/campaign/api/queryKeys.ts`)
12. 캠페인/일별통계 쿼리 훅 (`useCampaigns`, `useDailyStats`)

**커밋 단위:**
- `chore: Next.js + TypeScript + Tailwind 프로젝트 초기 설정`
- `chore: ESLint + Prettier 설정`
- `feat: json-server 설정 및 db.json 배치`
- `feat: 타입 정의 및 데이터 정규화 함수 구현`
- `feat: API 클라이언트 및 TanStack Query 쿼리 훅 구현`

**완료 기준:**
- `npm run dev`로 빈 페이지 렌더링 확인
- json-server `GET /campaigns`, `GET /daily_stats` 정상 응답
- 정규화 함수가 모든 예외 데이터를 올바르게 처리

---

### Phase 2 — 글로벌 필터

**목표**: 필터 UI 및 상태 관리 완성

**작업 목록:**

1. `useFilterStore` Zustand 스토어 구현
2. `GlobalFilter` 컴포넌트 구현
3. `DateRangePicker` 구현 (당월 초기값)
4. `StatusFilter` 구현 (다중 토글)
5. `PlatformFilter` 구현 (다중 토글)
6. 초기화 버튼 구현
7. DashboardLayout에 필터 배치

**커밋 단위:**
- `feat: 글로벌 필터 Zustand 스토어 구현`
- `feat: 글로벌 필터 UI 컴포넌트 구현`

**완료 기준:**
- 필터 UI가 참고 이미지(image_3-1.png)와 유사하게 렌더링
- 각 필터 토글/날짜 변경이 스토어에 반영
- 초기화 시 모든 필터가 초기값으로 복구

---

### Phase 3 — 일별 추이 차트

**목표**: 필터 연동 라인 차트 완성

**작업 목록:**

1. `useDailyChartData` 훅 구현 (필터 적용 + 일별 합산)
2. `DailyTrendChart` 컴포넌트 구현 (Recharts LineChart)
3. 듀얼 Y축 설정 (노출수 좌, 클릭수 우)
4. `MetricToggle` 구현 (최소 1개 유지 제약)
5. 호버 툴팁 구현
6. 범례(Legend) 표시

**커밋 단위:**
- `feat: 일별 추이 차트 데이터 훅 구현`
- `feat: 일별 추이 차트 UI 및 인터랙션 구현`

**완료 기준:**
- 참고 이미지(image_3-2.png)와 유사한 차트 렌더링
- 글로벌 필터 변경 시 차트 데이터 실시간 갱신
- 메트릭 토글로 노출수/클릭수 on/off, 최소 1개 유지
- 호버 시 툴팁에 날짜별 수치 표시

---

### Phase 4 — 캠페인 관리 테이블

**목표**: 필터 연동 테이블 + 정렬/검색/페이지네이션/일괄변경 완성

**작업 목록:**

1. `useCampaignTable` 훅 구현 (필터 + 검색 + 정렬 + 파생지표 계산)
2. `CampaignTable` 컴포넌트 구현
3. `CampaignSearch` 구현 (실시간 검색 + 건수 표시)
4. 테이블 헤더 정렬 기능 (5개 컬럼)
5. `Pagination` 구현 (10건/페이지)
6. 체크박스 (전체/개별) 선택
7. `BulkStatusChange` 드롭다운 구현
8. `useUpdateCampaignStatus` 뮤테이션 구현
9. 상태 Badge 컴포넌트

**커밋 단위:**
- `feat: 캠페인 테이블 데이터 훅 및 파생 지표 연동`
- `feat: 캠페인 테이블 UI 구현 (검색, 정렬, 페이지네이션)`
- `feat: 캠페인 일괄 상태 변경 기능 구현`

**완료 기준:**
- 참고 이미지(image_3-3.png)와 유사한 테이블 렌더링
- 5개 컬럼 오름차순/내림차순 정렬
- 캠페인명 실시간 검색 + 결과/전체 건수 표시
- 페이지네이션 정상 동작 (10건/페이지)
- 체크박스 선택 → 드롭다운 상태 변경 → 즉시 반영
- 글로벌 필터 연동 정상 동작

---

### Phase 5 — 캠페인 등록 모달

**목표**: 캠페인 등록 폼 + 유효성 검사 + 등록 후 동기화

**작업 목록:**

1. `Modal` 공통 컴포넌트 구현
2. `CampaignFormModal` 구현
3. `FormField` 반복 컴포넌트 구현
4. 유효성 검사 로직 구현
5. `useCreateCampaign` 뮤테이션 구현
6. 등록 성공 후 `invalidateQueries` → 목록+차트 즉시 반영
7. 에러 메시지 필드 하단 표시

**커밋 단위:**
- `feat: 공통 Modal 컴포넌트 구현`
- `feat: 캠페인 등록 모달 폼 및 유효성 검사 구현`
- `feat: 캠페인 등록 후 대시보드 데이터 즉시 동기화`

**완료 기준:**
- 참고 이미지(image_3-4.png)와 유사한 모달 UI
- 모든 유효성 검사 규칙 동작 (필드별 에러 메시지)
- 등록 성공 시 새로고침 없이 테이블 + 차트에 즉시 반영
- 신규 캠페인 지표는 0 또는 `-`로 표시

---

### Phase 6 — 플랫폼별 성과 차트 (선택, 가산점)

**목표**: Donut 차트 + 양방향 필터 연동

**작업 목록:**

1. `usePlatformChartData` 훅 구현
2. `PlatformDonutChart` 컴포넌트 구현
3. 메트릭 토글 (비용/노출수/클릭수/전환수)
4. 수치 + 비중(%) 동시 표기
5. 도넛 세그먼트 클릭 → `useFilterStore.togglePlatform()` 호출

**커밋 단위:**
- `feat: 플랫폼별 성과 Donut 차트 구현`
- `feat: 플랫폼 차트-글로벌 필터 양방향 연동`

**완료 기준:**
- 참고 이미지(image_4-1.png)와 유사한 Donut 차트
- 메트릭 토글 정상 동작
- 차트 클릭 시 글로벌 필터 매체 필터 적용/해제

---

### Phase 7 — 캠페인 랭킹 Top3 (선택, 가산점)

**목표**: 수평 바 차트 + 메트릭 전환

**작업 목록:**

1. `useRankingData` 훅 구현
2. `CampaignRankingTop3` 컴포넌트 구현
3. 메트릭 토글 (ROAS/CTR/CPC)
4. 정렬 방향: ROAS·CTR은 내림차순, CPC는 오름차순

**커밋 단위:**
- `feat: 캠페인 랭킹 Top3 차트 구현`

**완료 기준:**
- 참고 이미지(image_4-2.png)와 유사한 수평 바 차트
- 메트릭 전환 시 정렬 방향 자동 전환
- 글로벌 필터 연동 정상 동작

---

### Phase 8 — 최종 통합 + 문서화 + 최적화

**목표**: 제출 요건 충족 + 품질 마무리

**작업 목록:**

1. 전체 기능 통합 테스트 (브라우저)
2. 불필요한 리렌더링 점검 및 최적화
3. 로딩/에러/빈 데이터 상태 피드백 UI
4. 반응형 레이아웃 확인
5. TypeScript strict 체크 + 린트 0건 확인
6. `README.md` 작성 (실행방법, 기술스택 선택근거, 폴더구조, 컴포넌트 설계)
7. `AI_USAGE.md` 작성 (AI 도구, 프롬프트, 의사결정, 수정 사례)
8. 최종 빌드 확인

**커밋 단위:**
- `refactor: 리렌더링 최적화 및 UX 피드백 개선`
- `docs: README.md 작성`
- `docs: AI_USAGE.md 작성`

**완료 기준:**
- `npm run build` 성공
- `npx tsc --noEmit` 에러 0건
- README.md, AI_USAGE.md 작성 완료
- 전체 기능 정상 동작 (브라우저 확인)

---

## 4. Phase 간 의존 관계

```
Phase 1 (초기 설정 + API)
  ↓
Phase 2 (글로벌 필터)
  ↓
Phase 3 (일별 추이 차트)  ←── Phase 2 필터 스토어 의존
  ↓
Phase 4 (캠페인 테이블)   ←── Phase 2 필터 스토어 의존
  ↓
Phase 5 (캠페인 등록)     ←── Phase 4 테이블 존재 필요 (등록 후 반영 확인)
  ↓
Phase 6 (플랫폼 차트)     ←── Phase 2 필터 스토어 양방향 연동
Phase 7 (랭킹 Top3)       ←── Phase 2 필터 스토어 의존
  ↓
Phase 8 (통합 + 문서화)
```

---

## 5. 커밋 전략

- 각 Phase 내에서 논리적 단위로 분리하여 커밋한다.
- 한 커밋에 하나의 기능 변경만 포함한다.
- Phase 완료 시 `.claude/rules/phase-review-rule.md`의 체크리스트를 대조한다.
- 커밋 메시지는 `CLAUDE.md`의 커밋 컨벤션을 따른다.
