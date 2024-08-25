import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Newche | An app for SCI Cycle-ball Team',
    short_name: 'Newche',
    description: 'Newche is an app that makes it easy to share SCI Cycle-ball Team schedule.',
    start_url: '/internal',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icons/icon-512x512.png',
        type: 'image/png',
        sizes: '192x192',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192x192.png',
        type: 'image/png',
        sizes: '192x192',
        purpose: 'maskable'
      },
      {
        src: '/icons/icon-512x512.png',
        type: 'image/png',
        sizes: '512x512',
        purpose: 'maskable'
      }
    ]
  }
}