/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@splinetool/react-spline'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                pathname: '/7.x/**',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me',
                pathname: '/api/portraits/**',
            },
        ],
    },
};

export default nextConfig;
