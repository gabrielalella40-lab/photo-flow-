import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Photo Flow",
  description: "AI photo editing for photographers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}