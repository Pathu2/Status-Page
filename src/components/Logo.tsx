import { CircleDot } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <CircleDot className="h-6 w-6 text-blue-600" />
      <span className="font-bold text-xl">StatusFlow</span>
    </div>
  );
}
