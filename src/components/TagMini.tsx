interface TagMiniProps {
  background: string;
  foreground: string;
  content: string;
}

export default function TagMini(props: TagMiniProps) {
  return (
    <div className={`flex ${props.background} rounded-md px-1.5 py-1.5`}>
      <span className={`${props.foreground} tag-base`}>{props.content}</span>
    </div>
  );
}
