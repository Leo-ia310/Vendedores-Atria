import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Academia Comercial ATRIA — Conviértete en asesor certificado",
    template: "%s · Academia Comercial ATRIA",
  },
  description:
    "Aprende desde cero a vender ATRIA de forma profesional: prospección, demostración, manejo de objeciones y cierre. Capacitación gratuita, certificación y comisiones recurrentes.",
  metadataBase: new URL("https://academia.atria.app"),
  openGraph: {
    title: "Academia Comercial ATRIA",
    description:
      "Conviértete en asesor comercial certificado de ATRIA. Capacitación gratuita, certificación y comisiones.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
