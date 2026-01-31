import { CircleCheckBig } from '@/components/animate-ui/icons/circle-check-big';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export default function VerifyEmailSent() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex justify-center">
          <CircleCheckBig animateOnView size={70} />
        </div>
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-center">
            이메일 인증을 완료해주세요
          </h1>
        </div>
        <div className="flex justify-center">
          <p className="text-center leading-relaxed">
            입력하신 이메일 주소로 인증 링크를 보냈습니다.
            <br />
            인증 메일이 보이지 않으면 스팸 메일함을 확인해주세요.
          </p>
        </div>
        <div className="flex justify-center">
          <Button type="button" variant="default" className="font-semibold">
            <Link to="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
