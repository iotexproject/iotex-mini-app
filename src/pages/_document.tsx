import React from 'react';
import { Html, Head, Main, NextScript, DocumentProps } from 'next/document';

export default function _Document(props: DocumentProps) {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BASE_URL}/favicon.ico`} type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
