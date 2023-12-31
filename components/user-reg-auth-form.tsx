"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const [isChromeLoading, setIsChromeLoading] = React.useState<boolean>(false);

  const searchParams = useSearchParams();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const signInResult = await signIn("email", {
      email: data.email.toLowerCase(),
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/",
    });

    setIsLoading(false);

    if (!signInResult?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }

    return toast({
      title: "Check your email",
      description: "We sent you a login link. Be sure to check your spam too.",
    });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              className="h-[65px] bg-[#d9d9d9]"
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            className={cn(buttonVariants({ variant: "default_dark" }))}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
          </button>
        </div>
      </form>
      <p className="px-1 text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="hover:text-brand underline underline-offset-4"
        >
          Already have an account? Log in.
        </Link>
      </p>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            SIGN UP WITH
          </span>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          type="button"
          className={cn(buttonVariants({ variant: "ghost_no_hover" }))}
          onClick={() => {
            setIsGitHubLoading(true);
            signIn("github");
          }}
          disabled={isLoading || isGitHubLoading}
        >
          {isGitHubLoading ? (
            <Icons.spinner className="mr-2 h-[61px] w-[61px] animate-spin" />
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-[5px]">
                    <Icons.gitHub className="mr-2 h-[61px] w-[61px]" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign Up with GitHub.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}{" "}
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "ghost_no_hover" }))}
          onClick={() => {
            setIsChromeLoading(true);
            signIn("google");
          }}
          disabled={isLoading || isGitHubLoading || isChromeLoading}
        >
          {isChromeLoading ? (
            <Icons.spinner className="mr-2 h-[61px] w-[61px] animate-spin" />
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-[5px]">
                    <Icons.chrome className="mr-2 h-[61px] w-[61px]" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sign Up with Google.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}{" "}
        </button>
      </div>
    </div>
  );
}
