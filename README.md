# 다훈 ♥ 은하 모바일 청첩장

물과 불이 만나 무지개를 이루는 순간을 테마로 만든 모바일 웨딩 초대장입니다. 수채화처럼 번지는 색감과 은은한 글래스 UI를 중심으로, 하객이 예식 정보와 사진을 편하게 확인할 수 있도록 구성했습니다.

**청첩장 보기:** https://dahoonkk.github.io/wedding-invitation/

## 주요 기능

- 로딩 화면과 시네마틱 인트로
- 예식 정보, 디데이, 날짜 캘린더 저장
- 지도와 교통 안내, 지도 앱 연결
- 웨딩 사진 갤러리 및 전체 보기
- 연락처·마음 전하기 안내
- Firebase Firestore 기반 방명록
- 물과 불의 색을 담은 수채화 오라와 반응형 모바일 레이아웃

## 기술 스택

- React 19 · TypeScript
- Vite
- Tailwind CSS 4
- Firebase Firestore
- GitHub Pages · GitHub Actions

## 로컬에서 실행하기

Node.js 22와 npm이 필요합니다.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`.env.example`을 참고해 Firebase 프로젝트 값을 `.env.local`에 입력하세요. Firebase를 설정하지 않으면 방명록 기능이 정상 동작하지 않을 수 있습니다. 실제 환경 변수 값은 저장소에 커밋하지 마세요.

### 환경 변수

| 변수                                | 용도                  |
| ----------------------------------- | --------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase 웹 앱 API 키 |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase 인증 도메인  |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase 프로젝트 ID  |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage 버킷 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase 발신자 ID    |
| `VITE_FIREBASE_APP_ID`              | Firebase 웹 앱 ID     |

## 빌드 및 미리보기

```bash
npm run build
npm run preview
```

빌드 결과물은 `dist/`에 생성됩니다.

## 배포

`main` 브랜치에 변경 사항을 푸시하면 GitHub Actions가 의존성 설치, 프로덕션 빌드, GitHub Pages 배포를 진행합니다. 수동 배포는 GitHub 저장소의 **Actions** 탭에서 `Deploy to GitHub Pages` 워크플로를 실행할 수 있습니다.

배포 워크플로에서 사용하는 Firebase 값은 저장소의 **Settings → Secrets and variables → Actions**에 아래 이름으로 등록합니다.

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 프로젝트 구조

```text
src/
├── components/   # 초대장 섹션 및 UI 컴포넌트
├── data/         # 배경 오라·파티클 데이터
└── lib/          # Firebase 및 공통 데이터
public/
└── images/       # 청첩장 사진
```

## 개인정보 및 콘텐츠 안내

이 저장소와 배포 사이트에는 실제 인물의 사진 및 결혼식 정보가 포함될 수 있습니다. 공개 범위와 사진·콘텐츠 사용 권한을 확인한 뒤 공유해 주세요. Firebase 웹 설정은 클라이언트에 포함되므로, Firestore 보안 규칙을 적절히 설정하고 서비스 계정 키 등 서버 비밀 정보는 공개하지 마세요.
