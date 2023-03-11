import '../styles/globals.css'
import cx from "classnames";
import localFont from "@next/font/local";
import { Inter } from "@next/font/google";

const clash = localFont({
  src: "../styles/ClashDisplay-Semibold.otf",
  variable: "--font-clash",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
function MyApp({ Component, pageProps }) {
  return <main className={cx(clash.variable, inter.variable)}>
    <Component {...pageProps} />
  </main>
}

export default MyApp
