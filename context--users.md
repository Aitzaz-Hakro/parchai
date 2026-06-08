You are building a B2B SaaS platform called **Parchai** — a wholesale-to-retail 
order communication system for the Pakistani market. This replaces paper-based 
ordering between wholesalers and their retailer shops.

---

## CONTEXT & USERS

Two types of users share one platform:

**Wholesaler** — A supplier/distributor who:
- Manages product catalogue with prices
- Receives and processes orders from retailers
- Generates invoices and bills
- Tracks payments and udhaar (credit owed)
- Manages which retailers are linked to them

**Retailer (Shopkeeper)** — A small shop owner who:
- Browses their linked supplier's product catalogue
- Places orders directly through the app
- Tracks order status (pending → confirmed → dispatched → delivered)
- Records sold-out stock items
- Views udhaar/credit balance with each supplier
- Sees analytics on which items sell most

---

## TECH STACK

- Next.js 15 or after App Router
- Tailwind CSS
- Supabase (Auth + PostgreSQL + Realtime)
- Zustand for state

---

## DATABASE SCHEMA (already live in Supabase)

Tables: profiles, wholesalers, retailers, wholesaler_retailer, 
products, orders, order_items, invoices, udhaar, stock_tracker

Key relationships:
- profiles has role: 'wholesaler' | 'retailer'
- wholesaler_retailer links the two parties
- orders: retailer places → wholesaler fulfills
- udhaar: credit ledger per retailer-wholesaler pair
- stock_tracker: retailer marks items as sold out / needs reorder

---

## WHAT TO BUILD

Build the complete platform starting from the marketing landing page 
through both authenticated portals.

---

### PAGE 1 — LANDING PAGE (/)

Design a conversion-focused landing page for Pakistani wholesale/retail 
businesses. The audience is small business owners — think kiryana stores, 
medical stores, hardware shops. Language hint: mix English UI with 
Urdu-friendly spacing (Nastaliq doesn't render here, but keep layout 
RTL-compatible mentally).

Sections:

**Hero** — Bold headline communicating "order from your supplier in 
seconds, no more paper, no more order picker visits." CTA buttons: 
"I'm a Wholesaler" and "I'm a Retailer" — both go to /signup.
Background: clean, modern, trust-building. Not startup-flashy.

**[REFERENCE_SECTION

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
canvas.tsx
// @ts-ignore
function n(e) {
  // @ts-ignore
  this.init(e || {});
}
n.prototype = {
  // @ts-ignore
  init: function (e) {
    // @ts-ignore
    this.phase = e.phase || 0;
    // @ts-ignore
    this.offset = e.offset || 0;
    // @ts-ignore
    this.frequency = e.frequency || 0.001;
    // @ts-ignore
    this.amplitude = e.amplitude || 1;
  },
  update: function () {
    return (
      // @ts-ignore
      (this.phase += this.frequency),
      // @ts-ignore
      (e = this.offset + Math.sin(this.phase) * this.amplitude)
    );
  },
  value: function () {
    return e;
  },
};

// @ts-ignore
function Line(e) {
  // @ts-ignore
  this.init(e || {});
}

Line.prototype = {
  // @ts-ignore
  init: function (e) {
    // @ts-ignore
    this.spring = e.spring + 0.1 * Math.random() - 0.05;
    // @ts-ignore
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    // @ts-ignore
    this.nodes = [];
    for (var t, n = 0; n < E.size; n++) {
      t = new Node();
      // @ts-ignore
      t.x = pos.x;
      // @ts-ignore
      t.y = pos.y;
      // @ts-ignore
      this.nodes.push(t);
    }
  },
  update: function () {
    // @ts-ignore
    let e = this.spring,
      // @ts-ignore
      t = this.nodes[0];
    // @ts-ignore
    t.vx += (pos.x - t.x) * e;
    // @ts-ignore
    t.vy += (pos.y - t.y) * e;
    // @ts-ignore
    for (var n, i = 0, a = this.nodes.length; i < a; i++)
      // @ts-ignore
      (t = this.nodes[i]),
        0 < i &&
          // @ts-ignore
          ((n = this.nodes[i - 1]),
          (t.vx += (n.x - t.x) * e),
          (t.vy += (n.y - t.y) * e),
          (t.vx += n.vx * E.dampening),
          (t.vy += n.vy * E.dampening)),
        // @ts-ignore
        (t.vx *= this.friction),
        // @ts-ignore
        (t.vy *= this.friction),
        (t.x += t.vx),
        (t.y += t.vy),
        (e *= E.tension);
  },
  draw: function () {
    let e,
      t,
      // @ts-ignore
      n = this.nodes[0].x,
      // @ts-ignore
      i = this.nodes[0].y;
    // @ts-ignore
    ctx.beginPath();
    // @ts-ignore
    ctx.moveTo(n, i);
    // @ts-ignore
    for (var a = 1, o = this.nodes.length - 2; a < o; a++) {
      // @ts-ignore
      e = this.nodes[a];
      // @ts-ignore
      t = this.nodes[a + 1];
      n = 0.5 * (e.x + t.x);
      i = 0.5 * (e.y + t.y);
      // @ts-ignore
      ctx.quadraticCurveTo(e.x, e.y, n, i);
    }
    // @ts-ignore
    e = this.nodes[a];
    // @ts-ignore
    t = this.nodes[a + 1];
    // @ts-ignore
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
    // @ts-ignore
    ctx.stroke();
    // @ts-ignore
    ctx.closePath();
  },
};

// @ts-ignore
function onMousemove(e) {
  function o() {
    lines = [];
    for (let e = 0; e < E.trails; e++)
      lines.push(new Line({ spring: 0.45 + (e / E.trails) * 0.025 }));
  }
  // @ts-ignore
  function c(e) {
    e.touches
      ? // @ts-ignore
        ((pos.x = e.touches[0].pageX), (pos.y = e.touches[0].pageY))
      : // @ts-ignore
        ((pos.x = e.clientX), (pos.y = e.clientY)),
      e.preventDefault();
  }
  // @ts-ignore
  function l(e) {
    // @ts-ignore
    1 == e.touches.length &&
      ((pos.x = e.touches[0].pageX), (pos.y = e.touches[0].pageY));
  }
  document.removeEventListener("mousemove", onMousemove),
    document.removeEventListener("touchstart", onMousemove),
    document.addEventListener("mousemove", c),
    document.addEventListener("touchmove", c),
    document.addEventListener("touchstart", l),
    c(e),
    o(),
    render();
}

function render() {
  // @ts-ignore
  if (ctx.running) {
    // @ts-ignore
    ctx.globalCompositeOperation = "source-over";
    // @ts-ignore
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // @ts-ignore
    ctx.globalCompositeOperation = "lighter";
    // @ts-ignore
    ctx.strokeStyle = "hsla(" + Math.round(f.update()) + ",100%,50%,0.025)";
    // @ts-ignore
    ctx.lineWidth = 10;
    for (var e, t = 0; t < E.trails; t++) {
      // @ts-ignore
      (e = lines[t]).update();
      e.draw();
    }
    // @ts-ignore
    ctx.frame++;
    window.requestAnimationFrame(render);
  }
}

function resizeCanvas() {
  // @ts-ignore
  ctx.canvas.width = window.innerWidth - 20;
  // @ts-ignore
  ctx.canvas.height = window.innerHeight;
}

// @ts-ignore
var ctx,
  // @ts-ignore
  f,
  e = 0,
  pos = {},
  // @ts-ignore
  lines = [],
  E = {
    debug: true,
    friction: 0.5,
    trails: 80,
    size: 50,
    dampening: 0.025,
    tension: 0.99,
  };
function Node() {
  this.x = 0;
  this.y = 0;
  this.vy = 0;
  this.vx = 0;
}

export const renderCanvas = function () {
  // @ts-ignore
  ctx = document.getElementById("canvas").getContext("2d");
  ctx.running = true;
  ctx.frame = 1;
  f = new n({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });
  document.addEventListener("mousemove", onMousemove);
  document.addEventListener("touchstart", onMousemove);
  document.body.addEventListener("orientationchange", resizeCanvas);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("focus", () => {
    // @ts-ignore
    if (!ctx.running) {
      // @ts-ignore
      ctx.running = true;
      render();
    }
  });
  window.addEventListener("blur", () => {
    // @ts-ignore
    ctx.running = true;
  });
  resizeCanvas();
};


demo.tsx
"use client";

// this is a client component
import { useEffect } from "react";
import Link from "next/link";
import { renderCanvas } from "@/components/ui/canvas"
import { DIcons } from "dicons";

import { Button } from "@/components/ui/button";

export function Hero() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home">
      <div className="animation-delay-8 animate-fadeIn mt-20 flex  flex-col items-center justify-center px-4 text-center md:mt-20">
        <div className="z-10 mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
          <div className="relative flex items-center whitespace-nowrap rounded-full border bg-popover px-3 py-1 text-xs leading-6  text-primary/60 ">
            <DIcons.Shapes className="h-5 p-1" /> Introducing Dicons.
            <a
              href="/products/dicons"
              rel="noreferrer"
              className="hover:text-ali ml-1 flex items-center font-semibold"
            >
              <div className="absolute inset-0 flex" aria-hidden="true" />
              Explore{" "}
              <span aria-hidden="true">
                <DIcons.ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>

        <div className="mb-10 mt-4  md:mt-6">
          <div className="px-2">
            <div className="border-ali relative mx-auto h-full max-w-7xl border p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20">
              <h1 className="flex  select-none flex-col  px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-ali absolute -left-5 -top-5 h-10 w-10"
                />
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-ali absolute -bottom-5 -left-5 h-10 w-10"
                />
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-ali absolute -right-5 -top-5 h-10 w-10"
                />
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-ali absolute -bottom-5 -right-5 h-10 w-10"
                />
                Your complete platform for the Design.
              </h1>
              <div className="flex items-center justify-center gap-1">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-xs text-green-500">Available Now</p>
              </div>
            </div>
          </div>

          <h1 className="mt-8 text-2xl md:text-2xl">
            Welcome to my creative playground! I&#39;m{" "}
            <span className="text-ali font-bold">Ali </span>
          </h1>

          <p className="md:text-md mx-auto mb-16 mt-2 max-w-2xl px-6 text-sm text-primary/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
            I craft enchanting visuals for brands, and conjure design resources
            to empower others.
          </p>
          <div className="flex justify-center gap-2">
            <Link href={"/dashboard"}>
              <Button variant="default" size="lg">
                Start Project
              </Button>
            </Link>
            <Link href={"https://cal.com/aliimam/designali"} target="_blank">
              <Button variant="outline" size="lg">
                Book a call
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
    </section>
  );
};

 

```

Copy-paste these files for dependencies:
```tsx
shadcn/button
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

Install NPM dependencies:
```bash
@radix-ui/react-slot, class-variance-authority
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
]** 

**customers**-- Reference [You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
features.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Avatars from the original example
const MESCHAC_AVATAR = 'https://avatars.githubusercontent.com/u/47919550?v=4'
const BERNARD_AVATAR = 'https://avatars.githubusercontent.com/u/31113941?v=4'
const THEO_AVATAR = 'https://avatars.githubusercontent.com/u/68236786?v=4'
const GLODIE_AVATAR = 'https://avatars.githubusercontent.com/u/99137927?v=4'

export type Customer = {
  id: number | string
  date: string
  status: 'Paid' | 'Cancelled' | 'Ref'
  statusVariant: 'success' | 'danger' | 'warning'
  name: string
  avatar: string
  revenue: string
}

export type CustomersTableCardProps = {
  title?: string
  subtitle?: string
  className?: string
  customers?: Customer[]
}

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 1,
    date: '10/31/2023',
    status: 'Paid',
    statusVariant: 'success',
    name: 'Bernard Ng',
    avatar: BERNARD_AVATAR,
    revenue: '$43.99',
  },
  {
    id: 2,
    date: '10/21/2023',
    status: 'Ref',
    statusVariant: 'warning',
    name: 'Méschac Irung',
    avatar: MESCHAC_AVATAR,
    revenue: '$19.99',
  },
  {
    id: 3,
    date: '10/15/2023',
    status: 'Paid',
    statusVariant: 'success',
    name: 'Glodie Ng',
    avatar: GLODIE_AVATAR,
    revenue: '$99.99',
  },
  {
    id: 4,
    date: '10/12/2023',
    status: 'Cancelled',
    statusVariant: 'danger',
    name: 'Theo Ng',
    avatar: THEO_AVATAR,
    revenue: '$19.99',
  },
]

const Badge = ({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: 'success' | 'danger' | 'warning'
}) => {
  const styles =
    variant === 'success'
      ? 'bg-lime-500/15 text-lime-800 dark:text-lime-300'
      : variant === 'danger'
      ? 'bg-red-500/15 text-red-800 dark:text-red-300'
      : 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300'

  return (
    <span className={cn('rounded-full px-2 py-1 text-xs font-medium', styles)}>
      {children}
    </span>
  )
}

/**
 * Responsive, polished table wrapped in a card container.
 * - Sticky header on wide screens
 * - Horizontal scroll on small screens
 * - Subtle borders, shadows, and hover states
 */
export default function CustomersTableCard({
  title = 'Customers',
  subtitle = 'New users by First user primary channel group (Default Channel Group)',
  customers = DEFAULT_CUSTOMERS,
  className,
}: CustomersTableCardProps) {
  return (
    <section
      className={cn(
        'bg-background shadow-foreground/5 inset-ring-1 inset-ring-background ring-foreground/5 relative w-full overflow-hidden rounded-2xl border border-border/60 shadow-md ring-1',
        className
      )}
      aria-label={title}
    >
      {/* Header */}
      <div className="space-y-1 border-b border-border/60 p-6">
        <div className="flex items-center gap-1.5">
          <span className="bg-muted size-2 rounded-full border border-black/5" />
          <span className="bg-muted size-2 rounded-full border border-black/5" />
          <span className="bg-muted size-2 rounded-full border border-black/5" />
        </div>
        <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>

      {/* Table wrapper for responsive overflow */}
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full border-collapse text-sm">
          <thead className="bg-muted/50 supports-[backdrop-filter]:backdrop-blur-sm sticky top-0 z-10">
            <tr className="text-muted-foreground *:text-left *:px-3 *:py-3 *:font-medium">
              <th className="w-12">#</th>
              <th className="min-w-[120px]">Date</th>
              <th className="min-w-[120px]">Status</th>
              <th className="min-w-[220px]">Customer</th>
              <th className="min-w-[120px] text-right pr-4">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr
                key={customer.id}
                className="hover:bg-muted/30 transition-colors *:px-3 *:py-2 border-b border-border/60 last:border-0"
              >
                <td className="text-muted-foreground">{idx + 1}</td>
                <td className="whitespace-nowrap">{customer.date}</td>
                <td>
                  <Badge variant={customer.statusVariant}>{customer.status}</Badge>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="size-7 overflow-hidden rounded-full ring-1 ring-border/60">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        width={28}
                        height={28}
                        loading="lazy"
                      />
                    </div>
                    <span className="text-foreground font-medium truncate">{customer.name}</span>
                  </div>
                </td>
                <td className="text-right pr-4 font-medium tabular-nums">{customer.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer (optional) */}
      <div className="flex items-center justify-between border-t border-border/60 p-4 text-xs text-muted-foreground">
        <span>
          Showing <strong>{customers.length}</strong> {customers.length === 1 ? 'row' : 'rows'}
        </span>
        <span>Updated just now</span>
      </div>
    </section>
  )
}



demo.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

// Avatars from the original example
const MESCHAC_AVATAR = 'https://avatars.githubusercontent.com/u/47919550?v=4'
const BERNARD_AVATAR = 'https://avatars.githubusercontent.com/u/31113941?v=4'
const THEO_AVATAR = 'https://avatars.githubusercontent.com/u/68236786?v=4'
const GLODIE_AVATAR = 'https://avatars.githubusercontent.com/u/99137927?v=4'

export type Customer = {
  id: number | string
  date: string
  status: 'Paid' | 'Cancelled' | 'Ref'
  statusVariant: 'success' | 'danger' | 'warning'
  name: string
  avatar: string
  revenue: string
}

export type CustomersTableCardProps = {
  title?: string
  subtitle?: string
  className?: string
  customers?: Customer[]
}

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 1,
    date: '10/31/2023',
    status: 'Paid',
    statusVariant: 'success',
    name: 'Bernard Ng',
    avatar: BERNARD_AVATAR,
    revenue: '$43.99',
  },
  {
    id: 2,
    date: '10/21/2023',
    status: 'Ref',
    statusVariant: 'warning',
    name: 'Méschac Irung',
    avatar: MESCHAC_AVATAR,
    revenue: '$19.99',
  },
  {
    id: 3,
    date: '10/15/2023',
    status: 'Paid',
    statusVariant: 'success',
    name: 'Glodie Ng',
    avatar: GLODIE_AVATAR,
    revenue: '$99.99',
  },
  {
    id: 4,
    date: '10/12/2023',
    status: 'Cancelled',
    statusVariant: 'danger',
    name: 'Theo Ng',
    avatar: THEO_AVATAR,
    revenue: '$19.99',
  },
]

const Badge = ({
  children,
  variant,
}: {
  children: React.ReactNode
  variant: 'success' | 'danger' | 'warning'
}) => {
  const styles =
    variant === 'success'
      ? 'bg-lime-500/15 text-lime-800 dark:text-lime-300'
      : variant === 'danger'
      ? 'bg-red-500/15 text-red-800 dark:text-red-300'
      : 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300'

  return (
    <span className={cn('rounded-full px-2 py-1 text-xs font-medium', styles)}>
      {children}
    </span>
  )
}

/**
 * Responsive, polished table wrapped in a card container.
 * - Sticky header on wide screens
 * - Horizontal scroll on small screens
 * - Subtle borders, shadows, and hover states
 */
export function CustomersTableCard({
  title = 'Customers',
  subtitle = 'New users by First user primary channel group (Default Channel Group)',
  customers = DEFAULT_CUSTOMERS,
  className,
}: CustomersTableCardProps) {
  return (
    <section
      className={cn(
        'bg-background shadow-foreground/5 inset-ring-1 inset-ring-background ring-foreground/5 relative w-full overflow-hidden rounded-2xl border border-border/60 shadow-md ring-1',
        className
      )}
      aria-label={title}
    >
      {/* Header */}
      <div className="space-y-1 border-b border-border/60 p-6">
        <div className="flex items-center gap-1.5">
          <span className="bg-muted size-2 rounded-full border border-black/5" />
          <span className="bg-muted size-2 rounded-full border border-black/5" />
          <span className="bg-muted size-2 rounded-full border border-black/5" />
        </div>
        <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </div>

      {/* Table wrapper for responsive overflow */}
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full border-collapse text-sm">
          <thead className="bg-muted/50 supports-[backdrop-filter]:backdrop-blur-sm sticky top-0 z-10">
            <tr className="text-muted-foreground *:text-left *:px-3 *:py-3 *:font-medium">
              <th className="w-12">#</th>
              <th className="min-w-[120px]">Date</th>
              <th className="min-w-[120px]">Status</th>
              <th className="min-w-[220px]">Customer</th>
              <th className="min-w-[120px] text-right pr-4">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr
                key={customer.id}
                className="hover:bg-muted/30 transition-colors *:px-3 *:py-2 border-b border-border/60 last:border-0"
              >
                <td className="text-muted-foreground">{idx + 1}</td>
                <td className="whitespace-nowrap">{customer.date}</td>
                <td>
                  <Badge variant={customer.statusVariant}>{customer.status}</Badge>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="size-7 overflow-hidden rounded-full ring-1 ring-border/60">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        width={28}
                        height={28}
                        loading="lazy"
                      />
                    </div>
                    <span className="text-foreground font-medium truncate">{customer.name}</span>
                  </div>
                </td>
                <td className="text-right pr-4 font-medium tabular-nums">{customer.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer (optional) */}
      <div className="flex items-center justify-between border-t border-border/60 p-4 text-xs text-muted-foreground">
        <span>
          Showing <strong>{customers.length}</strong> {customers.length === 1 ? 'row' : 'rows'}
        </span>
        <span>Updated just now</span>
      </div>
    </section>
  )
}

export default function Features() {
  return (
    <section>
      <div className="bg-muted/50 py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <h2 className="text-foreground text-4xl font-semibold">Effortless Task Management</h2>
            <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">
              Automate your tasks and workflows by connecting your favorite tools like Notion, Todoist, and
              more. AI-powered scheduling helps you stay on track and adapt to changing priorities.
            </p>
            <div className="bg-foreground/5 rounded-3xl p-6">
              <CustomersTableCard />
            </div>
          </div>

          <div className="border-foreground/10 relative mt-16 grid gap-12 border-b pb-12 [--radius:1rem] md:grid-cols-2">
            <div>
              <h3 className="text-foreground text-xl font-semibold">Marketing Campaigns</h3>
              <p className="text-muted-foreground my-4 text-lg">
                Effortlessly plan and execute your marketing campaigns organized.
              </p>
              <Card className="aspect-video overflow-hidden px-6">
                <Card className="h-full translate-y-6" />
              </Card>
            </div>
            <div>
              <h3 className="text-foreground text-xl font-semibold">AI Meeting Scheduler</h3>
              <p className="text-muted-foreground my-4 text-lg">
                Effortlessly book and manage your meetings. Stay on top of your schedule.
              </p>
              <Card className="aspect-video overflow-hidden">
                <Card className="translate-6 h-full" />
              </Card>
            </div>
          </div>

          <blockquote className="before:bg-primary relative mt-12 max-w-xl pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full">
            <p className="text-foreground text-lg">
              Wow, auto-generated pages are the kind of thing that you don't even know you need until you see
              it. It's like an AI-native CRM.
            </p>
            <footer className="mt-4 flex items-center gap-2">
              <cite>Méschac Irung</cite>
              <span aria-hidden className="bg-foreground/15 size-1 rounded-full"></span>
              <span className="text-muted-foreground">Creator</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}

```

Copy-paste these files for dependencies:
```tsx
shadcn/card
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```
```tsx
shadcn/toggle-group
"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }

```
```tsx
shadcn/toggle
"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

```
```tsx
shadcn/button
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

Install NPM dependencies:
```bash
class-variance-authority, @radix-ui/react-toggle-group, @radix-ui/react-toggle, @radix-ui/react-slot
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
]

**How It Works** — 3 step visual flow:
Step 1: Wholesaler adds products + prices
Step 2: Retailer browses catalogue and places order
Step 3: Order delivered, invoice auto-generated

**Features split** — Two column layout. Left: Wholesaler features. 
Right: Retailer features. Use icons.

Wholesaler side:
- Manage product catalogue
- Receive orders instantly
- Generate PDF invoices
- Track udhaar/payments
- Analytics dashboard

Retailer side:
- Browse supplier catalogue
- One-tap reorder
- Track order status live
- Record sold-out items
- View credit balance

**Social proof** — Placeholder testimonials from kiryana store owners 
and distributors (make them feel real and local, not generic SaaS)

**CTA footer section** — "Ready to modernize your orders?" with signup buttons

**Navbar** — Logo "Parchai" or add image blank with no link left. Nav links: Features, How it Works, 
Pricing. Right: Login + Get Started button.

---

### PAGE 2 — SIGNUP (/signup)

Clean two-path onboarding:
- Large card: "I am a Wholesaler / Distributor"
- Large card: "I am a Retailer / Shopkeeper"

After selecting role, show a smooth form transition:

Wholesaler form fields:
- Full name, Business name, Phone, City, Email, Password

Retailer form fields:
- Full name, Shop name, Phone, City, Email, Password

On submit → create user in Supabase auth + insert into profiles + 
insert into wholesalers or retailers table accordingly → redirect to 
their dashboard.

---

### PAGE 3 — LOGIN (/login)

Minimal, clean login. Email + Password.
After login, check profile.role → redirect to /wholesaler/dashboard 
or /retailer/dashboard.

---

### PAGE 4 — WHOLESALER DASHBOARD (/wholesaler/dashboard)

Sidebar navigation (left, collapsible on mobile):
- Dashboard
- Products
- Orders
- Retailers
- Invoices
- Analytics
- Settings

Dashboard home shows:
- Stat cards: Total Orders Today, Pending Orders, Total Revenue This Month, 
  Active Retailers
- Recent Orders table: retailer name, items count, total, status badge, 
  time ago
- Quick actions: Add Product, View Pending Orders

---

### PAGE 5 — WHOLESALER PRODUCTS (/wholesaler/products)

Full product management:
- Grid/list toggle view of products
- Each product card: image placeholder, name, category, unit, price, 
  stock qty, active/inactive toggle
- "Add Product" button opens a slide-over panel (not modal) with fields:
  Name, Category (dropdown), Unit (piece/kg/dozen/carton), Price, 
  Stock Quantity, Upload Image, Active toggle
- Search + filter by category
- Edit and delete inline

---

### PAGE 6 — WHOLESALER ORDERS (/wholesaler/orders)

Table view of all incoming orders:
- Columns: Order ID, Retailer Shop, Items, Total, Status, Date, Actions
- Status badges with color: pending (amber), confirmed (blue), 
  dispatched (purple), delivered (green), cancelled (red)
- Click row → order detail slide-over showing all items, quantities, 
  unit prices
- Action buttons per order: Confirm, Mark Dispatched, Mark Delivered
- Supabase Realtime subscription — new orders appear without refresh

---

### PAGE 7 — WHOLESALER RETAILERS (/wholesaler/retailers)

- List of linked retailers with shop name, city, credit limit, 
  outstanding udhaar balance, status
- "Add Retailer" — search by phone number, send link request
- Toggle retailer status active/blocked
- Click retailer → see their full order history and udhaar ledger

---

### PAGE 8 — RETAILER DASHBOARD (/retailer/dashboard)

Sidebar: Dashboard, My Suppliers, Orders, Stock Tracker, Udhaar, 
Analytics, Settings

Dashboard shows:
- My balance (total udhaar across all suppliers) — prominent card
- Active orders with live status
- Low stock / sold out items needing reorder
- Quick order button

---

### PAGE 9 — RETAILER BROWSE SUPPLIER (/retailer/suppliers/[id])

- Product catalogue grid from that wholesaler
- Each card: product image, name, unit, price
- Quantity selector directly on the card (+/-)
- Sticky bottom bar: "X items · Total: PKR XXXX → Place Order" appears 
  when any item is selected
- Search and category filter
- "Out of stock" items shown grayed out

---

### PAGE 10 — RETAILER ORDERS (/retailer/orders)

- Order cards with status timeline:
  Placed → Confirmed → Dispatched → Delivered
  Visual progress bar or step indicator per order
- Each order expandable to see items
- Realtime status updates via Supabase subscription

---

### PAGE 11 — RETAILER STOCK TRACKER (/retailer/stock)

- Simple, fast interface to log sold-out items
- Search existing products from linked suppliers → mark as sold out
- OR add custom item name if not in system
- List of marked items with "Order Now" shortcut that pre-fills the order
- Toggle: mark as restocked

---

### PAGE 12 — UDHAAR LEDGER (/wholesaler/invoices + /retailer/udhaar)

For wholesaler: per-retailer udhaar summary, record payment received
For retailer: per-supplier balance, full transaction history

Ledger rows: date, description, amount, type (credit/payment), 
running balance. Color coded: red for owed, green for payment received.

---

## DESIGN DIRECTION

**Aesthetic:** Clean, trustworthy, professional. Like a modern fintech 
app but warm enough for a small shop owner. Not startup-flashy. 
Think Notion meets a Pakistani bank app.

**Colors:**
- Primary: Deep teal #0F766E (trust, business)
- Accent: Amber #F59E0B (action, highlight, Pakistani warmth)
- Neutral: Slate grays
- Success: Emerald
- Error: Rose

**Typography:**
- Headings: Sora or Plus Jakarta Sans (modern, clean)
- Body: Inter
- Numbers/prices: Tabular nums, always show PKR prefix

**Components style:**
- Cards with subtle shadows, 12px radius
- Sidebar: 240px wide, icons + labels, active state with teal bg
- Tables: clean, alternating subtle row shading
- Badges: pill shaped, color coded
- Buttons: Primary teal, Secondary outlined, Danger rose
- Slide-over panels for create/edit (not modals — they disrupt flow)
- Toast notifications for all actions
- Empty states: illustrated placeholder with clear CTA

**Mobile:**
- Bottom navigation bar on mobile for both portals (5 key tabs)
- Sidebar collapses to hamburger
- Product cards stack to single column
- Sticky order bar on catalogue page

---

## UX RULES (non-negotiable)

1. Every action gives immediate feedback (loading state → success toast)
2. Empty states always show what to do next — never a blank screen
3. Destructive actions (delete, block) require confirmation
4. Forms validate inline, not on submit only
5. Numbers always formatted with commas: 1,250 not 1250
6. Prices always show PKR prefix
7. Dates show relative time for recent (2 hours ago) and full date 
   for older
8. Status changes are instant optimistic updates

---

## CODE REQUIREMENTS

- Use Next.js App Router file structure
- Supabase client in lib/supabase/client.js and lib/supabase/server.js
- Auth middleware.js protecting /wholesaler/* and /retailer/* routes
- Role check: after login read profiles.role and redirect accordingly
- All Supabase queries use typed responses where possible
- Realtime subscriptions in useEffect with proper cleanup
- Use server components where data is static, client where interactive
- Zustand store for cart state on the browse catalogue page

---

Build all pages with realistic placeholder data so the UI is fully 
demonstrable. Make it feel like a real working product.