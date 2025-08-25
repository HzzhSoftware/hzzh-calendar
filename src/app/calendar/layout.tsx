import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calender - Book your meetings",
  description: "Calender is a simple way to schedule meetings with your clients",
  icons: {
    icon: `${process.env.NEXT_PUBLIC_CDN_URL}/favicon.ico`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
