import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function NewEventButton() {
  const navigate = useNavigate();

  const onNewEventClicked = () => {
    navigate('/new-event');
  };

  return (
    <Button onClick={onNewEventClicked} className="h-[40px]">
      <Plus stroke="#F1F6FD" width="16" height="16" />
      <span className="single-line-body-base text-primary-foreground">
        새 모임 만들기
      </span>
    </Button>
  );
}
