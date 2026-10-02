import { About, Achievement, Blog, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Dimas",
  lastName: "Achyar Trizyaputra",
  name: `Dimas Achyar Trizyaputra`,
  role: "Software Engineer, Web Developer, Data Analyst",
  avatar: "/images/avatar.webp",
  email: "achyartrizyaputra@gmail.com",
  location: "Asia/Jakarta", // valid IANA timezone used for clock/time display
  locationLabel: "Lamongan, Indonesia",
  languages: [ "Bahasa Indonesia", "English"], // optional: Leave the array empty if you don't want to display languages
  locale: "en", // BCP 47 language tafavicong for the HTML lang attribute, e.g., 'en', 'ja', 'zh-TW'
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/TRIZYAPUTRA",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/dimas-achyar-trizyaputra/",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/iam_zilxvx/",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Halo, Saya Dimas Achyar Trizyaputra.</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">iam_zilxvx</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          LinkedIn Featured work
        </Text>
      </Row>
    ),
    href: "https://linkedin.com/in/dimas-achyar-trizyaputra",
  },
  subline: (
    <>
      seorang {person.role.toLowerCase()}, Membangun aplikasi tangguh dengan kode<br /> yang bersih dan performa tinggi.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.locationLabel ?? person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        {person.firstName} adalah seorang software engineer, web developer, dan data analyst. Memiliki ketertarikan pada pengembangan software, website, 
        serta pengolahan dan analisis data untuk membantu menyelesaikan berbagai kebutuhan dan permasalahan secara sederhana dan efektif. &nbsp; 
        {person.firstName} juga tertarik pada bagaimana teknologi dapat digunakan untuk membangun solusi yang fungsional, mudah digunakan, dan sesuai dengan kebutuhan.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "CV Rozitech Multimedia Indonesia",
        timeframe: "Aug 2025 - Oct 2025",
        role: "Teknisi Jaringan (Magang)",
        achievements: [
          <>
            Membantu instalasi, konfigurasi, dan pemeliharaan perangkat keras jaringan, termasuk router,
            switch, access point, dan perangkat periferal.
          </>,
          <>
            Memasang, menarik, dan melakukan terminasi kabel jaringan (UTP dan serat optik) sesuai
            standar instalasi industri.
          </>,
          <>
            Melakukan pemecahan masalah jaringan untuk mengatasi masalah konektivitas perangkat dan
            kesalahan konfigurasi.
          </>,
          <>
            Mendukung implementasi dan konfigurasi jaringan LAN dan WLAN serta memantau kinerja
            jaringan untuk memastikan konektivitas yang stabil.
          </>,
          <>
            Berpartisipasi dalam penerapan dan konfigurasi sistem CCTV berbasis IP, termasuk alokasi
            alamat IP, pengujian konektivitas, dan integrasi jaringan.
          </>,
          <>
            Menjaga dokumentasi jaringan secara akurat, termasuk diagram topologi, catatan konfigurasi,
            dan laporan pemeliharaan untuk evaluasi teknis.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Universitas Muhammadiyah Gresik",
        description: <>Mahasiswa Teknik Informatika yang sedang menempuh pendidikan dan mengembangkan kemampuan di bidang teknologi informasi.</>,
      },
      {
        name: "SMKN 1 Lamongan",
        description: <>Lulus dengan jurusan Multimedia, mempelajari desain, editing, dan dasar-dasar teknologi komputer.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "React",
        description: (
          <>Membangun antarmuka pengguna yang interaktif, responsif, dan mudah digunakan dengan React.</>
        ),
        tags: [
          {
            name: "React",
            icon: "react",
          },
        ],
        images: [],
      },
      {
        title: "JavaScript & Node.js",
        description: (
          <>Mengembangkan logika aplikasi, API, dan proses bisnis di sisi frontend maupun backend dengan JavaScript dan Node.js.</>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Node.js",
            icon: "nodejs",
          },
        ],
        images: [],
      },
      {
        title: "Next.js & MongoDB",
        description: (
          <>Menyusun aplikasi modern berbasis Next.js dengan database MongoDB untuk kebutuhan produk dan data yang scalable.</>
        ),
        tags: [
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "MongoDB",
            icon: "mongodb",
          },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const achievement: Achievement = {
  path: "/achievement",
  label: "Pencapaian",
  title: `Pencapaian – ${person.name}`,
  description: `Koleksi pencapaian oleh ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  // For Google Drive PDFs, use: https://drive.google.com/file/d/FILE_ID/preview
  // Set external: true for external URLs
  images: [
    { src: "https://drive.google.com/file/d/1S_MJe6Lq7R5TEAK51kY8qCarejlKDvTP/preview?usp=sharing", alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Atas Partisipasi Aktif Event Online DevOps" },
    { src: "/images/achievement/img2.webp", alt: "image", orientation: "square", caption: "Sertifikat 2" },
    { src: "/images/achievement/img3.webp", alt: "image", orientation: "square", caption: "Sertifikat 3" },
    { src: "/images/achievement/img4.webp", alt: "image", orientation: "square", caption: "Sertifikat 4" },
    { src: "/images/achievement/img5.webp", alt: "image", orientation: "square", caption: "Sertifikat 5" },
    { src: "/images/achievement/img6.webp", alt: "image", orientation: "square", caption: "Sertifikat 6" },
    { src: "/images/achievement/img7.webp", alt: "image", orientation: "square", caption: "Sertifikat 7" },
    { src: "/images/achievement/img8.webp", alt: "image", orientation: "square", caption: "Sertifikat 8" },
    { src: "/images/achievement/img9.webp", alt: "image", orientation: "square", caption: "Sertifikat 9" },
    { src: "/images/achievement/img10.webp", alt: "image", orientation: "square", caption: "Sertifikat 10" },
    // Example Google Drive PDF (replace FILE_ID with your actual file ID)
    // { src: "https://drive.google.com/file/d/YOUR_FILE_ID/preview", alt: "Certificate PDF", orientation: "square", external: true, caption: "Google Drive Certificate" },
  ],
};

export { person, social, newsletter, home, about, blog, work, achievement };
