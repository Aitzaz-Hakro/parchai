import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  PackageCheck,
  RefreshCw,
  ShoppingCart,
  Store,
  Truck,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand-logo";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroVisual } from "@/components/landing/hero-visual";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>

      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_70%_-10%,rgba(15,118,110,0.10),transparent)]" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Built for Pakistani wholesalers &amp; retailers
          </span>

          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Order from your supplier in{" "}
            <span className="text-primary">seconds.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            No more paper parchi. No more waiting for the order-picker to visit.
            Browse your supplier&apos;s catalogue, place orders, track delivery,
            and manage udhaar — all from your phone.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">
                <Store className="h-4 w-4" />
                I&apos;m a Wholesaler
              </Link>
            </Button>
            <Button asChild size="lg" variant="accent">
              <Link href="/signup">
                <ShoppingCart className="h-4 w-4" />
                I&apos;m a Retailer
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[
              "No setup fee",
              "Works on any phone",
              "Urdu-friendly",
            ].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Boxes,
      title: "Wholesaler adds products",
      body: "Build your catalogue with prices, units and stock — once. Update anytime.",
    },
    {
      icon: ClipboardList,
      title: "Retailer places the order",
      body: "Shopkeepers browse the catalogue and order in a few taps. No phone calls.",
    },
    {
      icon: Truck,
      title: "Delivered, invoice auto-made",
      body: "Track every order to delivery. Invoices and udhaar are recorded automatically.",
    },
  ];

  return (
    <section id="how-it-works" className="border-t bg-muted/30 py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From parchi to delivered in three steps"
          subtitle="A simple flow that mirrors how wholesale ordering already works — just faster and on the record."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border bg-card p-6 shadow-sm"
            >
              <span className="absolute right-5 top-5 font-heading text-4xl font-extrabold text-primary/10">
                {i + 1}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const wholesaler = [
    { icon: Boxes, label: "Manage product catalogue" },
    { icon: PackageCheck, label: "Receive orders instantly" },
    { icon: FileText, label: "Generate PDF invoices" },
    { icon: Wallet, label: "Track udhaar & payments" },
    { icon: BarChart3, label: "Analytics dashboard" },
  ];
  const retailer = [
    { icon: Store, label: "Browse supplier catalogue" },
    { icon: RefreshCw, label: "One-tap reorder" },
    { icon: Truck, label: "Track order status live" },
    { icon: ClipboardList, label: "Record sold-out items" },
    { icon: CreditCard, label: "View credit balance" },
  ];

  return (
    <section id="features" className="py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="One platform, both sides of the counter"
          subtitle="Whether you supply or you sell, Parchai keeps every order, rupee and item in sync."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <FeatureColumn
            tone="primary"
            badge="For Wholesalers"
            icon={Store}
            items={wholesaler}
          />
          <FeatureColumn
            tone="accent"
            badge="For Retailers"
            icon={ShoppingCart}
            items={retailer}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureColumn({
  tone,
  badge,
  icon: Icon,
  items,
}: {
  tone: "primary" | "accent";
  badge: string;
  icon: typeof Store;
  items: { icon: typeof Store; label: string }[];
}) {
  const toneClasses =
    tone === "primary"
      ? "bg-primary/10 text-primary"
      : "bg-accent/15 text-accent-foreground";
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClasses}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {badge}
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClasses}`}
            >
              <item.icon className="h-[18px] w-[18px]" />
            </span>
            <span className="text-sm font-medium text-foreground">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "Pehle din mein 40 parchi likhta tha. Ab sab phone pe aata hai — galti bhi nahi hoti aur hisaab saaf rehta hai.",
      name: "Haji Aslam",
      role: "Distributor, Faisalabad",
    },
    {
      quote:
        "Order picker ka intezaar khatam. Subah stock check kar ke order laga deta hoon, dopahar tak maal aa jata hai.",
      name: "Bilal Ahmed",
      role: "Kiryana store, Lahore",
    },
    {
      quote:
        "Udhaar ka record sab se bara faida hai. Ab kisi se behes nahi hoti, sab kuch app mein likha hota hai.",
      name: "Usman Traders",
      role: "Medical store, Karachi",
    },
  ];
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Trusted locally"
          title="Loved by shopkeepers and suppliers"
          subtitle="Real workflows from kiryana stores, medical stores and distributors across Pakistan."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm"
            >
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.name.slice(0, 2)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free, pay as you grow"
          subtitle="No setup fees. Begin with everything you need and upgrade only when your order volume does."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <h3 className="text-lg font-semibold">Starter</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For a single shop or supplier getting started.
            </p>
            <p className="mt-5 font-heading text-4xl font-extrabold">
              Free
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                "Unlimited orders",
                "Product catalogue",
                "Udhaar ledger",
                "Live order tracking",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7 w-full">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          <div className="relative rounded-2xl border-2 border-primary bg-card p-8 shadow-md">
            <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Most popular
            </span>
            <h3 className="text-lg font-semibold">Business</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For growing distributors with many retailers.
            </p>
            <p className="mt-5 font-heading text-4xl font-extrabold tabular-nums">
              PKR 1,500
              <span className="text-base font-medium text-muted-foreground">
                /mo
              </span>
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                "Everything in Starter",
                "PDF invoices & branding",
                "Analytics dashboard",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant="accent" className="mt-7 w-full">
              <Link href="/signup">Start Business plan</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Ready to modernize your orders?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
          Join the wholesalers and retailers moving off paper parchi. It takes
          two minutes to set up.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="accent">
            <Link href="/signup">
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <BrandLogo />
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Parchai. Made for Pakistani
          businesses.
        </p>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
          <Link href="/login" className="hover:text-foreground">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-wide text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
