export default function Counter({ to }: { to: number }) {
  return <span>{to.toLocaleString()}</span>;
}
