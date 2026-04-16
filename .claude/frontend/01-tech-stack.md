# 기술 스택 선정서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 기술 스택 선정서 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-16 |
| 기반 문서 | `.claude/spec/MAIN.md` |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-16 | Claude | 신규 작성 |
| v1.1.0 | 2026-04-16 | Claude | Figma 디자인 시스템 반영 — 폰트(Pretendard, Paperlogy) 추가 |

---

## 2. 필수 스택

| 기술 | 버전 | 선정 근거 |
|------|------|-----------|
| Next.js | 15.x (App Router) | 과제 필수 요건(React 또는 Next.js). App Router 기반 파일 라우팅, ISR/SSR 선택지 확보 |
| TypeScript | 5.x | 과제 필수 요건. strict 모드 활성화 |

---

## 3. 상태 관리

| 기술 | 선정 근거 | 트레이드오프 |
|------|-----------|-------------|
| Zustand | 글로벌 필터 상태 관리. 보일러플레이트 최소, 셀렉터 기반 리렌더링 최적화 | Redux 대비 미들웨어 생태계 제한적이나, 본 과제 규모에서는 불필요 |
| TanStack Query v5 | 서버 데이터(campaigns, daily_stats) 캐싱 및 동기화. 캐시 무효화로 등록 후 즉시 반영 구현 | SWR 대비 mutation/invalidation이 명시적이고 직관적 |

### 선택 사유 상세

- **글로벌 필터 → Zustand**: 필터 상태는 서버 데이터가 아닌 클라이언트 UI 상태. 여러 위젯(차트, 테이블)이 구독하므로 전역 스토어가 적합.
- **API 데이터 → TanStack Query**: json-server 비동기 통신 필수 요건 충족. `queryKey`에 필터 조건을 포함하면 필터 변경 시 자동 리패치. 캠페인 등록 후 `invalidateQueries`로 목록+차트 즉시 반영.

---

## 4. 차트 라이브러리

| 기술 | 선정 근거 | 트레이드오프 |
|------|-----------|-------------|
| Recharts | React 친화적 선언형 API. Line/Bar/Pie(Donut) 차트 모두 지원. 툴팁·범례 내장 | D3 대비 커스터마이징 한계. 본 과제 요구사항 범위에서는 충분 |

### 필요한 차트 유형 매핑

| 과제 요구사항 | 차트 유형 | Recharts 컴포넌트 |
|--------------|-----------|-------------------|
| 3.2 일별 추이 차트 | Line Chart (듀얼 Y축) | `<LineChart>`, `<YAxis yAxisId>` |
| 4.1 플랫폼별 성과 | Donut Chart | `<PieChart>`, `<Pie innerRadius>` |
| 4.2 캠페인 랭킹 Top3 | Horizontal Bar | `<BarChart layout="vertical">` |

---

## 5. 스타일링

| 기술 | 선정 근거 | 트레이드오프 |
|------|-----------|-------------|
| Tailwind CSS v4 | 유틸리티 기반 빠른 UI 구현. 별도 CSS 파일 관리 불필요. 번들 사이즈 최적화 (purge) | 복잡한 동적 스타일은 인라인 처리 필요 |

### 폰트

| 폰트 | 용도 | 출처 |
|------|------|------|
| Pretendard | 주 서체 (UI 전반) | Figma 디자인 시스템 |
| Paperlogy | 보조 서체 (숫자/강조 표시) | Figma 디자인 시스템 |

> 상세 타이포그래피 토큰은 `.claude/frontend/07-design-system.md` 섹션 3을 참조한다.

---

## 6. 데이터 서버

| 기술 | 선정 근거 | 트레이드오프 |
|------|-----------|-------------|
| json-server | 과제 명세에서 권장. `db.json` 기반 REST API 즉시 구축. GET/POST/PATCH 지원 | 실제 서버 로직(유효성 검사 등)은 클라이언트에서 처리 필요 |

### API 엔드포인트

| 메서드 | 경로 | 용도 |
|--------|------|------|
| GET | `/campaigns` | 캠페인 목록 조회 |
| GET | `/daily_stats` | 일별 성과 데이터 조회 |
| POST | `/campaigns` | 캠페인 등록 (세션 내 유지) |
| PATCH | `/campaigns/:id` | 캠페인 상태 변경 (일괄 변경) |

---

## 7. 기타 유틸리티

| 기술 | 용도 |
|------|------|
| date-fns | 날짜 파싱·포맷팅·범위 계산. 트리셰이킹 지원 |
| react-datepicker 또는 자체 구현 | 집행 기간 필터 날짜 선택 UI |
| ESLint + Prettier | 코드 품질 및 포맷 일관성 |

---

## 8. 의존성 요약

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "zustand": "^5",
    "@tanstack/react-query": "^5",
    "recharts": "^2",
    "date-fns": "^4",
    "json-server": "^1"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "eslint": "^9",
    "prettier": "^3"
  }
}
```
