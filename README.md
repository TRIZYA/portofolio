# Achyar Portfolio

Portfolio pribadi berbasis Next.js untuk menampilkan profil, pengalaman kerja, proyek, pencapaian, artikel blog, dan galeri karya. Aplikasi ini dibuat dengan React, TypeScript, dan MDX untuk pengalaman portofolio yang modern, responsif, dan mudah dikelola.

## Tentang Project

Project ini merupakan website portfolio milik Dimas Achyar Trizyaputra yang berisi:

- Halaman home dengan hero section dan profil singkat
- Halaman tentang (About)
- Daftar pengalaman kerja dan studi
- Halaman proyek/portofolio pekerjaan
- Blog dan artikel teknis berbasis MDX
- Halaman pencapaian/achievement
- RSS/API support untuk konten publik
- Metadata SEO dan Open Graph image generation untuk sharing ke sosial media

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- MDX
- Sass
- Once UI System
- Sharp untuk optimasi image

## Fitur Utama

- Desain modern dan responsive
- Navigasi multi halaman portfolio
- Content-driven dengan struktur data dan MDX
- Blog post dinamis berdasarkan file markdown/MDX
- Open Graph image generator untuk preview link
- SEO metadata untuk halaman utama dan subpage
- Pengelolaan asset dan gambar dengan utility resize
- Support RSS feed dan API route

## Struktur Project

```bash
.
├── public/
│   ├── google8f5954ca962cf4f6.html
│   └── images/
├── resize/
│   └── resizequal.js
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── achievement/
│   │   ├── api/
│   │   ├── blog/
│   │   ├── gallery/
│   │   ├── training/
│   │   ├── work/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   ├── components/
│   ├── resources/
│   ├── types/
│   └── utils/
├── biome.json
├── next.config.mjs
├── package.json
├── tsconfig.json
├── README.md
└── ...
```

## Prasyarat

Pastikan perangkat sudah memiliki:

- Node.js 20+
- npm / pnpm / yarn

## Instalasi

1. Clone repository

```bash
git clone <repository-url>
```

2. Install dependency

```bash
npm install
```

3. Jalankan aplikasi di mode development

```bash
npm run dev
```

Setelah itu, buka browser di:

```bash
http://localhost:3000
```

## Perintah yang Tersedia

```bash
# menjalankan development server
npm run dev

# build production
npm run build

# menjalankan hasil build
npm run start

# cek linting
npm run lint

# format code menggunakan Biome
npm run biome-write

# resize image asset
npm run resize:images
```

## Build untuk Production

```bash
npm run build
npm run start
```

## Catatan

- Konten blog dan project utama dapat dikelola melalui file MDX dan konfigurasi content di `src/resources/content.tsx`.
- API route untuk OG image dan RSS tersedia di folder `src/app/api`.
- Untuk kebutuhan SEO dan preview sosial media, pastikan metadata seperti title, description, dan image pada content sudah sesuai.

## Atribusi

Project ini menggunakan [Magic Portfolio](https://once-ui.com/products/magic-portfolio) dari [Once UI](https://once-ui.com/), dengan Selene Yu sebagai developer. Template telah disesuaikan untuk kebutuhan portofolio Dimas Achyar Trizyaputra.

## Lisensi

Project ini menggunakan lisensi yang tertera di file LICENSE.

## Kontak

- GitHub: https://github.com/TRIZYA
- LinkedIn: https://www.linkedin.com/in/dimas-achyar-trizyaputra/
- Instagram: https://www.instagram.com/iam_zilxvx/
