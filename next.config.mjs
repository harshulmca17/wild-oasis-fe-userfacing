/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uigefxazpnajqleuqgfu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
    domains: ["uigefxazpnajqleuqgfu.supabase.co"],
  },
};

export default nextConfig;
