import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          .fas { display: inline-flex; align-items: center; }
          .fa-chart-line, .fa-shield-alt, .fa-comments { color: #3B82F6; }
        ` }} />
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
