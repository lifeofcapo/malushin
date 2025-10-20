import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata = {
  title: "Malushin - Secret Recipes",
  description: "Discover unique flavors and the best recipes for every occasion. Malushin's secret recipes for soups, main dishes, desserts, and salads.",
  keywords: "recipes, cooking, food, malushin, soups, main dishes, desserts, salads",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}