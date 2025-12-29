import { useState } from 'react';

export default function Login() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Hello, Login Page!</p>
      <button onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </button>
    </div>
  );
}
