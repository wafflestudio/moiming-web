import { InputWithPlusMinusButtons } from '@/components/InputWithPlusMinusButtton';
import SimpleDateTimePicker from '@/components/SimpleDateTimePicker';
import Subheader from '@/components/Subheader';
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
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const baseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해 주세요.')
    .max(20, '제목은 20자 이내로 입력해 주세요.'),
  capacity: z.number().min(1, '정원은 1명 이상이어야 합니다.'),
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
});

function createFormSchema(mode: 'create' | 'edit') {
  return baseSchema.superRefine((data, ctx) => {
    // 1. [생성 전용] 신청 마감 시간은 현재 시간 이후여야 함
    if (mode === 'create' && data.regiEndDate <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '신청 마감은 현재 이후여야 합니다.',
        path: ['regiEndDate'],
      });
    }

    // 2. 신청 기간 검증
    if (!data.isFromNow && data.regiStartDate >= data.regiEndDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '신청 마감은 신청 시작 이후여야 합니다.',
        path: ['regiEndDate'],
      });
    }

    // 3. 모임 기간 검증(종료 시간이 있을 때만)
    if (
      data.isBounded &&
      data.eventEndDate &&
      data.eventStartDate > data.eventEndDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '모임 종료는 모임 시작 이후여야 합니다.',
        path: ['eventEndDate'],
      });
    }

    // 4. 신청 마감 ≤ 모임 시작 검증 (불변 규칙)
    if (data.regiEndDate > data.eventStartDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '신청 마감은 모임 시작 이전이어야 합니다.',
        path: ['regiEndDate'],
      });
    }
  });
}

export type FormValues = z.infer<typeof baseSchema>;

interface EventFormProps {
  pageTitle: string;
  defaultValues: FormValues;
  onSubmit: (data: FormValues) => Promise<void> | void;
  loading?: boolean;
  onBack: () => void;
  submitButtonText?: string;
  saveDialogTitle?: string;
  saveDialogDescription?: string;
  mode?: 'create' | 'edit';
  isRegistrationClosed?: boolean;
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
  mode = 'create',
  isRegistrationClosed = false,
}: EventFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const schema = useMemo(() => createFormSchema(mode), [mode]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
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
      'eventStartDate',
      'eventEndDate',
    ]);

    if (isValidStep1) {
      // 추가적으로 zod superRefine의 에러도 확인해야 함
      const step1Errors = [
        errors.title,
        errors.capacity,
        errors.eventStartDate,
        errors.eventEndDate,
      ];

      if (step1Errors.every((e) => !e)) {
        setStep(2);
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    await handleFormSubmit(data);
  };

  const errorTextStyle = 'mt-0.5 text-xs text-destructive font-medium';

  return (
    <div className="flex flex-col">
      {/* Top navigation UI */}
      <Subheader title={pageTitle} onBackClick={onBack} />

      <div className="flex flex-col px-4 py-4 gap-4 max-w-2xl mx-auto w-full">
        {/* Stepper / Tabs */}
        <div className="flex px-2 py-1.5 gap-2 bg-[#E3F2FD] rounded-lg">
          <Button
            type="button"
            size="lg"
            className={`p-3 flex-1 transition-all ${
              step === 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-primary hover:bg-primary/10'
            }`}
            onClick={() => setStep(1)}
          >
            <div
              className={`flex size-4 items-center justify-center rounded-full ${
                step === 1 ? 'bg-white' : 'bg-[#BBDEFB]'
              }`}
            >
              <span
                className={`single-line-body-small ${
                  step === 1 ? 'text-ring' : 'text-[#F1F6FD]'
                }`}
              >
                1
              </span>
            </div>
            <span
              className={`single-line-body-base ${step === 1 ? 'text-[#F1F6FD]' : 'text-[#42A5F5]'}`}
            >
              기본 정보
            </span>
          </Button>
          <Button
            type="button"
            size="lg"
            className={`p-3 flex-1 transition-all ${
              step === 2
                ? 'bg-primary text-primary-foreground'
                : 'text-primary bg-white hover:bg-white/80'
            }`}
            onClick={() => {
              if (step === 1) {
                onNext();
              }
            }}
          >
            <div
              className={`flex size-4 items-center justify-center rounded-full ${
                step === 1 ? 'bg-[#BBDEFB]' : 'bg-white'
              }`}
            >
              <span
                className={`single-line-body-small ${
                  step === 1 ? 'text-[#F1F6FD]' : 'text-ring'
                }`}
              >
                2
              </span>
            </div>
            <span
              className={`single-line-body-base ${
                step === 1 ? 'text-[#42A5F5]' : 'text-[#F1F6FD]'
              }`}
            >
              모집 설정
            </span>
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <FieldGroup className="flex flex-col rounded-lg p-6 gap-6 border border-border">
              <FieldSet>
                <FieldGroup>
                  {/* Name */}
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="title" className="gap-0.5">
                      <span>모임 이름</span>
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="title"
                          placeholder="어떤 일정인가요? (최대 20자)"
                          className={`text-lg ${
                            errors.title
                              ? 'border-destructive focus:ring-destructive/10'
                              : ''
                          }`}
                        />
                      )}
                    />
                    {errors.title && (
                      <p className={errorTextStyle}>{errors.title.message}</p>
                    )}
                  </Field>

                  {/* Event Start */}
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="eventStartDate">
                      모임 시작일시
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="eventStartDate"
                      render={({ field }) => (
                        <SimpleDateTimePicker
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                            if (date && isBounded) {
                              const newEnd = new Date(
                                date.getTime() + 60 * 60 * 1000
                              );
                              setValue('eventEndDate', newEnd);
                            }
                          }}
                          placeholder="언제 모이나요?"
                        />
                      )}
                    />
                    {errors.eventStartDate && (
                      <p className={errorTextStyle}>
                        {errors.eventStartDate.message}
                      </p>
                    )}
                  </Field>

                  {/* Event End */}
                  <div className="flex flex-col gap-1.5">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel>모임 종료일시</FieldLabel>
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
                    {isBounded && (
                      <>
                        <Controller
                          control={control}
                          name="eventEndDate"
                          render={({ field }) => (
                            <SimpleDateTimePicker
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="언제 헤어지나요?"
                            />
                          )}
                        />
                        {errors.eventEndDate && (
                          <p className={errorTextStyle}>
                            {errors.eventEndDate.message}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Location */}
                  <Field className="gap-1.5">
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
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="description">설명</FieldLabel>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="이번 일정은 어떤 일정인가요? 모임을 설명해 주세요."
                          className="h-20 body-base"
                          value={field.value ?? ''}
                        />
                      )}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          )}

          {/* STEP 2: Event Description */}
          {step === 2 && (
            <FieldGroup className="flex flex-col gap-4">
              {/* Summary Card */}
              <div className="flex flex-col bg-[#F5F5F5] p-6 rounded-lg gap-1">
                <h1 className="text-[#1E1E1E]">{getValues('title')}</h1>
                <p className="body-base text-[#757575]">
                  일시: {formatEventDate(getValues('eventStartDate'))}
                  {isBounded &&
                    ` ~ ${formatEventDate(getValues('eventEndDate'))}`}
                  <br />
                  장소: {getValues('location') || '미정'}
                </p>
              </div>

              <FieldSet>
                <FieldGroup className="flex flex-col rounded-lg p-6 gap-6 border border-border">
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
                    <Field className="gap-1.5">
                      <FieldLabel htmlFor="regiStartDate" className="gap-0.5">
                        <span className="body-small">신청 시작일시</span>
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Controller
                        control={control}
                        name="regiStartDate"
                        render={({ field }) => (
                          <SimpleDateTimePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="언제 시작할까요?"
                            disabled={isFromNow || isRegistrationClosed}
                          />
                        )}
                      />
                      {errors.regiStartDate && (
                        <p className={errorTextStyle}>
                          {errors.regiStartDate.message}
                        </p>
                      )}
                    </Field>
                  )}

                  {/* Registration End */}
                  <Field className="gap-1.5">
                    <FieldLabel htmlFor="regiEndDate" className="gap-0.5">
                      <span className="body-small">신청 마감일시</span>
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="regiEndDate"
                      render={({ field }) => (
                        <SimpleDateTimePicker
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                          }}
                          placeholder="언제 마감할까요?"
                        />
                      )}
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
                      <FieldLabel htmlFor="capacity" className="gap-0.5">
                        <span className="body-small">모임 정원</span>
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <FieldDescription>
                        신청 마감 이전에 정원 초과 시 대기자가 발생하며, 취소
                        여석에 따라 참여자로 전환됩니다.
                      </FieldDescription>
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
                    {errors.capacity && (
                      <p className={errorTextStyle}>
                        {errors.capacity.message}
                      </p>
                    )}
                  </Field>
                </FieldGroup>
              </FieldSet>
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

      {/* Action area */}
      <footer className="fixed bottom-0 left-0 right-0 z-10">
        <div className="h-6 bg-gradient-to-t from-white to-transparent" />
        {step === 1 && (
          <div className="flex bg-white p-4 justify-center items-center gap-2 max-w-2xl mx-auto">
            <Button type="button" size="xl" className="w-full" onClick={onNext}>
              다음
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="flex bg-white p-4 justify-center items-center gap-2 max-w-2xl mx-auto">
            <Button
              type="button"
              variant="secondary"
              size="xl"
              className="flex-1"
              onClick={() => setStep(1)}
              disabled={loading || isSubmitting}
            >
              이전
            </Button>
            <Button
              type="button"
              size="xl"
              className="flex-1"
              disabled={loading || isSubmitting}
              onClick={async () => {
                const isSchemaValid = await trigger();

                if (isSchemaValid) {
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
        )}
      </footer>
    </div>
  );
}
