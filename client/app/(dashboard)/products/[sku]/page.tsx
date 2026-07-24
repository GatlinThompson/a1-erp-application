export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  return (
    <div>
      <h1>Product Page</h1>
      <p>SKU: {sku}</p>
    </div>
  );
}
