import { cn } from "@/lib/utils";

export const Indicator = ({ className, show, children }: { className?: string; show: boolean; children: JSX.Element }) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {show && (
        <span className="absolute -top-1 -right-1 w-4 h-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="absolute inline-flex rounded-full w-4 h-4 bg-red-500"></span>
        </span>
      )}
    </div>
  )
}