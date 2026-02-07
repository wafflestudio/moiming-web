import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import useAuth from '@/hooks/useAuth';
import { useState } from 'react';

export default function LoginEmail() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <form className="w-full">
      <FieldGroup className="flex gap-6">
        <Field className="flex gap-1.5">
          <FieldLabel>
            <span>이메일</span>
          </FieldLabel>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field className="flex gap-1.5">
          <FieldLabel>
            <span>비밀번호</span>
          </FieldLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Field>
          <Button type="submit" onClick={handleSubmit}>
            로그인
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
