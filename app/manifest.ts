import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Newche | An app for SCI Cycle-ball Team',
    short_name: 'Newche',
    description: 'Newche is an app that makes it easy to share SCI Cycle-ball Team schedule.',
    start_url: '/internal',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#5eead4',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}