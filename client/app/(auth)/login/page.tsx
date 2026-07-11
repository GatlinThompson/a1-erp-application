import Input from "@/components/forms/input";
import Button from "@/components/ui/button";
import CardContainer from "@/components/ui/card-container";
import AuthForm from "@/features/auth/auth-form";
import React from "react";
import Image from "next/image";
import MainLogo from "@/public/assets/main-logo.png";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center w-full max-w-31 max-h-31">
        <Image
          src={MainLogo}
          alt="A1 ERP Logo"
          width={124}
          height={124}
          className="w-full h-full max-w-31 max-h-31"
        />
      </div>
      <div className="text-center flex flex-col items-center gap-1">
        <h1 className="font-bold text-2xl">Welcome Back</h1>
        <h2 className="font-light text-xl -mt-3">Sign into your A1 account</h2>
      </div>
      <CardContainer>
        <div className="w-full px-3 py-8 flex flex-col items-center justify-center">
          <AuthForm />
        </div>
      </CardContainer>
    </div>
  );
}
