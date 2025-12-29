# moisha-web

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 시작하기

다음 명령어를 입력하여 개발 페이지를 실행합니다.

```bash
yarn
yarn dev
```

[http://localhost:5173](http://localhost:5173)에 접속하여 결과를 확인합니다.

## 개발 지침

### 폴더 구조

- api
  - API 요청 함수를 정의합니다.
  - API 구조와 동일하게 파일을 위치시킵니다.
    - `/api/auth/user` -> `/auth/user.ts`
- routes
  - 페이지(라우트)를 정의합니다.
- components
  - 컴포넌트를 정의합니다.
- constants
  - 여러 페이지에서 사용되는 상수를 정의합니다.
- utils
  - 여러 페이지에서 사용되는 유틸 함수를 정의합니다.

### 브랜치

- `main`에서 브랜치를 만들어 작업합니다. 작업을 마치면 PR를 올리고, 다른 작업자는 코드 리뷰 후 `main` 브랜치로 **스쿼시 병합**합니다.
- 병합이 완료되면 깃허브 액션을 통해 [moisha-web-dev.vercel.app](https://moisha-web-dev.vercel.app)으로 자동 배포됩니다.
- 브랜치 이름은 `{유형}/{이름}`으로 작성합니다.
  - 브랜치 유형: `feat`, `fix`, `chore`, `style`, `refactor`
- PR 제목을 작성할 때는 [깃모지](https://gitmoji.dev/)를 사용하는 것을 권장합니다.

## 기여자

- [@jun-0411](https://github.com/jun-0411)
- [@young-52](https://github.com/young-52)
