import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-sans: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
          }
          body { 
            font-family: var(--font-sans);
            background-color: #f3f4f6;
          }
          .fas { 
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
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
