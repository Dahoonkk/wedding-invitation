# 다훈 ♥ 은하 모바일 청첩장

물과 불이 만나 무지개를 이루는 순간을 담은 모바일 웨딩 초대장입니다. 수채화처럼 번지는 색감과 은은한 글래스 UI로 두 사람의 이야기를 소개하고, 예식 정보를 편하게 확인할 수 있도록 만들었습니다.

<p align="center">
	<a href="https://dahoonkk.github.io/wedding-invitation/">
		<img src="public/images/og-preview.jpg" alt="다훈과 은하의 웨딩 청첩장 미리보기" width="720" />
	</a>
</p>

<p align="center">
	<a href="https://dahoonkk.github.io/wedding-invitation/">💌 청첩장 열기</a>
</p>

## 목차

- [다훈 ♥ 은하 모바일 청첩장](#다훈--은하-모바일-청첩장)
  - [목차](#목차)
  - [주요 기능](#주요-기능)
  - [기술 스택](#기술-스택)
  - [로컬에서 실행하기](#로컬에서-실행하기)
    - [환경 변수](#환경-변수)
  - [빌드 및 미리보기](#빌드-및-미리보기)
  - [GitHub Pages 배포](#github-pages-배포)
  - [프로젝트 구조](#프로젝트-구조)
  - [개인정보 및 보안](#개인정보-및-보안)

## 주요 기능

- 로딩 화면과 시네마틱 인트로
- 예식 날짜 카운트다운과 캘린더 저장
- 지도와 교통 안내, 지도 앱 연결
- 웨딩 사진 갤러리와 전체 화면 보기
- 연락처 및 마음 전하기 안내
- Firebase Firestore 방명록
- 물·불 테마의 수채화 오라와 움직이는 파티클
- 물·불 말풍선, 상단바 무지개 모드, 무지개봇 보너스 답변 등 숨겨진 이스터에그

## 기술 스택

- React 19 · TypeScript
- Vite
- Tailwind CSS 4
- Firebase Firestore
- GitHub Pages · GitHub Actions

## 로컬에서 실행하기

필요 환경: **Node.js 22 이상**, npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

`.env.example`을 참고해 Firebase 프로젝트 값을 `.env.local`에 입력하세요. Firebase를 설정하지 않아도 정적 콘텐츠는 확인할 수 있지만, 방명록 기능은 작동하지 않을 수 있습니다. 실제 환경 파일은 저장소에 커밋하지 마세요.

### 환경 변수

| 변수                                | 용도                  |
| ----------------------------------- | --------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase 웹 앱 API 키 |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase 인증 도메인  |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase 프로젝트 ID  |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage 버킷 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase 발신자 ID    |
| `VITE_FIREBASE_APP_ID`              | Firebase 웹 앱 ID     |

`.env.example`은 변수명만 담은 빈 템플릿입니다. 개인 Firebase 값은 로컬에서는 `.env.local`에, 배포 빌드에서는 GitHub Actions Secrets에 등록합니다.

## 빌드 및 미리보기

```bash
npm run build
npm run preview
```

빌드 결과물은 `dist/`에 생성됩니다.

## GitHub Pages 배포

먼저 저장소의 **Settings → Pages → Build and deployment**에서 배포 소스를 **GitHub Actions**로 설정합니다. 이후 `main` 브랜치에 변경 사항을 푸시하면 GitHub Actions가 의존성 설치, 프로덕션 빌드, GitHub Pages 배포를 진행합니다. 수동 배포는 **Actions** 탭에서 `Deploy to GitHub Pages` 워크플로를 실행하면 됩니다.

배포 사이트에서 방명록을 사용하려면 Firebase 값을 저장소의 **Settings → Secrets and variables → Actions**에 아래 이름으로 등록합니다.

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 프로젝트 구조

```text
src/
├── components/   # 초대장 섹션, UI 및 이스터에그
├── data/         # 배경 오라·파티클 데이터
└── lib/          # Firebase 및 공통 상수
public/
├── icon/         # 파비콘 원본 이미지
└── images/       # 청첩장 사진 및 공유 미리보기
```

## 개인정보 및 보안

저장소와 배포 사이트에는 실제 인물의 사진과 예식 정보가 포함될 수 있으므로 공개 범위를 확인해 주세요. Firebase 웹 앱 설정은 브라우저에 전달되는 공개 설정값이며, 접근 제어는 Firestore 보안 규칙으로 관리해야 합니다. 서비스 계정 키 등 서버 비밀 정보는 코드나 저장소에 올리지 마세요.
