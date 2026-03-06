// pages/_document.tsx
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {process.env.NODE_ENV !== "development" && (
            <>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag() {
                        dataLayer.push(arguments);
                    }
                    gtag("consent", "default", {
                        ad_user_data: "denied",
                        ad_personalization: "denied",
                        ad_storage: "denied",
                        analytics_storage: "denied"
                    });
                    window.addEventListener('UC_CONSENT', function(event) {
                        if (!window.ucAlreadyLoaded) {
                            window.ucAlreadyLoaded = true;
                            LoadGTM();
                        }
                    })
                    function LoadGTM() {
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://t.embeddable.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-5JVQ8XW');
                    }
                  `,
                }}
              />
              <script
                id="usercentrics-cmp"
                src="https://web.cmp.usercentrics.eu/ui/loader.js"
                data-ruleset-id="hqENIjhi_48l7t"
                async
              />
            </>
          )}
          <script src="https://cdn.eu.amplitude.com/script/b2d53a5c210f08b1de5a2ce1490ed82.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.amplitude.init("b2d53a5c210f08b1de5a2ce1490ed82", {
                  serverZone: "EU",
                  fetchRemoteConfig: true,
                  autocapture: {
                    pageViews: false
                  }
                });
              `,
            }}
          />
          <script
            src="https://cdn.jsdelivr.net/npm/@inkeep/cxkit-js@0.5/dist/embed.js"
            defer
            type="module"
          />
        </Head>
        <body>
          <noscript>
            <iframe
              src="https://t.embeddable.com/ns.html?id=GTM-5JVQ8XW"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
