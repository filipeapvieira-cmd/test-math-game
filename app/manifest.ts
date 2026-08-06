import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Number Quest Adventures',
    short_name: 'Number Quest',
    description: 'Dinosaur and monster-truck maths adventures for young explorers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#79d7f2',
    theme_color: '#42b8df',
    orientation: 'any',
    icons: [
      {
        src: '/peter-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
