import React from "react";

type ProductRowIconProps = {
  quantity: number;
  reorderPoint: number;
};

export default function ProductRowIcon({
  quantity,
  reorderPoint,
}: ProductRowIconProps) {
  return <div className="min-w-6 min-h-6 max-h-6 max-w-6 "></div>;
}
