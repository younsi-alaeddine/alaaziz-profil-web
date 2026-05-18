import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "z-cdn-media.chatglm.cn" },
    ],
  },
};

export default nextConfig;
