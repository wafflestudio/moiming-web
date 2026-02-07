<div align="center">
  <img src="public/moiming-logo.svg" width="150" />
  <br></br>
  <p align="center">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  </p>
</div>

## 모임이 쉬워진다, 모이밍!

모이밍은 모임을 쉽게 만들고 참여할 수 있는 웹 서비스입니다. 로그인 없이, 링크 붙여넣기와 몇 번의 클릭만으로 내가 원하는 모임을 신청할 수 있습니다!

이곳은 모이밍의 프론트엔드 저장소입니다. 백엔드 저장소는 [wafflestudio/23-5-team4-server](https://github.com/wafflestudio/23-5-team4-server)에서 확인할 수 있습니다.

## 사용해보기

[웹사이트](www.moiming.app)

## 시작하기

다음 명령어를 입력하여 개발 페이지를 실행합니다.

```bash
yarn
yarn dev
```

[http://localhost:5173](http://localhost:5173)에 접속하여 결과를 확인합니다.

## 협업하기

### 폴더 구조

- api
  - API 요청 함수를 정의합니다.
  - API 구조와 동일하게 파일을 위치시킵니다.
    - `/api/auth/users` -> `/auth/users.ts`
- components
  - 컴포넌트를 정의합니다.
- constants
  - 여러 페이지에서 사용되는 상수를 정의합니다.
- hooks
  - 커스텀 훅을 정의합니다.
- routes
  - 페이지(라우트)를 정의합니다.
- types
  - 여러 페이지에서 사용되는 타입을 정의합니다.
  - 타입 선언은 interface를 우선하되, interface를 쓸 수 없으면 type을 사용합니다.
- utils
  - 여러 페이지에서 사용되는 유틸 함수를 정의합니다.
- mocks
  - MSW(Mock Service Worker)를 이용한 API 모킹 로직을 관리합니다.
  - **db/**: 모킹에 사용되는 기반 데이터(Mock Data)를 정의하고 관리합니다.
  - **handlers/**: 기능/도메인별로 API 핸들러를 분리하여 정의합니다. db의 데이터를 참조하여 응답을 반환합니다.

### 브랜치

- `main`에서 브랜치를 만들어 작업합니다. 작업을 마치면 PR를 올리고, 다른 작업자는 코드 리뷰 후 `main` 브랜치로 **스쿼시 병합**합니다.
- 병합이 완료되면 깃허브 액션을 통해 [www.moiming.app](https://www.moiming.app)으로 자동 배포됩니다.
- 브랜치 이름은 `{유형}/{이름}`으로 작성합니다.
  - 브랜치 유형: `feat`, `fix`, `chore`, `style`, `refactor`
- PR 제목을 작성할 때는 [깃모지](https://gitmoji.dev/)를 사용하는 것을 권장합니다.

## 🛠 기술 스택

| Category | Technology |
| :--- | :--- |
| **State** | Zustand, TanStack Query |
| **UI & UX** | Shadcn UI, Framer Motion, Lucide React, Sonner |
| **Networking** | Axios, MSW |
| **Dev Tools** | Vite, Biome, Knip |
| **Deployment** | AWS S3, Cloudflare |

## 화면
![KakaoTalk_Photo_2026-02-07-14-55-36 004](https://github.com/user-attachments/assets/74455a53-492a-4cf3-b85f-67e878971cdf)
![KakaoTalk_Photo_2026-02-07-14-55-37 008](https://github.com/user-attachments/assets/763a9e45-92a2-432b-83fd-87e8553a9fa7)
![KakaoTalk_Photo_2026-02-07-14-55-35 003](https://github.com/user-attachments/assets/58877aa8-6562-43db-949d-c140a8d3fc29)
![KakaoTalk_Photo_2026-02-07-14-55-36 006](https://github.com/user-attachments/assets/f0417d68-5e28-4d25-9a65-4c3f992ea833)
![KakaoTalk_Photo_2026-02-07-14-55-35 002](https://github.com/user-attachments/assets/bc2034f6-6921-40cf-85a8-9da7d2719d48)
![KakaoTalk_Photo_2026-02-07-14-55-36 005](https://github.com/user-attachments/assets/88fb9408-1154-43ac-87e3-446351651ec4)
![KakaoTalk_Photo_2026-02-07-14-55-35 001](https://github.com/user-attachments/assets/926fab4b-e655-4c12-b3bc-4ce756fb8070)
![KakaoTalk_Photo_2026-02-07-14-55-36 007](https://github.com/user-attachments/assets/a764a1a3-4c02-41c8-aa63-78313896b3e3)


## 기여자

| [박준영(@young-52)](https://github.com/young-52) | [이준엽(@jun-0411)](https://github.com/jun-0411) |
| :---: | :---: |
| <a href="https://github.com/young-52"><img src="https://avatars.githubusercontent.com/u/25864819?v=4" width="150"></a> | <a href="https://github.com/jun-0411"><img src="https://avatars.githubusercontent.com/u/202625805?v=4" width="150"></a> |
| 랜딩, 로그인, <br> 회원가입, 일정 생성 | 일정 상세, 참여자, <br> 일정 수정, 프로필 수정 |
