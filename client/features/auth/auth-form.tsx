"use client";

import Input from "@/components/forms/input";
import Button from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { loginSchema, LoginFormValues } from "@/schemas/auth.schema";
import AuthMessage from "./auth-message";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AuthForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = (data: LoginFormValues) => {
    setLoading(true);
    apiFetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          setServerError(result.error);
        } else {
          console.log(result);
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setServerError("An unexpected error occurred");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {serverError && <AuthMessage errorMessage={serverError} />}
      <form
        className="flex flex-col gap-4 min-w-75 md:min-w-85 mb-4 mx-3  pt-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="Username"
          type="text"
          placeholder="Enter your username"
          error={errors.username?.message}
          {...register("username")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="pt-6">
          <Button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </>
  );
}
