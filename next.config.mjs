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
      { source: '/', destination: '/index.html' },
      { source: '/stock-review', destination: '/stock-review.html' },
      { source: '/stock', destination: '/stock-review.html' },
      { source: '/schedule', destination: '/teacher/schedule' },
      { source: '/lesson-record', destination: '/teacher/recorder' },
      { source: '/demos', destination: '/teacher/demos' },
      { source: '/student-view', destination: '/student-view.html' },
    ];
  },
};

export default nextConfig;
