import "./globals.css";
import { Outfit, Raleway } from "next/font/google";
import { cn } from "@/lib/utils";

const ralewayHeading = Raleway({
  subsets: ["latin"],
  variable: "--font-heading",
});

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        outfit.variable,
        ralewayHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
