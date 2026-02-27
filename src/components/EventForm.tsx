import { ControlledDateTimePicker } from '@/components/ControlledDateTimePicker';
import { InputWithPlusMinusButtons } from '@/components/InputWithPlusMinusButtton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { formatEventDate } from '@/utils/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeftIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, '제목을 입력해 주세요.')
      .max(20, '제목은 20자 이내로 입력해 주세요.'),
    capacity: z.number().min(1, '정원은 1 이상이어야 합니다.'),
    isFromNow: z.boolean(),
    isBounded: z.boolean(),
    regiStartDate: z.date(),
    regiEndDate: z.date(),
    eventStartDate: z.date(),
    eventEndDate: z.date().optional(),
    location: z
      .string()
      .trim()
      .max(20, '장소는 20자 이내로 입력해 주세요.')
      .optional(),
    description: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    // 1. 신청 마감 시간은 현재 시간 이후여야 함
    if (data.regiEndDate <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '신청 마감 시간은 현재 시간 이후여야 합니다.',
        path: ['regiEndDate'],
      });
    }

    // 2. 신청 기간 검증
    if (!data.isFromNow && data.regiStartDate >= data.regiEndDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '신청 마감 시간이 신청 시작 시간보다 빠를 수 없습니다.',
        path: ['regiEndDate'],
      });
    }

    // 3. 모임 기간 검증 (종료 시간이 있을 때만)
    if (
      data.isBounded &&
      data.eventEndDate &&
      data.eventStartDate >= data.eventEndDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '모임 종료 시간이 모임 시작 시간보다 빠를 수 없습니다.',
        path: ['eventEndDate'],
      });
    }
  });

export type FormValues = z.infer<typeof formSchema>;

interface EventFormProps {
  pageTitle: string;
  defaultValues: FormValues;
  onSubmit: (data: FormValues) => Promise<void> | void;
  loading?: boolean;
  onBack: () => void;
  submitButtonText?: string;
  saveDialogTitle?: string;
  saveDialogDescription?: string;
}

export function EventForm({
  pageTitle,
  defaultValues,
  onSubmit: handleFormSubmit,
  loading = false,
  onBack,
  submitButtonText = '저장',
  saveDialogTitle = '일정을 저장하시겠습니까?',
  saveDialogDescription = '참여자가 생기는 경우, 기본 정보를 수정하기 어려울 수 있습니다.',
}: EventFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = form;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const isFromNow = watch('isFromNow');
  const isBounded = watch('isBounded');

  const onNext = async () => {
    // 1단계 필드만 검증
    const isValidStep1 = await trigger([
      'title',
      'capacity',
      'regiStartDate',
      'regiEndDate',
    ]);

    if (isValidStep1) {
      // 추가적으로 zod superRefine의 에러도 확인해야 함
      const step1Errors = [
        errors.title,
        errors.capacity,
        errors.regiStartDate,
        errors.regiEndDate,
      ];

      if (step1Errors.every((e) => !e)) {
        setStep(2);
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Step 2 Cross-validation
    if (data.regiEndDate > data.eventStartDate) {
      form.setError('regiEndDate', {
        type: 'manual',
        message: '모집 마감 시각이 모임 시작 시각보다 늦을 수 없습니다.',
      });
      return;
    }
    if (data.regiStartDate > data.eventStartDate) {
      form.setError('regiStartDate', {
        type: 'manual',
        message: '모집 시작 시각이 모임 시작 시각보다 늦을 수 없습니다.',
      });
      return;
    }

    await handleFormSubmit(data);
  };

  const errorTextStyle = 'mt-1 text-xs text-red-500 font-medium';

  return (
    <div className="min-h-screen relative pb-10">
      {/* Top navigation UI */}
      <header className="w-full flex justify-center">
        <div className="max-w-2xl min-w-[320px] w-[90%] flex items-center justify-between px-2 mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (step === 1 ? onBack() : setStep(1))}
            className="rounded-full"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl sm:text-2xl flex-1 ml-4 truncate text-black">
            {pageTitle}
          </h1>
        </div>
      </header>

      {/* Stepper / Tabs */}
      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] mt-4">
        <div className="flex gap-2 bg-primary/10 p-1.5 rounded-xl">
          <Button
            type="button"
            size="xl"
            className={`flex-1 transition-all ${
              step === 1
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-primary bg-white hover:bg-white/80'
            }`}
            onClick={() => setStep(1)}
          >
            ① 기본 정보
          </Button>
          <Button
            type="button"
            size="xl"
            className={`flex-1 transition-all ${
              step === 2
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-primary bg-white hover:bg-white/80'
            }`}
            onClick={() => {
              if (step === 1) {
                onNext();
              }
            }}
          >
            ② 일정 설명
          </Button>
        </div>
      </div>

      <div className="max-w-2xl min-w-[320px] mx-auto w-[90%] flex flex-col items-start gap-10 mt-6">
        <form
          className="w-full flex flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  {/* Name */}
                  <Field>
                    <FieldLabel htmlFor="title" className="gap-1">
                      <span>모임 이름</span>
                      <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="title"
                          placeholder="모임 이름을 입력해 주세요 (최대 20자)"
                          className={`text-lg ${
                            errors.title
                              ? 'border-red-400 focus:ring-red-100'
                              : ''
                          }`}
                        />
                      )}
                    />
                    {errors.title && (
                      <p className={errorTextStyle}>{errors.title.message}</p>
                    )}
                  </Field>

                  {/* Start recruiting now Toggle */}
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel>지금부터 모집하기</FieldLabel>
                      <FieldDescription>
                        일정을 만든 즉시 참가 신청을 시작해요.
                      </FieldDescription>
                    </FieldContent>
                    <Controller
                      control={control}
                      name="isFromNow"
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              setValue('regiStartDate', new Date());
                            }
                          }}
                        />
                      )}
                    />
                  </Field>

                  {/* Registration Start */}
                  {!isFromNow && (
                    <Field>
                      <div className="mb-2">
                        <FieldLabel
                          htmlFor="regiStartDate"
                          className="gap-1 mb-2"
                        >
                          <span>신청 시작 시간</span>
                          <span className="text-red-600">*</span>
                        </FieldLabel>
                        <ControlledDateTimePicker
                          control={control}
                          name="regiStartDate"
                          placeholder="언제 시작할까요?"
                          disabled={isFromNow}
                        />
                        {errors.regiStartDate && (
                          <p className={errorTextStyle}>
                            {errors.regiStartDate.message}
                          </p>
                        )}
                      </div>
                    </Field>
                  )}

                  {/* Registration End */}
                  <Field>
                    <FieldLabel htmlFor="regiEndDate" className="gap-1">
                      <span>신청 마감 시간</span>
                      <span className="text-red-600">*</span>
                    </FieldLabel>
                    <ControlledDateTimePicker
                      control={control}
                      name="regiEndDate"
                      placeholder="언제 마감할까요?"
                      onChange={(date) => {
                        if (date) {
                          const newEventStart = new Date(
                            date.getTime() + 24 * 60 * 60 * 1000
                          );
                          setValue('eventStartDate', newEventStart);

                          if (isBounded) {
                            setValue(
                              'eventEndDate',
                              new Date(newEventStart.getTime() + 60 * 60 * 1000)
                            );
                          }
                        }
                      }}
                    />
                    {errors.regiEndDate && (
                      <p className={errorTextStyle}>
                        {errors.regiEndDate.message}
                      </p>
                    )}
                  </Field>

                  {/* Capacity */}
                  <Field orientation="vertical">
                    <FieldContent>
                      <FieldLabel htmlFor="capacity" className="gap-1">
                        <span>모임 정원</span>
                        <span className="text-red-600">*</span>
                      </FieldLabel>
                      <FieldDescription>
                        신청 마감일시 이전에 정원 초과 시, 대기자가 발생하며
                        취소 여석에 따라 참여자로 전환됩니다.
                      </FieldDescription>
                      {errors.capacity && (
                        <p className={errorTextStyle}>
                          {errors.capacity.message}
                        </p>
                      )}
                    </FieldContent>
                    <Controller
                      control={control}
                      name="capacity"
                      render={({ field }) => (
                        <InputWithPlusMinusButtons
                          id="capacity"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <div className="pt-4">
                <Button
                  type="button"
                  variant="moiming"
                  size="xl"
                  className="w-full"
                  onClick={onNext}
                >
                  다음
                </Button>
              </div>
            </FieldGroup>
          )}

          {/* STEP 2: Event Description */}
          {step === 2 && (
            <FieldGroup>
              {/* Summary Card */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4 shadow-sm">
                <h3 className="text-2xl font-extrabold text-gray-900 break-words line-clamp-2">
                  {getValues('title')}
                </h3>
                <div className="space-y-3 text-base text-gray-500">
                  <p>
                    <span className="font-semibold mr-1">신청 기간:</span>
                    {isFromNow
                      ? '지금부터'
                      : formatEventDate(
                          getValues('regiStartDate').toString()
                        )}{' '}
                    - {formatEventDate(getValues('regiEndDate').toString())}
                  </p>
                  <p>
                    <span className="font-semibold mr-1">일정 정원:</span>
                    {getValues('capacity')}명
                  </p>
                </div>
              </div>

              <FieldSet>
                <FieldGroup>
                  {/* Event Start */}
                  <Field>
                    <div className="mb-2">
                      <FieldLabel
                        htmlFor="eventStartDate"
                        className="gap-1 mb-2"
                      >
                        <span>모임 시작 시간</span>
                        <span className="text-red-600">*</span>
                      </FieldLabel>
                      <ControlledDateTimePicker
                        control={control}
                        name="eventStartDate"
                        placeholder="언제 모이나요?"
                        onChange={(date) => {
                          if (date && isBounded) {
                            const newEnd = new Date(
                              date.getTime() + 60 * 60 * 1000
                            );
                            setValue('eventEndDate', newEnd);
                          }
                        }}
                      />
                      {errors.eventStartDate && (
                        <p className={errorTextStyle}>
                          {errors.eventStartDate.message}
                        </p>
                      )}
                      {!errors.eventStartDate && errors.regiEndDate && (
                        <p className={errorTextStyle}>
                          {errors.regiEndDate.message}
                        </p>
                      )}
                    </div>
                  </Field>

                  {/* Event End Toggle */}
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel>해어지는 때도 입력하기</FieldLabel>
                      <FieldDescription>
                        모임이 언제 끝나는지 알려주세요.
                      </FieldDescription>
                    </FieldContent>
                    <Controller
                      control={control}
                      name="isBounded"
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              const start = getValues('eventStartDate');
                              const newEnd = start
                                ? new Date(start.getTime() + 60 * 60 * 1000)
                                : new Date();
                              setValue('eventEndDate', newEnd);
                            } else {
                              setValue('eventEndDate', undefined);
                            }
                          }}
                        />
                      )}
                    />
                  </Field>

                  {/* Event End Date Picker */}
                  {isBounded && (
                    <Field>
                      <div className="mb-2">
                        <FieldLabel
                          htmlFor="eventEndDate"
                          className="gap-1 mb-2"
                        >
                          <span>모임 종료 시간</span>
                          <span className="text-red-600">*</span>
                        </FieldLabel>
                        <ControlledDateTimePicker
                          control={control}
                          name="eventEndDate"
                          placeholder="언제 헤어지나요?"
                        />
                        {errors.eventEndDate && (
                          <p className={errorTextStyle}>
                            {errors.eventEndDate.message}
                          </p>
                        )}
                      </div>
                    </Field>
                  )}

                  {/* Location */}
                  <Field>
                    <FieldLabel htmlFor="location">모임 장소</FieldLabel>
                    <Controller
                      control={control}
                      name="location"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="location"
                          placeholder="어디서 모이나요? (최대 20자)"
                          value={field.value ?? ''}
                        />
                      )}
                    />
                  </Field>

                  {/* Description */}
                  <Field>
                    <FieldLabel htmlFor="description">설명</FieldLabel>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="이번 일정은 어떤 일정인가요? 모임을 설명해주세요"
                          className="resize-none h-32"
                          value={field.value ?? ''}
                        />
                      )}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="xl"
                  className="flex-1"
                  onClick={() => setStep(1)}
                  disabled={loading || isSubmitting}
                >
                  이전
                </Button>
                <Button
                  type="button"
                  variant="moiming"
                  size="xl"
                  className="flex-1"
                  disabled={loading || isSubmitting}
                  onClick={async () => {
                    const isSchemaValid = await trigger();
                    const values = getValues();
                    let isManualValid = true;

                    // Cross-validation: 모집 마감 vs 모임 시작
                    if (values.regiEndDate > values.eventStartDate) {
                      form.setError('regiEndDate', {
                        type: 'manual',
                        message:
                          '모집 마감 시각이 모임 시작 시각보다 늦을 수 없습니다.',
                      });
                      isManualValid = false;
                    }

                    // Cross-validation: 모집 시작 vs 모임 시작
                    if (values.regiStartDate > values.eventStartDate) {
                      form.setError('regiStartDate', {
                        type: 'manual',
                        message:
                          '모집 시작 시각이 모임 시작 시각보다 늦을 수 없습니다.',
                      });
                      isManualValid = false;
                    }

                    if (isSchemaValid && isManualValid) {
                      setShowSaveDialog(true);
                    }
                  }}
                >
                  {loading || isSubmitting ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : null}
                  {submitButtonText}
                </Button>
              </div>
            </FieldGroup>
          )}
        </form>

        <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{saveDialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {saveDialogDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmit(onSubmit)}
                className="bg-primary text-white hover:bg-primary/90 rounded-xl"
              >
                {submitButtonText}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
