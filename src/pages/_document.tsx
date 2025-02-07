import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <style>{`
          body {
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
          }
          .fas {
            margin-right: 0.5rem;
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
          }
          .fa-check-circle {
            color: #10B981;
            font-size: 1.25rem;
          }
          .fa-paperclip, .fa-paper-plane {
            font-size: 1.125rem;
          }
        `}</style>
      </Head>
      <body className="font-['Roboto'] bg-gray-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
