/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	webpack: (config, options) => {
		if (options.isServer) {
			return config;
		}

		config.resolve.fallback.fs = false;
		return config;

	},
	images: {
		domains: [ "localhost", "via.placeholder.com", "gamechangers-media-uploads.s3.amazonaws.com" ],
	},
};

module.exports = nextConfig;
