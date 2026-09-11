/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/stock',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/schedule', destination: '/teacher/schedule' },
      { source: '/lesson-record', destination: '/teacher/recorder' },
      { source: '/demos', destination: '/teacher/demos' },
      { source: '/student-view', destination: '/student-view.html' },
      { source: '/stock', destination: '/stock.html' },
    ];
  },
};

export default nextConfig;
