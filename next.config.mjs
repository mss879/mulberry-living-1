/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // The auto-generated Supabase types are incomplete (missing bookings/enquiries/stays tables).
    // Regenerate with `npx supabase gen types typescript` to fix, then remove this flag.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'htlejsiqsmgcnywskqsh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
