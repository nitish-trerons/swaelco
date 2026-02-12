import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  markClassName,
  textClassName,
  subtitleClassName,
  subtitle = "Elevator Systems",
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  subtitleClassName?: string;
  subtitle?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-slate-900/70",
          markClassName,
        )}
        aria-hidden
      >
        <svg viewBox="0 0 64 64" className="h-7 w-7" role="img">
          <title>SWAELCO mark</title>
          <path d="M8 18L32 2l24 16h-8L32 8 16 18h8v9L8 22v-4Z" fill="#1f4f84" />
          <path d="M8 22v14l16 11h14l-8-6h-4L16 34v-8L8 22Z" fill="#1f4f84" />
          <path d="M56 42 32 58 8 42h8l16 11 16-11h-8v-9l16 9Z" fill="#d72038" />
          <path d="M56 28v14L40 53H26l8-6h4l10-7v-8l8-4Z" fill="#d72038" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className={cn("text-lg font-black tracking-[0.12em] text-white", textClassName)}>SWAELCO</span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300",
            subtitleClassName,
          )}
        >
          {subtitle}
        </span>
      </span>
    </span>
  );
}
