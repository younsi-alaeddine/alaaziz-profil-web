import type { NextConfig } from "next";
import { LEGACY_SECTION_PATHS } from "./src/lib/sections";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "z-cdn-media.chatglm.cn" },
    ],
  },
  async redirects() {
    return LEGACY_SECTION_PATHS.map((path) => ({
      source: `/${path}`,
      destination: `/#${path}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
