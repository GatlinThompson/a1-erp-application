"use client";

import { use, useEffect, useState } from "react";
import {
  ComponentSection,
  buildComponentPayload,
  PRODUCT_TYPES,
  type ComponentRow,
  type ProductSummary,
  type ProductType,
} from "../../_components/ComponentSection";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

type ComponentLink = {
  quantity: number;
  part?: { id: number; sku: string; name: string | null };
  hardware?: { id: number; sku: string; name: string | null };
  kit?: { id: number; sku: string; name: string | null };
};

type Product = {
  id: number;
  sku: string;
  name: string | null;
  price: number;
  type: ProductType;
  quantity_on_hand: number;
  reorder_point: number;
  parts: ComponentLink[];
  hardwares: ComponentLink[];
  hardware_kits: ComponentLink[];
};

function linksToRows(rows: ComponentLink[], field: "part" | "hardware" | "kit"): ComponentRow[] {
  return rows.map((row) => ({
    mode: "existing",
    existingId: String(row[field]?.id ?? ""),
    sku: "",
    name: "",
    price: "",
    quantity: String(row.quantity),
  }));
}

export default function EditProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku: skuParam } = use(params);

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loadedSku, setLoadedSku] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  };

  const loadProduct = async (targetSku: string) => {
    setLoading(true);
    setLoadError(null);
    setStatus(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/products/${encodeURIComponent(targetSku)}`);
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data?.error ?? `Request failed with status ${res.status}`);
        return;
      }
      const p = data as Product;
      setLoadedSku(p.sku);
      setSku(p.sku);
      setName(p.name ?? "");
      setType(p.type);
      setPrice(String(p.price));
      setQuantityOnHand(String(p.quantity_on_hand));
      setReorderPoint(String(p.reorder_point));
      setParts(linksToRows(p.parts, "part"));
      setHardwares(linksToRows(p.hardwares, "hardware"));
      setHardwareKits(linksToRows(p.hardware_kits, "kit"));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadProduct(decodeURIComponent(skuParam));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skuParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadedSku) return;
    setSubmitting(true);
    setStatus(null);
    setResult(null);

    // Always send parts/hardwares/hardwareKits (even as []) — the edit form
    // shows the complete desired state, so an empty list means "remove all",
    // not "leave untouched".
    const payload = {
      sku,
      name: name.trim() || undefined,
      type,
      price: Number(price),
      quantity_on_hand: quantityOnHand === "" ? undefined : Number(quantityOnHand),
      reorder_point: reorderPoint === "" ? undefined : Number(reorderPoint),
      parts: buildComponentPayload(parts) ?? [],
      hardwares: buildComponentPayload(hardwares) ?? [],
      hardwareKits: buildComponentPayload(hardwareKits) ?? [],
    };

    try {
      const res = await fetch(`${API_URL}/products/${encodeURIComponent(loadedSku)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setStatus(res.status);
      setResult(data);
      if (res.ok && data?.product) {
        const p = data.product as Product;
        setLoadedSku(p.sku);
        setParts(linksToRows(p.parts, "part"));
        setHardwares(linksToRows(p.hardwares, "hardware"));
        setHardwareKits(linksToRows(p.hardware_kits, "kit"));
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
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Updates <code>{API_URL}/products/{skuParam}</code>. Saving replaces each of parts/
        hardware/hardware kits with exactly what&apos;s shown below — add, edit quantities, or
        remove rows, then save.
      </p>

      {loading && <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>}
      {loadError && <p className="text-sm text-red-600">{loadError}</p>}

      {!loading && !loadError && loadedSku && (
        <>
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
              {submitting ? "Saving..." : "Save changes"}
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
        </>
      )}
    </div>
  );
}
