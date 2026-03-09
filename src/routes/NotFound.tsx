import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center space-y-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
              className="text-[6rem] font-black leading-none text-gray-100 select-none"
            >
              404
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1 w-24 bg-purple-500 blur-xl opacity-50" />
            </div>
          </div>
        </motion.div>
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-center">길을 잃으셨나요?</h1>
        </div>
        <div className="flex justify-center">
          <p className="text-center leading-relaxed">
            요청하신 페이지를 찾을 수 없습니다.
            <br />
            입력하신 주소를 다시 한번 확인해 주세요.
          </p>
        </div>
        <div className="flex justify-center">
          <Button type="button" variant="default">
            <Link to="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
    // <div className="flex flex-1 flex-col items-center justify-center text-center">
    //

    //     <div className="space-y-3">
    //       <h1>길을 잃으셨나요?</h1>
    //       <p className="body-base text-[#757575]">
    //         요청하신 페이지를 찾을 수 없습니다.
    //         <br />
    //         입력하신 주소가 정확한지 다시 한번 확인해주세요.
    //       </p>
    //     </div>

    //     <motion.div
    //       whileHover={{ scale: 1.05 }}
    //       whileTap={{ scale: 0.95 }}
    //       className="pt-4"
    //     >
    //       <Button
    //         asChild
    //         size="lg"
    //         className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-200 transition-all hover:shadow-xl hover:shadow-purple-300"
    //       >
    //         <Link to="/" className="flex items-center gap-2">
    //           <Home className="h-5 w-5" />
    //           홈으로 돌아가기
    //         </Link>
    //       </Button>
    //     </motion.div>
    //   </motion.div>

    //   {/* Background Decorative Elements */}
    //   <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    //     <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-50/50 blur-3xl" />
    //     <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-50/50 blur-3xl" />
    //   </div>
    // </div>
  );
}
