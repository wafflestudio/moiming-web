import { Spinner } from '@/components/ui/spinner';

interface LoadingSkeletonProps {
  loadingTitle: string;
  message: string;
}

export default function LoadingSkeleton({ loadingTitle, message }: LoadingSkeletonProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex justify-center">
          <Spinner className="size-16" />
        </div>
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-center">{loadingTitle}</h1>
        </div>
        <div className="flex justify-center">
          <p className="text-center">{message}</p>
        </div>
      </div>
    </div>
  );
  }