import Link from "next/link";
import React from "react";

export default function ProductsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">Product Overview</h1>
      <div className="flex flex-row justify-between mt-4">
        <span className="text-md flex-1">
          Manage and view all products and related job information.
        </span>
      </div>
      <table className="w-full mt-4 border border-gray-900 table-fixed">
        <thead>
          <tr className="text-left">
            <th className="border border-gray-900 p-2 w-4/9">SKU</th>
            <th className="border border-gray-900 p-2">Type</th>
            <th className="border border-gray-900 p-2">Price</th>
            <th className="border border-gray-900 p-2">Unit Price</th>
            <th className="border border-gray-900 p-2">Quantity</th>
            <th className="border border-gray-900 p-2">Allocated</th>
            <th className="border border-gray-900 p-2">Location</th>
            <th className="border border-gray-900 p-2">Jobs</th>
            <th className="border border-gray-900 p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-900 p-2 ">
              <div className="flex gap-3 items-center">
                <div className="min-w-6 min-h-6 max-h-6 max-w-6 bg-gray-200 "></div>
                <div className="flex  flex-col gap-0.5">
                  <Link
                    href="#"
                    className="font-bold text-lg hover:text-secondary transition-all duration-150"
                  >
                    SKU12345
                  </Link>
                  <span className="text-sm text-gray-600">
                    Description of the sample product. Long description that
                    might wrap onto multiple lines to test the layout and ensure
                    that it looks good even with more text.
                  </span>
                </div>
              </div>
            </td>
            <td className="border border-gray-900 p-2 text-md">KIT</td>
            <td className="border border-gray-900 p-2 text-md">$100</td>
            <td className="border border-gray-900 p-2 text-md">50</td>
            <td className="border border-gray-900 p-2 text-md">20</td>
            <td className="border border-gray-900 p-2 text-md">5</td>
            <td className="border border-gray-900 p-2 text-md">Warehouse 1</td>
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
        </tbody>
      </table>
    </>
  );
}
