/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vrqwhciakhwnwgwqrtnx.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'https://vrqwhciakhwnwgwqrtnx.supabase.co/storage/v1/object/public/media/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
