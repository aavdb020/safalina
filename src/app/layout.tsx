import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safalina — Feel good, every day",
  description: "Ontdek zorgvuldig geselecteerde essentials voor jouw dagelijkse wellness- en beautyroutine.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://safalina.vercel.app"),
  openGraph: {
    title: "Safalina — Feel good, every day",
    description: "Een bewustere routine begint hier.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
