/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          monaco: {
            test: /[\\/]node_modules[\\/](@monaco-editor)[\\/]/,
            name: 'monaco',
            priority: 30,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
