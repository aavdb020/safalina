import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safalina — Feel good, every day",
  description: "Ontdek zorgvuldig geselecteerde essentials voor jouw dagelijkse wellness- en beautyroutine.",
  metadataBase: new URL("https://safalina.nl"),
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
