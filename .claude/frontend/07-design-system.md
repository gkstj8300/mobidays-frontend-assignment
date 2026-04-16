# 디자인 시스템 토큰 정의서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 문서명 | 디자인 시스템 토큰 정의서 |
| 버전 | v1.0.0 |
| 작성일 | 2026-04-16 |
| 기반 문서 | Figma `퍼블리싱용 디자인 복사본` (node 441:7815) |

### 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| v1.0.0 | 2026-04-16 | Claude | Figma 디자인 시스템 원본 분석 후 신규 작성 |

---

## 2. 색상 토큰

### 2.1 Primary (Deep Blue 계열)

| 토큰명 | HEX | 용도 |
|--------|-----|------|
| `--color-primary` | `#0D47A1` | Primary 기본 |
| `--color-primary-hover` | `#2162C3` | Primary 호버 |
| `--color-primary-accent` | `#3C79D7` | Secondary 기본, 주요 액센트 |
| `--color-primary-selected` | `#6096E6` | 선택 상태, 탭 활성 |
| `--color-primary-action` | `#007BEE` | 강조 텍스트(action) |
| `--color-primary-disabled` | `rgba(13, 71, 161, 0.4)` | Primary 비활성 |
| `--color-primary-light` | `#ECF3FD` | 연한 파랑 배경 |

### 2.2 Gray Scale (쿨그레이)

| 토큰명 | HEX | 용도 |
|--------|-----|------|
| `--color-text-primary` | `#131416` | 주요 텍스트 |
| `--color-text-secondary` | `#464C53` | 보조 텍스트 |
| `--color-text-disabled1` | `#6D7882` | 비활성 텍스트 1 |
| `--color-text-disabled2` | `#AEB9C2` | 비활성 텍스트 2, 플레이스홀더 |
| `--color-border` | `#CED5DB` | 기본 보더 |
| `--color-border-disabled` | `#E0E5EA` | 비활성 보더 |
| `--color-surface` | `#F4F5F6` | 표면 배경 |
| `--color-surface-pressed` | `#ECEFF1` | 눌림 배경 |
| `--color-table-header` | `#F7FAFF` | 테이블 헤더 배경 |
| `--color-card` | `#FAFCFF` | 카드 배경 |
| `--color-white` | `#FFFFFF` | 흰색 |

### 2.3 Status 색상 (Badge/Tag)

| 상태 | 배경 | 텍스트 | 대시보드 매핑 |
|------|------|--------|--------------|
| Success | `#DDFFD3` | `#1C9E34` | `active` (진행중) |
| Warning | `#FFEFDE` | `#FF9030` | `paused` (일시중지) |
| Disabled | `#EBEBEB` | `#7D7D7D` | `ended` (종료) |
| Danger | `#FFEBEA` | `#FF6161` | 에러 상태 |
| Normal | `#E4EFFF` | `#4586FF` | 정보 표시 |

### 2.4 Stroke 색상

| 토큰명 | HEX | 두께 | 용도 |
|--------|-----|------|------|
| `--stroke-default` | `#CED5DB` | 1px | 인풋 기본 보더 |
| `--stroke-focused` | `#6096E6` | 1px | 인풋 포커스 보더 |
| `--stroke-error` | `#F0312B` | 1px | 인풋 에러 보더 |
| `--stroke-table` | `#E0E4E8` | 1px | 테이블 구분선 |

### 2.5 오버레이

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| `--overlay` | `rgba(5, 27, 60, 0.5)` | 모달 오버레이 |

---

## 3. 타이포그래피 토큰

### 3.1 Pretendard (주 서체)

| 토큰명 | Weight | Size | Line Height | 용도 |
|--------|--------|------|-------------|------|
| `--font-title-lg` | 500 | 48px | 1.1em | 대형 타이틀 |
| `--font-subtitle-lg` | 700 | 32px | 1.2em | 섹션 타이틀 |
| `--font-bold-24` | 700 | 24px | 1em | 위젯 타이틀 |
| `--font-semibold-18` | 600 | 18px | 1.2em | 카드 타이틀 |
| `--font-bold-16` | 700 | 16px | 1.2em | 강조 본문 |
| `--font-semibold-16` | 600 | 16px | 1.2em | 버튼 텍스트 |
| `--font-regular-16` | 400 | 16px | 1.2em | 기본 본문 |
| `--font-semibold-14` | 600 | 14px | 1.2em | 테이블 헤더 |
| `--font-medium-14` | 500 | 14px | 1.2em | 테이블 본문 |
| `--font-medium-12` | 500 | 12px | 1.2em | 캡션, 태그 |
| `--font-regular-12` | 400 | 12px | 1.2em | 보조 텍스트 |
| `--font-medium-10` | 500 | 10px | 1.2em | 뱃지 숫자 |

### 3.2 Paperlogy (보조 서체 — 숫자/강조)

| 토큰명 | Weight | Size | Line Height | 용도 |
|--------|--------|------|-------------|------|
| `--font-num-20` | 600 | 20px | 1.2em | 대형 수치 |
| `--font-num-16` | 600 | 16px | 1.2em | 차트 수치 |
| `--font-num-14` | 600 | 14px | 1.2em | 테이블 수치 |
| `--font-num-12` | 600 | 12px | 1.2em | 보조 수치 |

---

## 4. 간격 & 레이아웃 토큰

### 4.1 Spacing

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| `--spacing-xs` | 4px | 아이콘 내부 간격 |
| `--spacing-sm` | 8px | 컴포넌트 내 간격 |
| `--spacing-md` | 12px | 버튼 수평 패딩 |
| `--spacing-lg` | 16px | 그룹 간 간격 |
| `--spacing-xl` | 20px | 섹션 내 간격 |
| `--spacing-2xl` | 40px | 카드 패딩, 섹션 간격 |

### 4.2 Border Radius

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| `--radius-sm` | 6px | Small 버튼, 옵션 |
| `--radius-md` | 8px | 기본 버튼, 인풋 |
| `--radius-lg` | 20px | 태그/뱃지 |
| `--radius-full` | 9999px | 칩, 탭(pill) |

### 4.3 컴포넌트 크기

| 컴포넌트 | 속성 | 값 |
|----------|------|-----|
| Button (default) | height | 36px |
| Button (small) | height | 30px |
| Icon | size | 18px |
| Icon (large) | size | 20px |
| Icon (small) | size | 16px |

---

## 5. 그림자 & 효과

| 토큰명 | 값 | 용도 |
|--------|-----|------|
| `--shadow-card` | `0px 10px 20px 0px rgba(22, 45, 71, 0.2)` | 카드/모달 그림자 |
| `--backdrop-blur` | `blur(20px)` | 모달 배경 블러 |

---

## 6. 아이콘

아이콘은 Figma에서 18px 기준으로 정의되어 있으며, 기본 fill 색상은 `#3C79D7`이다.

### 대시보드에서 사용할 아이콘

| 아이콘 | Figma 이름 | 사이즈 | 용도 |
|--------|-----------|--------|------|
| 검색 | `icon/search` | 18px | 캠페인 검색 |
| 닫기 | `icon/close` | 18px | 모달 닫기 |
| 달력 | `icon/Calender` | 18px | DatePicker |
| 드롭다운 화살표 | `icon/arrow-down` | 18px | 드롭다운 |
| 필터 | `icon/filter` | 18px | 필터 영역 |
| 차트 | `icon/chart` | 18px | 차트 영역 |
| 체크 | `icon/check` | 18px | 체크박스 |
| 새로고침 | `icon/arrow_360` | 18px | 초기화 버튼 |
| 좌 화살표 | `icon_20/arrow-left` | 20px | 페이지네이션 |
| 우 화살표 | `icon_20/arrow-right` | 20px | 페이지네이션 |
| 상태 경고 | `icon_20/state-warning` | 20px | 유효성 에러 |
| 상태 정보 | `icon_20/state-info` | 20px | 안내 메시지 |
| 상태 완료 | `icon_20/state-done` | 20px | 성공 메시지 |

---

## 7. Figma 컴포넌트 → 프로젝트 컴포넌트 매핑

| Figma 컴포넌트 | 프로젝트 컴포넌트 | 사용 위치 |
|---------------|------------------|-----------|
| `button` (primary/secondary/tertiary) | `shared/ui/Button.tsx` | 전체 |
| `input` (search/input) | `shared/ui/Input.tsx` | 검색, 폼 |
| `Dropdown` | `shared/ui/Select.tsx` | 일괄 상태 변경, 매체 선택 |
| `checkbox` | `shared/ui/Checkbox.tsx` | 테이블 체크박스 |
| `tag_state` | `shared/ui/Badge.tsx` | 캠페인 상태 뱃지 |
| `date picker` | `features/filter/components/DateRangePicker.tsx` | 글로벌 필터 |
| `Tap-BK` / `Tap-Line` | `features/*/components/MetricToggle.tsx` | 메트릭 토글 |
| `input_message` | 폼 에러 메시지 | 캠페인 등록 모달 |

---

## 8. Tailwind 테마 설정 가이드

Phase 1에서 `globals.css` 또는 `tailwind.config.ts`에 아래 토큰을 등록한다.

```css
@theme {
  /* Primary */
  --color-primary: #0D47A1;
  --color-primary-hover: #2162C3;
  --color-primary-accent: #3C79D7;
  --color-primary-selected: #6096E6;
  --color-primary-action: #007BEE;
  --color-primary-light: #ECF3FD;

  /* Gray Scale */
  --color-text-primary: #131416;
  --color-text-secondary: #464C53;
  --color-text-disabled: #6D7882;
  --color-text-placeholder: #AEB9C2;
  --color-border: #CED5DB;
  --color-surface: #F4F5F6;
  --color-table-header: #F7FAFF;
  --color-card: #FAFCFF;

  /* Status */
  --color-status-active-bg: #DDFFD3;
  --color-status-active-text: #1C9E34;
  --color-status-paused-bg: #FFEFDE;
  --color-status-paused-text: #FF9030;
  --color-status-ended-bg: #EBEBEB;
  --color-status-ended-text: #7D7D7D;
  --color-status-error-bg: #FFEBEA;
  --color-status-error-text: #FF6161;

  /* Stroke */
  --color-stroke-default: #CED5DB;
  --color-stroke-focused: #6096E6;
  --color-stroke-error: #F0312B;
  --color-stroke-table: #E0E4E8;

  /* Font Family */
  --font-pretendard: 'Pretendard', sans-serif;
  --font-paperlogy: 'Paperlogy', sans-serif;
}
```
