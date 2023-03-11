import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Layout({ children }) {
    const threshold = 50;
    const [scrolled, setScrolled] = useState(false);
    const onScroll = useCallback(() => {
        setScrolled(window.pageYOffset > threshold);
    }, [threshold]);
    const DOMAIN = "http://localhost:3000"
    const title = "SubtitleAI - Generate Subtitles for Videos"
    const description = "Effortlessly add subtitles to your video with our AI-powered SRT file generator. Our website simplifies the process of creating subtitles, making it easy to enhance the accessibility and reach of your video content."
    const image = `${DOMAIN}/api/og`
    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [onScroll]);

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta itemProp="image" content={image} />
                <meta property="og:logo" content={`${DOMAIN}/logo.png`}></meta>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={image} />


            </Head>
            <div className="fixed h-full w-full bg-gradient-to-br from-emerald-100 via-blue-50 to-rose-200" />
            <div
                className={`fixed top-0 w-full ${scrolled
                    ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
                    : "bg-white/0"
                    } z-30 transition-all`}
            >
                <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
                    <Link href="/" className="flex items-center font-display text-2xl">

                        <p>SubtitlesAI</p>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <a
                            href="https://github.com/shivsarthak"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 24 24"

                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <main className="relative flex min-h-screen w-full flex-col items-center justify-center py-32">
                {children}
            </main>


            <div className="absolute w-full border-t border-gray-200 bg-white py-5 text-center">
                <p className="text-gray-500">
                    Created by{" "}
                    <a
                        className="font-semibold text-gray-600 transition-colors hover:text-black"
                        href="https://shivsarthak.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Shiv Sarthak Sabhlok
                    </a>
                </p>
            </div>
        </>
    )
}