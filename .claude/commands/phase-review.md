# Phase 완료 검토

사용자가 `/project:phase-review <N>` 으로 호출한다. `<N>`은 Phase 번호(1~8)이다.

## 실행 절차

### 1단계: 대상 Phase 확인

`.claude/rules/phase-review-rule.md`의 섹션 5에서 해당 Phase의 체크리스트를 로드한다.
체크리스트 항목을 사용자에게 표로 출력한다.

### 2단계: 자동화 검증

아래 명령어를 순서대로 실행하고 결과를 기록한다. 명령어 실패 시 중단하지 않고 모두 실행한 뒤 결과를 종합한다.

```bash
npx tsc --noEmit        # 타입 체크
npm run lint             # 린트
npm run build            # 빌드
```

각 명령어의 PASS/FAIL 결과를 표로 출력한다.

### 3단계: 과제 명세 대조

`.claude/spec/MAIN.md`에서 해당 Phase의 과제 섹션을 읽고, 체크리스트 항목과 1:1 대조한다.
누락된 요구사항이 있으면 경고로 출력한다.

### 4단계: 참고 이미지 대조

해당 Phase에 대응하는 참고 이미지가 있으면 로드하여 현재 구현과 비교 포인트를 안내한다.

| Phase | 참고 이미지 |
|-------|------------|
| 2 | `.claude/images/image_3-1.png` |
| 3 | `.claude/images/image_3-2.png` |
| 4 | `.claude/images/image_3-3.png` |
| 5 | `.claude/images/image_3-4.png` |
| 6 | `.claude/images/image_4-1.png` |
| 7 | `.claude/images/image_4-2.png` |

### 5단계: 회귀 확인 안내

Phase 2 이상인 경우, 이전 Phase들의 기능이 정상 동작하는지 브라우저에서 수동 확인할 항목 목록을 출력한다.

### 6단계: 결과 종합

아래 형식으로 최종 결과를 출력한다.

```
## Phase <N> 검토 결과

### 자동화 검증
| 항목 | 결과 |
|------|------|
| 타입 체크 | PASS / FAIL |
| 린트 | PASS / FAIL |
| 빌드 | PASS / FAIL |

### 체크리스트
| 검토 항목 | 결과 | 비고 |
|-----------|------|------|
| ... | PASS / FAIL / 수동 확인 필요 | |

### 누락 요구사항
(없으면 "없음")

### 회귀 확인 필요 항목
(Phase 1이면 "해당 없음")

### 종합 판정
- PASS: 모든 필수 항목 통과
- FAIL: 미통과 항목 N건 — 수정 후 재검토 필요
```
