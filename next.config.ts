import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/guvenlik', destination: '/gizlilik', permanent: true }];
  },
};

export default nextConfig;
