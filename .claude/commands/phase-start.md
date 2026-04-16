# Phase 시작

사용자가 `/project:phase-start <N>` 으로 호출한다. `<N>`은 Phase 번호(1~8)이다.

## 실행 절차

### 1단계: Phase 정보 로드

`.claude/frontend/06-implementation-plan.md`에서 해당 Phase의 상세 정보를 로드한다.
아래 항목을 출력한다:

- **Phase 번호 및 범위**
- **목표**
- **작업 목록** (번호 리스트)
- **커밋 단위** (예정 커밋 목록)
- **완료 기준**

### 2단계: 선행 Phase 완료 확인

Phase 2 이상인 경우, `.claude/frontend/06-implementation-plan.md`의 Phase 간 의존 관계를 확인한다.
선행 Phase의 핵심 산출물이 존재하는지 파일 시스템을 탐색하여 확인한다.

| Phase | 선행 확인 항목 |
|-------|---------------|
| 2 | Phase 1: `src/` 폴더 존재, `db.json` 존재, json-server 설정 파일 존재 |
| 3 | Phase 2: `useFilterStore` 파일 존재 |
| 4 | Phase 2: `useFilterStore` 파일 존재 |
| 5 | Phase 4: `CampaignTable` 컴포넌트 존재 |
| 6 | Phase 2: `useFilterStore` 파일 존재 |
| 7 | Phase 2: `useFilterStore` 파일 존재 |
| 8 | Phase 5 이상 주요 컴포넌트 존재 |

확인 결과를 표로 출력한다. 미충족 항목이 있으면 경고한다.

### 3단계: 관련 설계 문서 안내

해당 Phase 구현에 참고해야 할 설계 문서 목록을 출력한다.

| 참고 문서 | 참조 섹션 |
|-----------|-----------|
| `.claude/spec/MAIN.md` | 해당 Phase의 과제 섹션 |
| `.claude/frontend/03-folder-structure.md` | 파일 배치 위치 |
| `.claude/frontend/04-state-management.md` | 상태 관리 설계 |
| `.claude/frontend/05-component-design.md` | 컴포넌트 Props 인터페이스 |
| `.claude/rules/phase-review-rule.md` | 완료 시 체크리스트 |

### 4단계: 참고 이미지 로드

해당 Phase에 대응하는 참고 이미지가 있으면 로드하여 표시한다.

| Phase | 참고 이미지 |
|-------|------------|
| 2 | `.claude/images/image_3-1.png` |
| 3 | `.claude/images/image_3-2.png` |
| 4 | `.claude/images/image_3-3.png` |
| 5 | `.claude/images/image_3-4.png` |
| 6 | `.claude/images/image_4-1.png` |
| 7 | `.claude/images/image_4-2.png` |

### 5단계: 평가 포인트 알림

`.claude/rules/phase-review-rule.md`의 섹션 7 평가 포인트 대조표에서 해당 Phase와 관련된 평가 항목과 배점을 출력한다.

### 6단계: 시작 확인

아래 형식으로 요약을 출력하고 사용자에게 진행 여부를 확인한다.

```
## Phase <N> 시작 준비

### 목표
(한 줄 요약)

### 작업 목록
1. ...
2. ...

### 선행 조건
| 항목 | 상태 |
|------|------|
| ... | 충족 / 미충족 |

### 관련 평가 포인트
| 평가 항목 | 배점 |
|-----------|------|
| ... | ... |

### 커밋 계획
- `feat: ...`
- `feat: ...`

Phase <N> 작업을 시작할까요?
```
