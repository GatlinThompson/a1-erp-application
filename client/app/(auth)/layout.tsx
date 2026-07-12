import AuthMessage from "@/features/auth/auth-message";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-1  flex-col items-center justify-center bg-secondary-background ">
        {children}
      </div>
    </>
  );
}
