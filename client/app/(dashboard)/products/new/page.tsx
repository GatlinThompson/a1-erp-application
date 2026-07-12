"use client";

import { useEffect, useState } from "react";
import {
  ComponentSection,
  buildComponentPayload,
  PRODUCT_TYPES,
  type ComponentRow,
  type ProductSummary,
  type ProductType,
} from "../_components/ComponentSection";
import { API_URL, apiFetch } from "@/lib/api";

export default function NewProductPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<ProductType>("KIT");
  const [price, setPrice] = useState("");
  const [quantityOnHand, setQuantityOnHand] = useState("");
  const [reorderPoint, setReorderPoint] = useState("");
  const [parts, setParts] = useState<ComponentRow[]>([]);
  const [hardwares, setHardwares] = useState<ComponentRow[]>([]);
  const [hardwareKits, setHardwareKits] = useState<ComponentRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [result, setResult] = useState<unknown>(null);

  const loadProducts = () => {
    apiFetch("/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    setResult(null);

    const payload = {
      sku,
      name: name.trim() || undefined,
      type,
      price: Number(price),
      quantity_on_hand: quantityOnHand === "" ? undefined : Number(quantityOnHand),
      reorder_point: reorderPoint === "" ? undefined : Number(reorderPoint),
      parts: buildComponentPayload(parts),
      hardwares: buildComponentPayload(hardwares),
      hardwareKits: buildComponentPayload(hardwareKits),
    };

    try {
      const res = await apiFetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setStatus(res.status);
      setResult(data);
      if (res.ok) {
        loadProducts();
      }
    } catch (err) {
      setStatus(0);
      setResult({ error: err instanceof Error ? err.message : "Request failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold">Create Product</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Posts to <code>{API_URL}/products</code>. Components can reference an existing
        product or create a new one on the fly.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Sku *
            <input
              required
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-black"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Name
            <input
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Type *
            <select
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-black"
              value={type}
              onChange={(e) => setType(e.target.value as ProductType)}
            >
              {PRODUCT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Price *
            <input
              required
              type="number"
              step="0.01"
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-black"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Quantity on hand
            <input
              type="number"
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-black"
              value={quantityOnHand}
              onChange={(e) => setQuantityOnHand(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Reorder point
            <input
              type="number"
              className="rounded border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-black"
              value={reorderPoint}
              onChange={(e) => setReorderPoint(e.target.value)}
            />
          </label>
        </div>

        <ComponentSection title="Parts" rows={parts} products={products} onChange={setParts} />
        <ComponentSection
          title="Hardware"
          rows={hardwares}
          products={products}
          onChange={setHardwares}
        />
        <ComponentSection
          title="Hardware kits"
          rows={hardwareKits}
          products={products}
          onChange={setHardwareKits}
        />

        <button
          type="submit"
          disabled={submitting}
          className="self-start rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {submitting ? "Creating..." : "Create product"}
        </button>
      </form>

      {status !== null && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            Response status:{" "}
            <span className={status >= 200 && status < 300 ? "text-green-600" : "text-red-600"}>
              {status}
            </span>
          </p>
          <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-4 text-xs dark:bg-zinc-900">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
