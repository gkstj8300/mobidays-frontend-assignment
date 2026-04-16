# Project Guidelines

## 프로젝트 개요

(주)모비데이즈 프론트엔드 과제 — 마케팅 캠페인 성과 대시보드 구현.
과제 명세: `.claude/spec/MAIN.md`, 데이터: `.claude/data/data.json`, 참고 이미지: `.claude/images/`

## 문서 작성 및 수정 규칙

문서를 작성하거나 수정할 때 반드시 `.claude/rules/document-template-rule.md`를 먼저 읽고 해당 규격을 따른다.

## 모호한 지시 처리 규칙

사용자의 지시가 모호할 경우 임의로 작업을 시작해서는 안된다. `.claude/rules/unclear-rule.md`를 먼저 읽고 해당 규칙을 따른다.

## 코딩 규칙 + 작업단위 가이드라인

프론트엔드 코드를 작성하거나 수정할 때 반드시 `.claude/rules/frontend-coding-rules.md`를 먼저 읽고 해당 규칙을 따른다.

## 코딩 컨벤션

EditorConfig, import 순서, className 포맷, FSD 구조, 네이밍, 라이브러리별 규칙, Git 브랜치 전략은 `.claude/rules/conventions.md`를 따른다.

## 상수·타입 배치

상수 분류, 타입 파일 배치, import 규칙, mapper 패턴은 `.claude/rules/code-organization.md`를 참조한다.

## Phase 검토 규칙

각 구현 Phase 완료 시 검토 절차는 `.claude/rules/phase-review-rule.md`를 따른다.

## 커밋 메시지

하나의 커밋은 하나의 논리적 변경 사항만 담으며 커밋 컨벤션은 아래를 참고한다.

```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드/설정 변경
```