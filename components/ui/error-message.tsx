import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-4 mb-4 text-red-700 bg-red-50 rounded-md border border-red-200">
      <AlertTriangle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
}
