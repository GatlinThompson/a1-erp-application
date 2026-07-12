import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false, // Use false (307) so browsers don't cache it forever
      },
    ];
  },
};

export default nextConfig;
