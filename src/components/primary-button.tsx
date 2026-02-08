import Link from "next/link";
import { clsx } from "clsx";

const baseClasses =
  "inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700";

export function PrimaryButton({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={clsx(baseClasses, className)}>
      {children}
    </Link>
  );
}
