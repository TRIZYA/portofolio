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
        company: "CV. Galvatekindo",
        timeframe: "Mar 2021 - May 2021",
        role: "Konten Kreator (Magang)",
        achievements: [
          <>
            Membuat dan mengembangkan konten digital untuk kebutuhan promosi dan branding perusahaan.
          </>,
          <>
            Mengolah ide konten menjadi materi visual dan teks yang menarik serta sesuai dengan target audiens.
          </>,
          <>
            Membantu mendukung kebutuhan media sosial perusahaan melalui pembuatan konten yang konsisten dan relevan.
          </>,
          <>
            Berkolaborasi dengan tim untuk menyesuaikan desain dan konsep konten dengan tujuan pemasaran perusahaan.
          </>,
        ],
        images: [],
      },
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
        title: "UI/UX Design & Prototyping",
        description: (
          <>Merancang antarmuka pengguna (UI) yang estetis dan berpusat pada pengguna (UX), serta membangun prototipe interaktif menggunakan Figma untuk memvalidasi alur kerja aplikasi sebelum tahap pengembangan.</>
        ),
        tags: [
          { name: "Figma", icon: "figma" },
          { name: "UI/UX", icon: "uiux" }, // atau sesuaikan dengan library icon Anda
        ],
        images: [],
      },
      {
        title: "Java Desktop Development",
        description: (
          <>Mengembangkan perangkat lunak PC (desktop) lintas platform yang stabil dan tangguh menggunakan Java, dengan fokus pada arsitektur yang terstruktur dan manajemen memori yang efisien.</>
        ),
        tags: [
          { name: "Java", icon: "java" },
        ],
        images: [],
      },
      {
        title: "Kotlin & Flutter (Dart)",
        description: (
          <>Menguasai fondasi utama pengembangan aplikasi mobile, mencakup pemrograman native Android dengan Kotlin untuk performa perangkat yang optimal, serta pembangunan aplikasi cross-platform yang responsif menggunakan Flutter dan Dart.</>
        ),
        tags: [
          { name: "Kotlin", icon: "kotlin" },
          { name: "Dart", icon: "dart" },
          { name: "Flutter", icon: "flutter" },
        ],
        images: [],
      },
      {
        title: "React + Vite",
        description: (
          <>Membangun antarmuka pengguna yang interaktif, responsif, dan mudah digunakan dengan React dan di-bundle dengan Vite.</>
        ),
        tags: [
          {
            name: "React",
            icon: "react",
          },
          {
            name: "Vite",
            icon: "vite",
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
        title: "MySQL & MongoDB",
        description: (
          <>Perancangan dan implementasi arsitektur database ganda menggunakan MySQL untuk data relasional yang terstruktur dengan kepatuhan ACID, serta MongoDB untuk pengelolaan data dinamis berbasis dokumen yang memiliki skalabilitas tinggi.</>
        ),
        tags: [
          {
            name: "MySQL",
            icon: "mysql",
          },
          {
            name: "MongoDB",
            icon: "mongodb",
          },
        ],
        images: [],
      },
            {
        title: "Graphic Design & Asset Creation",
        description: (
          <>Membuat aset visual komersial berkualitas tinggi, mencakup desain berbasis vektor menggunakan CorelDRAW untuk kebutuhan cetak dan branding, serta manipulasi gambar digital menggunakan Adobe Photoshop.</>
        ),
        tags: [
          { name: "CorelDRAW", icon: "coreldraw" },
          { name: "Photoshop", icon: "photoshop" },
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
  label: "Projects",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const toDriveImage = (fileId: string) => `https://drive.google.com/uc?export=view&id=${fileId}`;

const trainingCertificates: Achievement["training"] = [
  { src: toDriveImage("1ErEn1A87zABb6knsY_YeytEuGQ07Bpd3"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Ancaman Pembobolan Akun Pribadi dan Pencegahannya" },
  { src: toDriveImage("1D8CmdHaMSIVzKZw-Vn-BVOPrlxJBra8B"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Dasar-dasar Keamanan AI" },
  { src: toDriveImage("13k5qkrio5Z7qLDFGhIrRgfyus8QN_Vha"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Ethical Hacker For Dummies" },
  { src: toDriveImage("1QxVMvYON1EuM1ba0c3iVm8fy1VFmheeZ"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Generative AI untuk Pendidikan" },
  { src: toDriveImage("1eEUzE9GFdH13aK3ETh1L5BCaP0YC5E6A"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Introduction to Cyber Security and Career Awareness" },
  { src: toDriveImage("1PLlsxJiXv_K1yg63c7ICXSb3YEkYiM8P"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Konsep Pemrograman" },
  { src: toDriveImage("1bkWNMaI8QvNv9j4lzDwmNfobygnaSCYN"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Memahami Aspek Pengembangan Produk AI" },
  { src: toDriveImage("138a-Z0d6wQGdPL1aWeT2jc0yqd1BWNOq"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Pentingnya Menjaga Keamanan Digital: Perlindungan Diri di Dunia Maya" },
  { src: toDriveImage("1E3qCeTPZhHMka-_bXE4jWEIYxrsJUaNT"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Seberapa Penting Menjaga Data Pribadi dan Pelindungannya" },
  { src: toDriveImage("1VfhOPQtU_oBQRYjSnBm7RMmRkhw_rGW5"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Micro Skill Komdigi Tips Melindungi Diri Dari Ancaman Phising dan Malware di Era Digital" },
  { src: toDriveImage("1S_MJe6Lq7R5TEAK51kY8qCarejlKDvTP"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Atas Partisipasi Aktif Event Online DevOps" },
  { src: toDriveImage("17296NowVsXIIpAFjVubQiPFA1y2yM2BN"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Atas Partisipasi Aktif Webinar Design Thinking To Make Good Digital Business Products" },
  { src: toDriveImage("144XOodLa-Ag_5JqersHmbalQTn7l8fUu"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Atas Partisipasi Aktif Seminar Teknik Dasar Penggunaan Adobe Photoshop" },
  { src: toDriveImage("17ZTevnJwqlSR9RwsHGpiu2OO671-J0rR"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Atas Partisipasi Aktif PMKS MPK SMKN 1 Lamongan" },
];

const achievementCertificates: Achievement["achievements"] = [
  { src: toDriveImage("1Kkgz9lGSryTjcx2KrjwhtvQqhY7GhnAl"), alt: "image", orientation: "vertical", external: true, caption: "Sertifikat Kompetensi UKK Multimedia Pengolahan Audio dan Video" },
  { src: toDriveImage("1DRNdyprhLU6iCMjcxbA7cfYWbmsgCLfR"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Sebagai Panitia Mataf 2024" },
  { src: toDriveImage("1whFdaWr_y2Ix0-De26G8ndBbolzXNopJ"), alt: "image", orientation: "vertical", external: true, caption: "SK Rektor Pengangkatan Panitia Mataf 2023" },
  { src: toDriveImage("1Urg0B8693-XkRaTOqt3qEcUSNq-neOmJ"), alt: "image", orientation: "vertical", external: true, caption: "SK Rektor Pengesahan Pimpinan Komisariat Teknokrat IMM Universitas Muhammadiyah Gresik" },
  { src: toDriveImage("1ntCkgWAC_LAD6QRFHaHlMkxHJaEfWBan"), alt: "image", orientation: "vertical", external: true, caption: "Sertifikat Sebagai Peserta Uberalez 2022" },
  { src: toDriveImage("1QLoJtVy4-OLjm2W2_JkdjzM4it4tTxqR"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Sebagai Peserta Pesantren Kilat Baitul Arqom" },
  { src: toDriveImage("10nWf-Y5UCaxnuqBwLqDAApsReGnijYQj"), alt: "image", orientation: "horizontal", external: true, caption: "Sertifikat Sebagai Peserta Mataf UMG 2022" },
  { src: toDriveImage("15GeMhk_zznbQjsqcK_tAD8Pg3QqHX0PM"), alt: "image", orientation: "vertical", external: true, caption: "Sertifikat D1 Bahasa Inggris DSP2BU UMG" },
  { src: toDriveImage("1S8eBT-NSUSjf7u-RGeYwbCby32zzXttd"), alt: "image", orientation: "vertical", external: true, caption: "Sertifikat EPT Toefl DSP2BU UMG" },
  { src: toDriveImage("1qE8L8LHu7RqyzoxhSbl8cdmVGC17onHv"), alt: "image", orientation: "horizontal", external: true, caption: "Piagam Penghargaan Juara 2 Pelajar Putra Lomba Gerak Jalan Napak Tilas Kadet Soewoko 2019" },
];

const training: Achievement = {
  path: "/training",
  label: "Pelatihan",
  title: `Pelatihan – ${person.name}`,
  description: `Koleksi pelatihan oleh ${person.name}`,
  training: trainingCertificates,
  achievements: [],
  images: trainingCertificates,
};

const achievement: Achievement = {
  path: "/achievement",
  label: "Pencapaian",
  title: `Pencapaian – ${person.name}`,
  description: `Koleksi pencapaian oleh ${person.name}`,
  training: [],
  achievements: achievementCertificates,
  images: achievementCertificates,
};

export { person, social, newsletter, home, about, blog, work, achievement, training };
