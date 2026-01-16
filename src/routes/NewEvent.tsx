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
import { ChevronLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

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

  const navigate = useNavigate();

  const handleSubmit = () => {
    // TODO: Send a payload to the server
    console.info('Event created!');
  };

  const handleWaitlistChange = (checked: boolean) => {
    // TODO: Handle the waitlist option
    console.info('Waitlist enabled:', checked);
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
                    id="checkout-7j9-card-name-43j"
                    placeholder="어디서 모이나요?"
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
                  <InputWithPlusMinusButtons />
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
                    defaultChecked={true}
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
              >
                돌아가기
              </Button>
              <Button type="submit" onClick={handleSubmit} className="w-1/2">
                일정 만들기
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
