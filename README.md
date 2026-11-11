# 다훈 ♥ 은하 모바일 청첩장

물과 불이 만나 무지개를 이루는 순간을 담은 모바일 웨딩 초대장입니다. 수채화처럼 번지는 색감과 은은한 글래스 UI로 두 사람의 이야기를 소개하고, 예식 정보를 편하게 확인할 수 있도록 만들었습니다.

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
    - [카카오 지도 설정](#카카오-지도-설정)
  - [빌드 및 미리보기](#빌드-및-미리보기)
  - [GitHub Pages 배포](#github-pages-배포)
  - [프로젝트 구조](#프로젝트-구조)
  - [개인정보 및 보안](#개인정보-및-보안)

## 주요 기능

- 로딩 화면과 시네마틱 인트로
- 예식 날짜 카운트다운과 캘린더 저장
- 지도와 교통 안내, 지도 앱 연결
- 카카오맵 예식장 지도와 카카오톡 청첩장 공유 (JavaScript 키 설정 시)
- 웨딩 사진 갤러리와 전체 화면 보기
- 연락처 및 마음 전하기 안내
- Firebase Firestore 방명록과 네 가지 원소 선택
- 물·불을 꾹 눌러 서로 드래그하면 무지개가 피어나는 방명록 인터랙션
- 물·불 테마의 수채화 오라와 움직이는 파티클
- 물·불 말풍선, 엘리멘탈 포인트 무지개 모드, 무지개봇 보너스 답변 등 이스터에그

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

| 변수                                | 용도                           |
| ----------------------------------- | ------------------------------ |
| `VITE_FIREBASE_API_KEY`             | Firebase 웹 앱 API 키          |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Firebase 인증 도메인           |
| `VITE_FIREBASE_PROJECT_ID`          | Firebase 프로젝트 ID           |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Firebase Storage 버킷          |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase 발신자 ID             |
| `VITE_FIREBASE_APP_ID`              | Firebase 웹 앱 ID              |
| `VITE_KAKAO_JAVASCRIPT_KEY`         | 카카오 지도·공유 JavaScript 키 |

`.env.example`은 변수명만 담은 빈 템플릿입니다. 개인 Firebase 값은 로컬에서는 `.env.local`에, 배포 빌드에서는 GitHub Actions Secrets에 등록합니다.

### 카카오 지도 설정

1. [카카오디벨로퍼스](https://developers.kakao.com/console/app)에서 개발자 등록 후 앱을 생성합니다.
2. 앱 설정의 **플랫폼 키 → JavaScript 키 → JavaScript SDK 도메인**에 배포 도메인 `https://dahoonkk.github.io`와 로컬 테스트 주소 `http://localhost:5173`을 등록합니다. 다른 기기에서 IP 주소로 테스트할 때는 실제 접속 주소와 포트도 별도로 등록해야 합니다.
3. **카카오맵 → 사용 설정**을 켭니다. 카카오맵 무료 쿼터는 개발자 계정에서 처음으로 카카오맵을 활성화한 앱에만 적용됩니다. [카카오맵 이용 정책](https://developers.kakao.com/docs/ko/kakaomap/common#policy)을 확인하세요.
4. 발급받은 **JavaScript 키**를 로컬 환경 파일의 `VITE_KAKAO_JAVASCRIPT_KEY`에 설정하고 개발 서버를 재시작합니다. 배포 시에는 GitHub 저장소의 **Settings → Secrets and variables → Actions → Secrets**에 같은 이름으로 등록한 뒤 다시 빌드·배포합니다. 채팅에 키를 보내지 않아도 됩니다.

JavaScript 키는 웹 브라우저에 공개되는 플랫폼 키이므로 등록된 도메인을 제한해야 합니다. REST API 키나 Admin 키, 클라이언트 시크릿은 사용하거나 프런트엔드에 넣지 마세요. 키가 없거나 카카오 SDK 또는 주소 검색에 실패하면 기존 구글 지도가 표시됩니다. 지도 마커와 길찾기 목적지가 예식장에 정확히 표시되는지도 실제 기기에서 확인하세요.

카카오톡 공유 카드 테스트를 위해 **앱 → 제품 링크 관리 → 웹 도메인**에 청첩장 도메인 `https://dahoonkk.github.io`를 등록합니다. 클로싱의 카카오톡 공유 버튼으로 전송하면 사진과 청첩장 보기·위치 보기 버튼이 있는 카드가 만들어집니다. 위치 보기는 청첩장 사이트를 거쳐 카카오맵 앱 실행을 시도하고, 앱을 열지 못하면 장소 웹페이지로 이동합니다. 브라우저 정책에 따라 자동 이동이 제한될 수 있으므로 안내 화면에서도 앱 또는 웹으로 직접 이동할 수 있습니다. URL을 직접 붙여넣은 일반 미리보기에는 해당 버튼이 표시되지 않습니다. 프로덕션 빌드의 카드 사진과 링크는 배포 사이트를 사용하므로 배포 후 모바일 카카오톡에서 확인하세요.

개발 서버에서 공유하면 카드 버튼은 개발 서버에 접속한 주소를 사용하고, 사진은 카카오 서버가 접근할 수 있는 배포 사이트 이미지를 사용합니다. 해당 개발 서버 주소도 카카오디벨로퍼스의 **JavaScript SDK 도메인**과 **제품 링크 관리 → 웹 도메인**에 등록해야 합니다. `localhost`는 접속하는 기기 자신을 의미하므로, 컴퓨터에서 만든 `localhost` 링크를 휴대폰에서 열 수는 없습니다. 휴대폰에서 테스트하려면 개발 서버의 접근 가능한 네트워크 주소나 HTTPS 테스트 도메인으로 휴대폰에서 직접 접속해 새 공유 카드를 만들고, 해당 주소를 카카오 설정에 등록하세요. 카카오가 로컬·사설 주소를 제품 링크로 허용하지 않으면 등록 가능한 HTTPS 테스트 도메인이 필요합니다. 개발용 링크를 공유받은 다른 사람은 해당 테스트 서버에 접근할 수 있어야 합니다.

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
- `VITE_KAKAO_JAVASCRIPT_KEY` (카카오 지도·공유 사용 시)

## 프로젝트 구조

```text
src/
├── components/
│   ├── intro/        # 로딩 및 시네마틱 인트로
│   ├── layout/       # 상단바와 배경 효과
│   ├── sections/     # 예식 정보, 방명록, 클로싱 등 본문 섹션
│   ├── gallery/      # 사진 갤러리
│   └── interactive/  # 챗봇, 음악 및 이스터에그
├── data/             # 배경 오라·파티클 데이터
└── lib/              # Firebase·카카오 연동 및 공통 상수
public/
├── icon/         # 파비콘 원본 이미지
└── images/       # 청첩장 사진, 음악 커버 및 공유 미리보기
```

## 개인정보 및 보안

저장소와 배포 사이트에는 실제 인물의 사진과 예식 정보가 포함될 수 있으므로 공개 범위를 확인해 주세요. Firebase 웹 앱 설정은 브라우저에 전달되는 공개 설정값이며, 접근 제어는 Firestore 보안 규칙으로 관리해야 합니다. 서비스 계정 키 등 서버 비밀 정보는 코드나 저장소에 올리지 마세요.
