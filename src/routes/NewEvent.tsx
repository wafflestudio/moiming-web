import { DateTimePicker } from '@/components/DateTimePicker';
import { Button } from '@/components/ui/button';
import {
  Field,
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
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isFromNow, setIsFromNow] = useState<boolean>(false);
  const [isAlwaysOpen, setIsAlwaysOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = () => {
    // TODO: Send a payload to the server
    console.info('Event created!');
  };

  const handleFromNowChange = (checked: boolean) => {
    setIsFromNow(checked);

    if (checked) {
      setStartDate(new Date());
    }
  };

  const handleAlwaysOpenChange = (checked: boolean) => {
    setIsAlwaysOpen(checked);

    if (checked) {
      setEndDate(undefined);
    } else {
      setEndDate(new Date());
    }
  };

  // TODO: Modularize the date & time picker components
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

                {/* 2. Date & time of the event */}
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                    만나는 때
                  </FieldLabel>
                  <DateTimePicker
                    date={eventDate}
                    setDate={setEventDate}
                    placeholder="언제 모이나요?"
                  />
                </Field>

                {/* 3. Location of the event */}
                <Field>
                  <FieldLabel htmlFor="checkout-exp-month-ts6">장소</FieldLabel>
                  <Input
                    id="checkout-7j9-card-name-43j"
                    placeholder="어디서 모이나요?"
                  />
                </Field>

                {/* 4. Description of the event */}
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
              <FieldLegend>모집 기간</FieldLegend>
              <FieldDescription>
                언제부터 언제까지 참가자를 모집할까요?
              </FieldDescription>
              <FieldGroup>
                {/* 5. Start date & time of the registration */}
                <Field orientation="horizontal">
                  <Switch
                    defaultChecked={isFromNow}
                    onCheckedChange={handleFromNowChange}
                  />
                  <FieldLabel>지금부터 모집하기</FieldLabel>
                </Field>
                {!isFromNow && (
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                      시작일시
                    </FieldLabel>
                    <DateTimePicker
                      date={startDate}
                      setDate={setStartDate}
                      placeholder="언제 시작할까요?"
                    />
                  </Field>
                )}
                {/* 6. End date & time of the registration */}
                <Field orientation="horizontal">
                  <Switch
                    defaultChecked={isAlwaysOpen}
                    onCheckedChange={handleAlwaysOpenChange}
                  />
                  <FieldLabel>상시 모집하기</FieldLabel>
                  <FieldDescription>
                    일정을 만들고 나서도 언제든지 모집을 종료할 수 있어요.
                  </FieldDescription>
                </Field>
                {!isAlwaysOpen && (
                  <Field>
                    <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                      마감일시
                    </FieldLabel>
                    <DateTimePicker
                      date={endDate}
                      setDate={setEndDate}
                      placeholder="언제 끝낼까요?"
                    />
                  </Field>
                )}
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
