import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'SVG Visual';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  // Font
  const syneBold = fetch(
    new URL('https://fonts.gstatic.com/s/syne/v22/8vIX7w4m_60L_i0uv2m_Y_uC.woff', 'https://fonts.gstatic.com')
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 320,
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontFamily: 'Syne',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 480,
            height: 480,
            background: 'white',
            borderRadius: 80,
            color: 'black',
          }}
        >
          S
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
      fonts: [
        {
          name: 'Syne',
          data: await syneBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
