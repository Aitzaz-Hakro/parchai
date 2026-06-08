"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * Mobile-only "Install app" trigger. Captures the browser's
 * `beforeinstallprompt` event and shows a button that fires the native
 * install prompt. Hidden when the app is already installed or when the
 * platform doesn't support installation (e.g. desktop, iOS Safari shows
 * its own Add-to-Home-Screen flow).
 */
export function InstallAppButton({ className }: { className?: string }) {
  const deferredRef = React.useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = React.useState(false);

  React.useEffect(() => {
    if (isStandalone()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      deferredRef.current = event as BeforeInstallPromptEvent;
      setCanInstall(true);
    };

    const onInstalled = () => {
      deferredRef.current = null;
      setCanInstall(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    const deferred = deferredRef.current;
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") {
      deferredRef.current = null;
      setCanInstall(false);
    }
  }

  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={handleInstall}
      aria-label="Install app"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md text-primary transition-colors hover:bg-secondary md:hidden",
        className,
      )}
    >
      <Download className="h-5 w-5" />
    </button>
  );
}
