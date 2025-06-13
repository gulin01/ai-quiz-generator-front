# AI Quiz Generator Frontend

## 인수인계 문서

### 프로젝트 개요
AI 기반 영어 레벨 테스트 및 관리(Admin) 페이지를 제공하는 Next.js 기반 프론트엔드 애플리케이션입니다.
사용자는 퀴즈를 풀며 자신의 CEFR(유럽 공통 언어 기준) 레벨을 확인할 수 있고, 관리자는 섹션, 유닛, 스토리, 어휘, 퀴즈를 생성/관리할 수 있습니다.

### 주요 기능
- 메인 페이지: 홈 화면 및 퀴즈 시작 버튼 제공
- 퀴즈 플레이어: AI가 생성한 퀴즈를 풀어 점수 및 예상 레벨 확인
- 관리자 대시보드:
  - 섹션(Sections) 관리
  - 유닛(Units) 관리
  - 스토리(Stories) 관리 및 생성
  - 어휘(Vocab) 관리
  - 퀴즈(Quiz) 생성 및 관리

### 기술 스택
- Next.js (App Router)
- React (Client 컴포넌트)
- Tailwind CSS
- Axios (HTTP 클라이언트)
- TypeScript

### 디렉터리 구조
```plaintext
.
├── app
│   ├── admin
│   │   ├── _api                # 관리자용 API 모듈
│   │   ├── _components         # 관리자용 UI 컴포넌트
│   │   └── page.tsx            # 관리자 대시보드 진입점
│   ├── components              # 공용 컴포넌트 (QuizPlayer, UI 라이브러리)
│   ├── lib                     # 공용 유틸리티 (Axios 인스턴스)
│   ├── types                   # TypeScript 타입 정의
│   ├── sections                # 섹션별 유닛 리스트 페이지
│   ├── unit                    # 유닛별 퀴즈 리스트 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 메인 페이지
│   └── globals.css             # 전역 스타일
├── public                      # 정적 리소스 (SVG 등)
├── next.config.ts              # Next.js 설정
├── postcss.config.mjs          # PostCSS 설정
├── package.json                # 프로젝트 메타/의존성
├── tsconfig.json               # TypeScript 설정
└── README.md                   # 프로젝트 문서 (이 파일)
```

### 주요 파일 설명
- **app/page.tsx**: 메인 홈 페이지, Admin 패널 진입 및 퀴즈 시작 버튼 제공
- **app/components/QuizPlayer.tsx**: 클라이언트 컴포넌트로 `/generate/list` API 호출을 통해 퀴즈 목록을 받아와 플레이어 UI 렌더링
- **app/lib/api.ts**: `axios.create`로 생성된 API 인스턴스를 통해 백엔드와 통신 (`NEXT_PUBLIC_API_URL` 환경 변수 사용)
- **app/admin/_api** 폴더: 관리자 페이지에서 사용하는 API 호출 모듈
  - `section.api.ts`, `units.api.ts`, `story.api.ts`, `vocab.api.ts`, `quiz.api.ts`
- **app/admin/_components** 폴더: 관리자 UI 컴포넌트
  - `ManageSections.tsx`, `ManageUnits.tsx`, `ManageStories.tsx`, `ManageVocab.tsx`, `GenerateQuiz.tsx`, `ManageQuiz.tsx`
  - `_quiz_components` 서브 폴더: 퀴즈 관련 세부 컴포넌트 (`QuizForm.tsx`, `QuizList.tsx`, `MediaRenderer.tsx` 등)
- **app/sections/[id]/page.tsx**: 선택한 섹션의 유닛 목록 표시
- **app/unit/[id]/page.tsx**: 선택한 유닛의 퀴즈 목록 표시

### API 연결 및 사용 예시
- **`app/lib/api.ts`** 예시
```ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});
```
- **`app/admin/_api/section.api.ts`** 예시
```ts
import { api } from "../../lib/api";

export async function getAllSections(): Promise<Section[]> {
  const res = await api.get<Section[]>("/sections");
  return res.data;
}
```
- **`app/components/QuizPlayer.tsx`** 예시
```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL + "/generate/list";

useEffect(() => {
  axios.get<Quiz[]>(API_URL).then((res) => setQuizzes(res.data));
}, []);
```

### 환경 변수
```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001  # 백엔드 API 서버 주소
```

### 로컬 개발 및 배포
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

---
본 문서는 인수인계 목적으로 작성되었습니다.
