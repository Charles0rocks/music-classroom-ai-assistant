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
  async rewrites() {
    return [
      { source: '/', destination: '/stock.html' },
      { source: '/schedule', destination: '/teacher/schedule' },
      { source: '/lesson-record', destination: '/teacher/recorder' },
      { source: '/demos', destination: '/teacher/demos' },
      { source: '/student-view', destination: '/student-view.html' },
      { source: '/stock', destination: '/stock.html' },
    ];
  },
};

export default nextConfig;
