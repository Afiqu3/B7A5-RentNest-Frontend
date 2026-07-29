import "./globals.css";
import { Outfit, Raleway } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

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
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        outfit.variable,
        ralewayHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-1 flex-col">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
