# 코딩 컨벤션

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 코딩 컨벤션 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-16 |
| 기반 문서 | 없음 |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-16 | Claude | 신규 작성 — 기존 내용을 문서 규격에 맞춰 재정리, 타 문서 중복 항목 제거 |

---

## 2. EditorConfig

`.editorconfig` 설정을 준수한다.

- **Indent Style**: Space (2 spaces)
- **Max Line Length**: 100 characters
- **End of Line**: LF
- **Insert Final Newline**: true (파일 끝에 빈 줄 추가)

---

## 3. Import 순서

가독성을 위해 모든 파일 상단의 import는 아래 우선순위에 따라 그룹화하며, 각 그룹 사이에는 한 줄의 공백을 둔다.

1. **Packages**: react, next, 외부 라이브러리 (framer-motion 등)
2. **API**: API 서비스, React Query hooks, Type 정의
3. **Components**: UI 및 비즈니스 컴포넌트
4. **Hooks**: 프로젝트 내부 커스텀 훅
5. **Utils**: 유틸리티 함수, 상수(constants)
6. **Etc**: Icons, Images, CSS/SCSS 등

---

## 4. JSX className 포맷

가독성과 Git Diff의 명확성을 위해 아래 규칙을 적용한다.

- 반드시 템플릿 리터럴(`` ` ` ``)을 사용한다.
- 한 줄에 하나의 클래스만 작성한다.
- 첫 줄과 끝 줄은 가독성을 위해 비워둔다.

```tsx
<div
  className={`
    fixed
    top-0
    left-0
    w-full
    flex
    items-center
    bg-white
  `}
>
  Content
</div>
```

---

## 5. 프로젝트 구조 (FSD)

Feature-Sliced Design (FSD) 구조를 채택한다. 비즈니스 로직의 응집도를 위해 Features 레이어를 최우선으로 설계한다.

| 디렉터리 | 역할 |
|----------|------|
| `app/` | 앱의 진입점, 글로벌 설정, 라우팅 정의 |
| `features/` | [핵심] 도메인별 독립적인 기능 단위 (ex: filter, chart, campaign-table) |
| `entities/` | 비즈니스 실체와 그에 따른 로직 (ex: campaign, daily-stat) |
| `widgets/` | features와 entities를 조합한 독립적인 화면 블록 (ex: header, dashboard) |
| `shared/` | 프로젝트 전반에서 재사용되는 UI-Kit, Utils, API Client 등 |

---

## 6. 네이밍 컨벤션

### 6.1 함수 (동사 중심)

| 접두어 | 용도 |
|--------|------|
| `fetch...` | API 호출 등 네트워크를 통한 비동기 데이터 통신 |
| `get...` | 스토어, 로컬 스토리지 접근 또는 단순 계산된 값 반환 |
| `handle...` | 컴포넌트 내부에서 정의하는 이벤트 핸들러 |
| `on...` | 부모로부터 Props로 전달받는 이벤트 핸들러 |

### 6.2 변수 (명사 및 형용사 중심)

- **배열**: 복수형 어미(`s`)를 사용한다. 접미사(`List`, `Array`)는 사용하지 않는다.
  - `users`, `products` (O) / `userList`, `productArray` (X)
- **Boolean**:
  - `is...`: 상태나 성질 (`isLoading`, `isOpen`)
  - `has...`: 소유 여부 (`hasToken`, `hasError`)
  - `can...`: 권한이나 가능 여부 (`canEdit`, `canSubmit`)

> 상수 네이밍(`UPPER_SNAKE_CASE`)은 `.claude/rules/code-organization.md` 섹션 4를 따른다.

---

## 7. Best Practices

- **Always Use Braces**: `if`, `for`, `while` 등의 제어문 뒤에는 한 줄이라도 반드시 중괄호 `{}`를 사용한다.
- **Early Return**: 조건문 중첩을 피하기 위해 부정 조건이나 예외 상황은 함수 상단에서 즉시 리턴한다.
- **Magic Number & String**: 의미를 알기 어려운 숫자나 문자열은 상수로 선언하여 사용한다.
- **Optional Chaining**: 객체 속성 접근 시 `?.`와 `??`를 사용하여 안전하게 작성한다.
- **Prop Destructuring**: 컴포넌트 인자에서 Props를 직접 구조 분해 할당하여 사용한다.

> Type Safety(`any` 금지, `as any`/`@ts-ignore` 우회 금지)는 `.claude/rules/frontend-coding-rules.md` 섹션 6을 따른다.

---

## 8. 라이브러리별 규칙

### 8.1 TanStack Query (Data Fetching)

- **Query Keys**: `shared/api/query-keys`에서 중앙 관리하여 키 충돌을 방지한다.
- **Custom Hooks**: 모든 쿼리와 뮤테이션은 컴포넌트 내부에 직접 작성하지 않고, 기능별 `use...Query` 형태의 커스텀 훅으로 추출한다.
- **Selection**: 컴포넌트에서 필요한 형태로 데이터를 가공해야 한다면 `select` 옵션을 활용한다.

### 8.2 Zustand (State Management)

- **Atomic State**: 스토어는 가급적 작게 유지하며, 서로 관련 없는 상태는 별도의 스토어로 분리한다.
- **Selectors**: `const { state } = useStore()`처럼 전체를 가져오지 않고, `const state = useStore(state => state.value)`와 같이 셀렉터를 사용하여 불필요한 리렌더링을 방지한다.
- **Action Logic**: 상태 변경 로직(Actions)은 가급적 스토어 내부에 정의하여 캡슐화한다.

---

## 9. Git 브랜치 전략

- **main**: 배포를 위한 안정적인 브랜치
- **develop**: 기능 개발 브랜치
- **작업 브랜치**: `[작업유형/이슈번호_작업내용]` 형식 (ex: `feature/#1_card-layout`)

> 커밋 컨벤션은 `CLAUDE.md`의 커밋 메시지 섹션을 따른다.
