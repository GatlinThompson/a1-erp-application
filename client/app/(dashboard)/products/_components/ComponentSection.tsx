"use client";

export const PRODUCT_TYPES = [
  "HARDWARE",
  "PART",
  "KIT",
  "SHIPPING_KIT",
  "MATERIAL",
  "HARDWARE_KIT",
] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export type ProductSummary = {
  id: number;
  sku: string;
  name: string | null;
  type: ProductType;
};

export type ComponentRow = {
  mode: "existing" | "new";
  existingId: string;
  sku: string;
  name: string;
  price: string;
  quantity: string;
};

export function emptyRow(): ComponentRow {
  return { mode: "existing", existingId: "", sku: "", name: "", price: "", quantity: "1" };
}

// Returns the payload form of the given rows, or `undefined` if there are
// none (used when omitting the key entirely should mean "leave untouched",
// e.g. on create, or when an edit form explicitly wants that distinction).
export function buildComponentPayload(rows: ComponentRow[]) {
  const entries = rows
    .filter((row) => (row.mode === "existing" ? row.existingId !== "" : row.sku.trim() !== ""))
    .map((row) => {
      const quantity = Number(row.quantity) || 1;
      if (row.mode === "existing") {
        return { id: Number(row.existingId), quantity };
      }
      return {
        sku: row.sku.trim(),
        name: row.name.trim() || undefined,
        price: row.price === "" ? undefined : Number(row.price),
        quantity,
      };
    });
  return entries.length ? entries : undefined;
}

export function ComponentSection({
  title,
  rows,
  products,
  onChange,
}: {
  title: string;
  rows: ComponentRow[];
  products: ProductSummary[];
  onChange: (rows: ComponentRow[]) => void;
}) {
  const updateRow = (index: number, patch: Partial<ComponentRow>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };
  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
      <legend className="px-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{title}</legend>
      {rows.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">None added.</p>
      )}
      {rows.map((row, index) => (
        <div
          key={index}
          className="flex flex-wrap items-end gap-2 rounded-md bg-zinc-50 p-3 dark:bg-zinc-900"
        >
          <label className="flex flex-col text-xs text-zinc-600 dark:text-zinc-400">
            Mode
            <select
              className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-black"
              value={row.mode}
              onChange={(e) =>
                updateRow(index, { mode: e.target.value as ComponentRow["mode"] })
              }
            >
              <option value="existing">Existing product</option>
              <option value="new">Create new</option>
            </select>
          </label>

          {row.mode === "existing" ? (
            <label className="flex flex-col text-xs text-zinc-600 dark:text-zinc-400">
              Product
              <select
                className="min-w-[220px] rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-black"
                value={row.existingId}
                onChange={(e) => updateRow(index, { existingId: e.target.value })}
              >
                <option value="">Select a product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} ({p.type}) #{p.id}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <>
              <label className="flex flex-col text-xs text-zinc-600 dark:text-zinc-400">
                New sku
                <input
                  className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-black"
                  value={row.sku}
                  onChange={(e) => updateRow(index, { sku: e.target.value })}
                  placeholder="SKU-123"
                />
              </label>
              <label className="flex flex-col text-xs text-zinc-600 dark:text-zinc-400">
                Name (optional)
                <input
                  className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-black"
                  value={row.name}
                  onChange={(e) => updateRow(index, { name: e.target.value })}
                />
              </label>
              <label className="flex flex-col text-xs text-zinc-600 dark:text-zinc-400">
                Price (optional)
                <input
                  type="number"
                  step="0.01"
                  className="w-24 rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-black"
                  value={row.price}
                  onChange={(e) => updateRow(index, { price: e.target.value })}
                />
              </label>
            </>
          )}

          <label className="flex flex-col text-xs text-zinc-600 dark:text-zinc-400">
            Quantity
            <input
              type="number"
              min={1}
              className="w-20 rounded border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-black"
              value={row.quantity}
              onChange={(e) => updateRow(index, { quantity: e.target.value })}
            />
          </label>

          <button
            type="button"
            onClick={() => removeRow(index)}
            className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, emptyRow()])}
        className="self-start rounded border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        + Add {title.toLowerCase()}
      </button>
    </fieldset>
  );
}
