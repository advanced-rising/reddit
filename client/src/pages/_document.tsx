import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='ko'>
        <Head>
          {/* PWA primary color */}
          <link rel='shortcut icon' href='/favicon.ico' />
          <link
            rel='stylesheet'
            crossOrigin='anonymous'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
          />
          <script
            defer
            src='https://use.fontawesome.com/releases/v6.1.1/js/all.js'
            integrity='sha384-xBXmu0dk1bEoiwd71wOonQLyH+VpgR1XcDH3rtxrLww5ajNTuMvBdL5SOiFZnNdp'
            crossOrigin='anonymous'></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
