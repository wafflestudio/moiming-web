import { createEvent } from '@/api/events/event';
import { DateTimePicker } from '@/components/DateTimePicker';
import { InputWithPlusMinusButtons } from '@/components/InputWithPlusMinusButtton';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import useAuthStore from '@/hooks/useAuthStore';
import { ChevronLeftIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function NewEvent() {
  const now = new Date();

  // 3 days later from now
  const initialRegiEndDate = new Date(now.getTime() + 72 * 60 * 60 * 1000);

  const [eventStartDate, setEventStartDate] = useState<Date>(now);
  const [eventEndDate, setEventEndDate] = useState<Date | undefined>(now);
  const [regiStartDate, setRegiStartDate] = useState<Date | undefined>(now);
  const [regiEndDate, setRegiEndDate] = useState<Date | undefined>(
    initialRegiEndDate
  );
  const [isBounded, setIsBounded] = useState<boolean>(false);
  const [isFromNow, setIsFromNow] = useState<boolean>(true);
  const [isAlwaysOpen, setIsAlwaysOpen] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [capacity, setCapacity] = useState<number>(4);
  const [waitlistEnabled, setWaitlistEnabled] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!title.trim()) {
      toast.error('모임 이름을 입력해주세요.');
      return;
    }

    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        location: location.trim() || undefined,
        description: description.trim() || undefined,
        startsAt: eventStartDate.toISOString(),
        endsAt:
          isBounded && eventEndDate ? eventEndDate.toISOString() : undefined,
        capacity: capacity,
        waitlistEnabled: waitlistEnabled,
        registrationStartsAt: regiStartDate
          ? regiStartDate.toISOString()
          : new Date().toISOString(),
        registrationEndsAt: regiEndDate
          ? regiEndDate.toISOString()
          : '2099-12-31T23:59:59.999Z', // placeholder
      };

      const response = await createEvent(payload);

      if (response.status === 201 || response.status === 200) {
        toast.success('일정이 성공적으로 생성되었습니다!');
        // 성공 시 상세 페이지 또는 홈으로 이동
        const eventId = response.data.publicId;
        navigate(`/event/${eventId}`);
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('일정 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaitlistChange = (checked: boolean) => {
    setWaitlistEnabled(checked);
  };

  const handleBoundedChange = (checked: boolean) => {
    setIsBounded(checked);

    // The end date is automatically set to one hour after the start date
    if (checked && eventStartDate) {
      setEventEndDate(new Date(eventStartDate.getTime() + 60 * 60 * 1000));
    } else {
      setEventEndDate(undefined);
    }
  };

  const handleFromNowChange = (checked: boolean) => {
    setIsFromNow(checked);

    if (checked) {
      setRegiStartDate(new Date());
    }
  };

  const handleAlwaysOpenChange = (checked: boolean) => {
    setIsAlwaysOpen(checked);

    if (checked) {
      setRegiEndDate(undefined);
    } else if (regiStartDate) {
      setRegiEndDate(new Date(regiStartDate.getTime() + 72 * 60 * 60 * 1000));
    } else {
      setRegiEndDate(new Date(now.getTime() + 72 * 60 * 60 * 1000));
    }
  };

  // TODO: Add a validation logic
  // TODO: Add a vote system
  return (
    <div className="flex-1 flex justify-center">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* Top navigation UI */}
        <div className="flex items-center gap-3">
          <ChevronLeftIcon onClick={() => navigate(-1)} />
          <h2 className="text-xl font-semibold">일정 만들기</h2>
        </div>

        {/* Fields */}
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                {/* 1. Title */}
                <Field>
                  <FieldLabel
                    htmlFor="checkout-7j9-card-name-43j"
                    className="gap-1"
                  >
                    <span>이름</span>
                    <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="무슨 모임인가요?"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Field>

                {/* 2. Start date & time of the event */}
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                    만나는 때
                  </FieldLabel>
                  <DateTimePicker
                    date={eventStartDate}
                    setDate={setEventStartDate}
                    placeholder="언제 모이나요?"
                  />
                </Field>

                {/* 3. End date & time of the event */}
                <Field orientation="horizontal">
                  <FieldLabel>헤어지는 때도 입력하기</FieldLabel>
                  <Switch
                    defaultChecked={isBounded}
                    onCheckedChange={handleBoundedChange}
                  />
                </Field>
                {isBounded && (
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                      헤어지는 때
                    </FieldLabel>
                    <DateTimePicker
                      date={eventEndDate}
                      setDate={setEventEndDate}
                      placeholder="언제 헤어지나요?"
                    />
                  </Field>
                )}

                {/* 4. Location of the event */}
                <Field>
                  <FieldLabel htmlFor="checkout-exp-month-ts6">장소</FieldLabel>
                  <Input
                    id="checkout-exp-month-ts6"
                    placeholder="어디서 모이나요?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Field>

                {/* 5. Description of the event */}
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    설명
                  </FieldLabel>
                  <Textarea
                    id="checkout-7j9-optional-comments"
                    placeholder="모임을 설명해주세요."
                    className="resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>신청 옵션</FieldLegend>
              <FieldGroup>
                {/* 6. Quota */}
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                    모집 정원
                  </FieldLabel>
                  <InputWithPlusMinusButtons
                    value={capacity}
                    onChange={setCapacity}
                  />
                </Field>

                {/* 7. Waitlist option */}
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                      대기 허용
                    </FieldLabel>
                    <FieldDescription>
                      정원이 가득 찼을 때도 참가 신청을 받을 수 있어요.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    checked={waitlistEnabled}
                    onCheckedChange={handleWaitlistChange}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              <FieldLegend>모집 기간</FieldLegend>
              <FieldGroup>
                {/* 8. Start date & time of the registration */}
                {!isFromNow && (
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel>시작일시</FieldLabel>
                    </FieldContent>
                    <DateTimePicker
                      date={regiStartDate}
                      setDate={setRegiStartDate}
                      placeholder="언제 시작할까요?"
                    />
                  </Field>
                )}

                {/* 9. End date & time of the registration */}
                {!isAlwaysOpen && (
                  <Field orientation="responsive">
                    <FieldContent>
                      <FieldLabel>마감일시</FieldLabel>
                    </FieldContent>
                    <DateTimePicker
                      date={regiEndDate}
                      setDate={setRegiEndDate}
                      placeholder="언제 마감할까요?"
                    />
                  </Field>
                )}

                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel>지금부터 모집하기</FieldLabel>
                    <FieldDescription>
                      일정을 만든 즉시 참가 신청을 시작해요.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    defaultChecked={isFromNow}
                    onCheckedChange={handleFromNowChange}
                  />
                </Field>

                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel>상시 모집하기</FieldLabel>
                    <FieldDescription>
                      일정을 만들고 나서도 언제든지 모집을 닫을 수 있어요.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    defaultChecked={isAlwaysOpen}
                    onCheckedChange={handleAlwaysOpenChange}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field orientation="horizontal">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/2"
                disabled={isSubmitting}
              >
                돌아가기
              </Button>
              <Button
                type="submit"
                className="w-1/2"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : null}
                일정 만들기
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
