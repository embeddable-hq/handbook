import '../styles.css'
import { useRouter } from "next/router";
import { useEffect } from "react";

//this is required to use custom styles
//https://nextra.site/docs/guide/custom-css
export default function MyApp({ Component, pageProps }) {
  
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.amplitude && window.amplitude.track) {
        window.amplitude.track("Docs Page Viewed", {
          path: url,
          title: document.title,
          full_url: window.location.href
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    // fire first load
    handleRouteChange(window.location.pathname);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);


    return <Component {...pageProps} />
  }