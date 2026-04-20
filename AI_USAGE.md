# AI 활용 보고서

## 작성자

박지훈

## 사용한 AI 도구

| 도구 | 용도 |
|------|------|
| Claude Code (Claude Opus 4.6) | 프로젝트 설계, 코드 생성, 코드 리뷰, 디버깅, 문서 작성 |
| Figma MCP | Figma 디자인 시스템 분석 및 컴포넌트 스펙 추출 |

## 프롬프트 및 의사결정 과정

### 1. 프로젝트 초기 설계

과제 명세서(MAIN.md)를 분석하여 8개 Phase로 구현 계획을 수립했습니다. Phase별 작업 목록, 커밋 단위, 완료 기준을 문서화하여 체계적으로 진행했습니다.

- 설계 문서 7개 작성 (기술스택, 데이터분석, 폴더구조, 상태관리, 컴포넌트, 구현계획, 디자인시스템)
- 규칙 문서 6개 작성 (코딩규칙, 컨벤션, 코드구조, Phase검토, 문서템플릿, 모호지시처리)

### 2. 데이터 분석

AI를 활용하여 db.json의 80개 캠페인, 1,422개 일별 통계를 전수 분석하여 9건의 예외 데이터를 식별했습니다.

### 3. Figma 디자인 시스템 활용

Figma MCP를 통해 디자인 시스템 원본(node 441:7815)을 분석하고, Button, Input, Badge, Checkbox, DatePicker 등 8개 공통 UI 컴포넌트를 Figma 스펙에 맞춰 구현했습니다.

### 4. 기술 의사결정

| 결정 사항 | AI 제안 | 본인 판단 | 최종 결정 |
|-----------|---------|-----------|-----------|
| 데이터 서버 | Next.js API Route 추천 | json-server가 명세에 명시되어 있으므로 명세를 따라야 함 | json-server + concurrently |
| db.json 원본 보호 | 복사본 전략 제안 | 적절함 | db.serve.json 복사본 사용 |
| DatePicker | 네이티브 input[type=date] 사용 | Figma 디자인 시스템 컴포넌트를 활용해야 함 | Figma 기반 커스텀 DatePicker 구현 |

## AI 결과물을 직접 수정한 판단 사례

### 1. 데이터 서버 전략 변경

AI가 Next.js API Route를 추천했으나, 과제 명세에서 json-server를 명시적으로 언급하고 있어 명세를 정확히 따르는 방향으로 변경했습니다. 3~4년차 프론트엔드 개발자로서 명세 준수가 더 중요하다고 판단했습니다.

### 2. Figma 디자인 시스템 적용 범위 확대

AI가 초기에 네이티브 HTML 요소(input[type=date], 인라인 버튼 등)를 사용했으나, Figma 디자인 시스템에 정의된 컴포넌트를 최대한 활용하도록 수정 지시했습니다. DatePicker, Button, ToggleChip, Icon 등 모든 UI 요소를 Figma 스펙 기반 공통 컴포넌트로 교체했습니다.

### 3. DatePicker 모달 위치 이슈

캠페인 등록 모달 내에서 DatePicker 달력이 모달 overflow에 잘리는 문제가 발생했습니다. AI의 initial 구현(absolute positioning)에서 createPortal + fixed positioning으로 변경하고, calendarSize prop을 추가하여 모달 내부에서는 sm 사이즈를 사용하도록 조정했습니다.

### 4. normalizeDate null safety

API 데이터에서 startDate가 null인 캠페인이 존재하여 정규화 함수가 크래시하는 문제를 발견했습니다. AI가 생성한 타입 정의에서 startDate를 non-null로 가정했으나, 실제 데이터를 검증한 결과 null safety 처리가 필요했습니다.
