// import { createEvent } from '@/api/events/event';
// import { DateTimePicker } from '@/components/DateTimePicker';
// import { InputWithPlusMinusButtons } from '@/components/InputWithPlusMinusButtton';
import { Button } from '@/components/ui/button';
import {
  Field,
  // FieldContent,
  // FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type CreateEventRequest } from '@/types/events';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

type Step = 1 | 2;

type StepperProps = {
  step: Step;
  setStep: (step: Step) => void;
};

function Stepper(props: StepperProps) {
  const { step, setStep } = props;

  if (step === 1) {
    return (
      <div className="flex items-center justify-center w-full bg-[#E3F2FD] rounded-lg px-2 py-1.5 gap-2">
        <Button className="w-50">
          <span className="single-line-body-base">➊ 기본 정보</span>
        </Button>
        <Button className="w-50 bg-white text-[#42A5F5]" variant="ghost">
          <span className="single-line-body-base">➋ 일정 설명</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full bg-[#E3F2FD] rounded-lg px-2 py-1.5 gap-2">
      <Button
        className="w-50 text-[#42A5F5]"
        variant="ghost"
        onClick={() => setStep(1)}
      >
        <span className="single-line-body-base">➊ 기본 정보</span>
      </Button>
      <Button className="w-50">
        <span className="single-line-body-base">➋ 일정 설명</span>
      </Button>
    </div>
  );
}

export default function NewEvent() {
  const [step, setStep] = useState<Step>(2);
  // const [regiStartDate, setRegiStartDate] = useState<Date | undefined>(
  //   new Date()
  // );
  // const [regiEndDate, setRegiEndDate] = useState<Date | undefined>(
  //   new Date(new Date().getTime() + 24 * 60 * 60 * 60)
  // );
  // const [capacity, setCapacity] = useState<number>(1);

  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm<CreateEventRequest>();
  const onSubmit: SubmitHandler<CreateEventRequest> = (data) => {
    console.info(data);

    // try {
    //   createEvent(data).then();

    //   if (response.status === 201 || response.status === 200) {
    //     toast.success('일정이 성공적으로 생성되었습니다!');
    //     // 성공 시 상세 페이지 또는 홈으로 이동
    //     const eventId = response.data.publicId;
    //     navigate(`/event/${eventId}`);
    //   }
    // } catch (error) {
    //   console.error('Failed to create event:', error);
    //   toast.error('일정 생성에 실패했습니다. 다시 시도해주세요.');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  // console.info(watch('title'));

  return (
    <div className="flex w-full flex-col gap-4 px-6">
      <Stepper step={step} setStep={setStep} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <FieldLabel className="gap-1">
              <span>모임 이름</span>
              <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              id="checkout-7j9-card-name-43j"
              placeholder="무슨 모임인가요?"
              {...register('title', { required: true })}
            />
          </Field>
          <Field>
            <FieldLabel className="gap-1">
              <span>모임 이름</span>
              <span className="text-red-600">*</span>
            </FieldLabel>
            <Input
              id="checkout-7j9-card-name-43j"
              placeholder="무슨 모임인가요?"
              {...register('title', { required: true })}
            />
          </Field>

          <Field>
            <Button type="submit">제출</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
