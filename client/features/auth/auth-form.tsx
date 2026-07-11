"use client";

import Input from "@/components/forms/input";
import Button from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { loginSchema, LoginFormValues } from "@/schemas/auth.schema";

//Fix with auth comes in, replace testUser with actual auth logic
const testUser = {
  username: "admin",
  password: "password",
};

export default function AuthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    // Handle form submission logic here
    console.log(data);
  };

  return (
    <form
      className="flex flex-col gap-4 min-w-75 md:min-w-85 mb-4 mx-3"
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
        <Button type="submit">Sign In</Button>
      </div>
    </form>
  );
}
