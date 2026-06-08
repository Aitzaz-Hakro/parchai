"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Store, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FieldErrors = Record<string, string>;

export function SignupForm() {
  const router = useRouter();
  const [role, setRole] = React.useState<Role | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldErrors>({});

  const [form, setForm] = React.useState({
    full_name: "",
    business_name: "",
    shop_name: "",
    phone: "",
    city: "",
    email: "",
    password: "",
  });

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => ({ ...er, [key]: "" }));
    };

  function validate(): boolean {
    const e: FieldErrors = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (role === "wholesaler" && !form.business_name.trim())
      e.business_name = "Business name is required";
    if (role === "retailer" && !form.shop_name.trim())
      e.shop_name = "Shop name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!role || !validate()) return;

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          role,
          full_name: form.full_name,
          phone: form.phone,
          city: form.city,
          business_name: role === "wholesaler" ? form.business_name : undefined,
          shop_name: role === "retailer" ? form.shop_name : undefined,
        },
      },
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    const dashboard =
      role === "wholesaler" ? "/wholesaler/dashboard" : "/retailer/dashboard";

    if (data.session) {
      toast.success("Account created. Welcome to Parchai!");
      router.push(dashboard);
      router.refresh();
      return;
    }

    // Email confirmation is enabled — no session yet.
    setLoading(false);
    toast.success(
      "Account created. Please check your email to confirm, then log in.",
    );
    router.push("/login");
  }

  if (!role) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">
            Create your account
          </CardTitle>
          <CardDescription>
            First, tell us how you use Parchai.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <RoleCard
            icon={Store}
            title="I am a Wholesaler / Distributor"
            description="I supply products and receive orders from shops."
            onClick={() => setRole("wholesaler")}
          />
          <RoleCard
            icon={ShoppingCart}
            title="I am a Retailer / Shopkeeper"
            description="I order stock from my suppliers."
            tone="accent"
            onClick={() => setRole("retailer")}
          />
          <p className="pt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  const isWholesaler = role === "wholesaler";

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <button
          type="button"
          onClick={() => setRole(null)}
          className="mb-1 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <CardTitle className="font-heading text-2xl">
          {isWholesaler ? "Wholesaler sign up" : "Retailer sign up"}
        </CardTitle>
        <CardDescription>
          {isWholesaler
            ? "Set up your distribution business."
            : "Set up your shop to start ordering."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field
            id="full_name"
            label="Full name"
            value={form.full_name}
            onChange={update("full_name")}
            error={errors.full_name}
            placeholder="Muhammad Ali"
          />
          {isWholesaler ? (
            <Field
              id="business_name"
              label="Business name"
              value={form.business_name}
              onChange={update("business_name")}
              error={errors.business_name}
              placeholder="Ali Distributors"
            />
          ) : (
            <Field
              id="shop_name"
              label="Shop name"
              value={form.shop_name}
              onChange={update("shop_name")}
              error={errors.shop_name}
              placeholder="Ali Kiryana Store"
            />
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field
              id="phone"
              label="Phone"
              value={form.phone}
              onChange={update("phone")}
              error={errors.phone}
              placeholder="03001234567"
              inputMode="tel"
            />
            <Field
              id="city"
              label="City"
              value={form.city}
              onChange={update("city")}
              error={errors.city}
              placeholder="Lahore"
            />
          </div>
          <Field
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Field
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
            placeholder="At least 6 characters"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RoleCard({
  icon: Icon,
  title,
  description,
  tone = "primary",
  onClick,
}: {
  icon: typeof Store;
  title: string;
  description: string;
  tone?: "primary" | "accent";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-sm"
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          tone === "primary"
            ? "bg-primary/10 text-primary"
            : "bg-accent/15 text-accent-foreground",
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <span>
        <span className="block font-semibold text-foreground">{title}</span>
        <span className="block text-sm text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  );
}

function Field({
  id,
  label,
  error,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
} & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        className={cn(error && "border-destructive focus-visible:ring-destructive")}
        {...props}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
