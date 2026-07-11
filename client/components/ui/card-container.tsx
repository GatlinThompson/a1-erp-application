import React from "react";

type CardContainerComponents = {
  children: React.ReactNode;
};

export default function CardContainer({ children }: CardContainerComponents) {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-custom-3xl">
      {children}
    </div>
  );
}
