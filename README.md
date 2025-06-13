# 🚀 AI Quiz Generator 인수인계 문서

## 1. 프로젝트 개요
**프로젝트명**: AI Quiz Generator  
**설명**: Next.js(앱 라우터)와 TypeScript 기반 프론트엔드 애플리케이션으로, AI를 활용하여 영어 퀴즈(객관식, 텍스트→이미지 변환 등)를 생성·관리하고 사용자에게 CEFR 레벨에 따른 사전 테스트(Pretest)를 제공합니다.

**주요 기능**:
- **퀴즈 플레이어**: AI가 생성한 퀴즈를 순차적으로 제공하고, 정답 확인 및 점수 집계 → CEFR 레벨 산출
- **퀴즈 유형 지원**: TEXT_TO_TEXT, TEXT_TO_IMAGE, IMAGE_TO_TEXT, DEFINITION_TO_IMAGE 모드
- **관리자 대시보드(Admin Panel)**:
  - **Generate Quiz**: CEFR 레벨과 유닛(Unit) 선택 후 AI 퀴즈 자동 생성
  - **Manage Quiz**: 퀴즈 항목 직접 생성·수정·삭제(CRUD)
  - **Manage Sections**: 섹션(Section) CRUD
  - **Manage Units**: 유닛(Unit) CRUD
  - **Manage Stories**: 스토리(Story) CRUD 및 AI 기반 스토리 생성
  - **Manage Vocab**: 어휘(Vocabulary) CRUD

## 2. 주요 라이브러리 설명

| 라이브러리     | 용도                                                       |
| ------------- | --------------------------------------------------------- |
| Next.js       | React 기반 SSR/SSG 프레임워크(App Router, 파일 기반 라우팅) |
| React         | UI 빌딩 블록(컴포넌트 상태관리, 라이프사이클)               |
| TypeScript    | 정적 타입 검사(Type 안전성 향상, 개발 생산성)              |
| Tailwind CSS  | 유틸리티 클래스 기반 스타일링                              |
| Axios         | HTTP 클라이언트(API 통신)                                  |
| next/font     | Google Fonts 최적화(Geist 폰트 로딩)                       |

## 3. 페이지 구조

```plaintext
app/
├─ admin/
│  ├─ _api/               # 관리자용 API 호출 모듈 (quiz.api.ts 등)
│  ├─ _components/        # 관리자 UI 컴포넌트(GenerateQuiz, ManageQuiz 등)
│  │  └─ _quiz_components/ # 퀴즈 관련 내부 컴포넌트(QuizForm, QuizList...)
│  └─ page.tsx            # 관리자 대시보드 진입점
├─ components/            # 공용 컴포넌트(QuizPlayer, UI 컴포넌트 라이브러리)
│  └─ ui/                 # Button, Card, Select, Tabs 등
├─ lib/                   # 공용 유틸리티(api 인스턴스)
├─ types/                 # TypeScript 타입 정의
├─ sections/              # 섹션 선택 후 유닛 목록 페이지
│  └─ [id]/page.tsx
├─ unit/                  # 유닛 선택 후 퀴즈 목록 페이지
│  └─ [id]/page.tsx
├─ layout.tsx             # 루트 레이아웃 및 전역 스타일 적용
├─ page.tsx               # 메인(Home) 페이지
└─ globals.css            # 전역 스타일(CSS 변수, 다크모드)
```

## 4. 주요 컴포넌트 및 API 모듈 역할

### 4-1. 공용 UI 컴포넌트 (`app/components/ui`)
| 컴포넌트       | 설명                           |
| ----------- | ----------------------------- |
| `Button.tsx`| 클릭 가능한 버튼              |
| `Card.tsx`  | 카드 레이아웃 컨테이너         |
| `Select.tsx`| 드롭다운 셀렉트 박스           |
| `Tabs.tsx`  | 탭 네비게이션                |

### 4-2. 퀴즈 플레이어 (`app/components/QuizPlayer.tsx`)
- `/generate/list` API 호출로 퀴즈 목록 조회 후 순차적 렌더링
- 옵션 선택/텍스트 입력 기반 응답 처리
- 정답 검증 및 점수 집계 → CEFR 레벨(예: A1, A2, B1, B2+) 표시

### 4-3. 관리자 대시보드 컴포넌트 (`app/admin/_components`)
| 컴포넌트             | 설명                                |
| ------------------- | --------------------------------- |
| `GenerateQuiz.tsx`  | CEFR, Unit 선택 후 AI 퀴즈 생성 폼    |
| `ManageQuiz.tsx`    | 퀴즈 CRUD 관리 뷰                   |
| `ManageSections.tsx`| 섹션(Section) CRUD 관리 뷰         |
| `ManageUnits.tsx`   | 유닛(Unit) CRUD 관리 뷰            |
| `ManageStories.tsx` | 스토리(Story) CRUD/AI 생성 뷰     |
| `ManageVocab.tsx`   | 어휘(Vocab) CRUD 관리 뷰          |

#### 퀴즈 내부 컴포넌트 (`app/admin/_components/_quiz_components`)
| 컴포넌트          | 설명                                |
| ---------------- | --------------------------------- |
| `QuizForm.tsx`    | 퀴즈 질문/옵션/정답/설명 입력 폼     |
| `QuizList.tsx`    | 퀴즈 리스트 테이블                  |
| `QuizGenerator.tsx`| AI 퀴즈 생성 로직 UI               |
| `MediaRenderer.tsx`| 이미지/미디어 렌더링 헬퍼 컴포넌트  |
| `QuizCard.tsx`    | 퀴즈 카드 뷰                       |
| `QuizDisplay.tsx` | 퀴즈 상세 표시                      |

### 4-4. API 모듈 (`app/admin/_api`)
| 파일              | 기능                                                        |
| ---------------- | --------------------------------------------------------- |
| `quiz.api.ts`    | 퀴즈 리스트 조회/단일 조회/생성/수정/삭제/AI 퀴즈 생성    |
| `section.api.ts` | 섹션 리스트 조회/단일 조회/생성/수정/삭제                   |
| `units.api.ts`   | 유닛 조회/생성/수정/삭제 및 유닛별 퀴즈 조회                |
| `story.api.ts`   | 스토리 조회/생성/수정/삭제 및 AI 스토리 생성               |
| `vocab.api.ts`   | 어휘 조회/생성/수정/삭제                                   |

## 5. 설치 & 실행 방법

### 요구사항
- Node.js v14 이상
- npm 또는 yarn

### 설치
```bash
git clone https://github.com/{사용자명}/ai-quiz-generator.git
cd ai-quiz-generator
npm install
# 또는 yarn install
```

### 환경 변수
`.env.local` 파일에 백엔드 API 주소를 설정합니다:
```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 개발 서버 실행
```bash
npm run dev
# 또는 yarn dev
```
브라우저에서 `http://localhost:3000` 접속

### 빌드 및 프로덕션
```bash
npm run build
npm run start
```

---
*본 문서는 AI Quiz Generator 프로젝트의 원활한 인수인계를 위해 작성되었습니다.*