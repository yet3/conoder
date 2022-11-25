import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    /* if (typeof document !== 'undefined') document.documentElement.setAttribute('data-color-mode', 'dark') */

  }, [])

  return <Component {...pageProps} />
}
