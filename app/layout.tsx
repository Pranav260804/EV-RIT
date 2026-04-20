import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import FloatingProfile from "../components/FloatingProfile";

export const metadata: Metadata = {
  title: "EV-RIT | OS for EV Ecosystem",
  description: "Real-time mineral intelligence, nationwide infrastructure mapping, and predictive battery analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased selection:bg-blue-500/30 overflow-x-hidden">
        <AuthProvider>
          <FloatingProfile />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
