import { Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <div className="flex-1 flex justify-center">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-10">
        <div className="flex flex-col gap-4">
          <h1 className="heading text-center">
            모임이 쉬워진다!<br></br> 모이밍
          </h1>
          <span className="body-base text-center">
            여러분의 모임을 만들어보세요
          </span>
        </div>
        <div className="w-[320px] px-6 py-6 rounded-lg border border-border mb-40">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
