import Link from "next/link";
import ProductRowIcon from "./product-row-icon";

type ProductRowProps = {
  product: {
    sku: string;
    description?: string;
    name?: string;
    type: string;
    price: number;
    unitPrice?: number;
    quantity_on_hand: number;
    allocated_quantity?: number;
    location: string;
    reorder_point: number;
  };
};

export default function ProductRow({ product }: ProductRowProps) {
  return (
    <tr>
      <td className="border border-gray-900 p-2 ">
        <div className="flex gap-3 items-center">
          <ProductRowIcon
            quantity={product.quantity_on_hand}
            reorderPoint={product.reorder_point}
          />
          <div className="flex  flex-col gap-0.5">
            <Link
              href="/products/[sku]"
              as={`/products/${product.sku}`}
              className="font-bold text-lg hover:text-secondary transition-all duration-150"
            >
              {product.sku}
            </Link>
            <span className="text-sm text-gray-600">
              {product.description || product.name}
            </span>
          </div>
        </div>
      </td>
      <td className="border border-gray-900 p-2 text-md">{product.type}</td>
      <td className="border border-gray-900 p-2 text-md">${product.price}</td>
      <td className="border border-gray-900 p-2 text-md">
        {product.unitPrice ? `$${product.unitPrice}` : "N/A"}
      </td>
      <td className="border border-gray-900 p-2 text-md">
        {product.quantity_on_hand}
      </td>
      <td className="border border-gray-900 p-2 text-md">
        {product.allocated_quantity ? product.allocated_quantity : 0}
      </td>
      <td className="border border-gray-900 p-2 text-md">{product.location}</td>
      <td className="border border-gray-900 p-2 text-md">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          View Jobs
        </button>
      </td>
      <td className="border border-gray-900 p-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          View Details
        </button>
      </td>
    </tr>
  );
}
