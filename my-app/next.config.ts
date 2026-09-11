import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        root: __dirname,
    },

    async rewrites() {
        return [
            {
                source: "/api/uploads/:path*",
                destination:
                    "https://projeto-imobiliaria-api.onrender.com/uploads/:path*",
            },
            {
                source: "/api/:path*",
                destination:
                    "https://projeto-imobiliaria-api.onrender.com/:path*",
            },
        ];
    },
};

export default nextConfig;