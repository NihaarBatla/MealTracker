
interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-red-500 text-sm p-4 bg-red-50 rounded-xl border border-red-100">
      {message}
    </div>
  );
}