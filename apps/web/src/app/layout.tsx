import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CLOSE — AI Finance Controller",
  description: "Reconcile the books. Explain the exceptions. Know your cash position.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
