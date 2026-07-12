type AuthMessageProps = {
  errorMessage: string;
  type?: "error" | "success" | "warning";
};

export default function AuthMessage({
  errorMessage,
  type = "error",
}: AuthMessageProps) {
  const typeStyles =
    type === "error"
      ? "bg-red-400/70 border-red-400 text-black"
      : type === "success"
        ? "bg-green-400/70 border-green-600 text-black"
        : "bg-yellow-200/30 border-yellow-200 text-black";

  return (
    <div className="text-center bg-secondary-background pt-3 absolute top-5 md:top-10 w-full flex justify-center">
      <div
        className={`font-medium text-sm mx-5 rounded-xl py-2 w-full max-w-175 border-2 ${typeStyles}`}
      >
        <span className="font-semibold"></span> {errorMessage}
      </div>
    </div>
  );
}
