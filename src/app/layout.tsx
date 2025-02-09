
import "./globals.css";
import { Navbar1 } from "@/components/navbar"; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Navbar1 />
        {children}
      </body>
    </html>
  );
}
