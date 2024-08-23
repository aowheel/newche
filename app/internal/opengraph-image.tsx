import { getLatestSchedule } from '@/utils/schedule-data'
import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'

export const alt = 'Newche'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'

export default async function Image() {
  const orbitron = fetch(
    new URL('../../public/fonts/Orbitron-Regular.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())
  
  const latest = await getLatestSchedule();

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#0f172a',
          color: '#5eead4',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span>Newche</span>
        {!!latest &&
        <div
          style={{
            fontSize: 64,
            color: 'white',
            display: 'flex',
            columnGap: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span>NEXT</span>
          <span>-&gt;</span>
          <span>{latest.date}</span>
          <div
            style={{
              fontSize: 64,
              color: 'white',
              display: 'flex',
              columnGap: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span>{latest.start}</span>
            <span>-</span>
            <span>{latest.end}</span>
          </div>
        </div>}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Orbitron',
          data: await orbitron,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}