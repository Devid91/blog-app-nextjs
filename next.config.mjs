/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: "standalone",
  //enabled Hot Reload in Docker
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  webpack: (config, _) => ({
    ...config,
    watchOptions: {
      ...config.watchOptions,
      poll: 150,
      aggregateTimeout: 50,
    },
  }),
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
