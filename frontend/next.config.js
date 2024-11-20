/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    async rewrites() {
        return [
            {
                source: "/.well-known/:path*",
                destination: "/public/.well-known/:path*",
            },
        ];
    },
    reactStrictMode: false,
    webpack: (config, options) => {
        if (options.isServer) {
            return config;
        }

        config.resolve.fallback.fs = false;
        return config;
    },
    images: {
        domains: [
            "localhost",
            "via.placeholder.com",
            "onfireathletes-media-uploads.s3.amazonaws.com",
        ],
    },
};

module.exports = nextConfig;
