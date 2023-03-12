import '../styles/globals.css'
import cx from "classnames";
import localFont from "@next/font/local";

const clash = localFont({
  src: "../styles/ClashDisplay-Semibold.otf",
  variable: "--font-clash",
});

function MyApp({ Component, pageProps }) {
  return <main className={cx(clash.variable)}>
    <Component {...pageProps} />
  </main>
}

export default MyApp
