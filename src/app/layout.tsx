import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday! 🎂",
  description: "A special birthday celebration — pop the balloons!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        {children}
      </body>
    </html>
  );
}
