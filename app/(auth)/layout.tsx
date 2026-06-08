import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50rem_30rem_at_50%_-10%,rgba(15,118,110,0.10),transparent)]" />
      <Link href="/" className="mb-8">
        <BrandLogo className="[&_span:last-child]:text-xl" />
      </Link>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        By continuing you agree to Parchai&apos;s terms and privacy policy.
      </p>
    </div>
  );
}
