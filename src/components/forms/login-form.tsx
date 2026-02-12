"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { type LoginInput, loginSchema } from "@/lib/validations/auth";

export function LoginForm({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    setIsPending(true);

    const result = await signIn("credentials", {
      ...values,
      callbackUrl,
      redirect: false,
    });

    setIsPending(false);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Check your email and password and try again.",
      });
      return;
    }

    toast({
      title: "Welcome back",
      description: "Redirecting to your dashboard.",
    });

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <Card className="border-slate-800 bg-slate-900/90">
      <CardHeader>
        <CardTitle className="text-white">Portal Login</CardTitle>
        <CardDescription>
          Use the seeded demo credentials or your registered account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@swaelco.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-500" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-4 text-center text-sm text-slate-300">
          Need an account?{" "}
          <Link href="/register" className="text-blue-300 hover:text-blue-200">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
