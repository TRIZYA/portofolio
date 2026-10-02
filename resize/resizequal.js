#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const SIZE_LIST = [
  { id: 1, label: '320x220', width: 320, height: 220 },
  { id: 2, label: '768x512', width: 768, height: 512 },
  { id: 3, label: '1280x720', width: 1280, height: 720 },
  { id: 4, label: 'Semua ukuran', width: null, height: null },
];

const ROOT_DIR = __dirname;
const INPUT_DIR = path.join(ROOT_DIR, 'input');
const OUTPUT_DIR = path.join(ROOT_DIR, 'output');
const SUPPORTED_EXTENSIONS = new Set(['.svg', '.webp', '.png', '.jpg', '.jpeg']);

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getAllFiles(dirPath, result = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      getAllFiles(fullPath, result);
      continue;
    }

    result.push(fullPath);
  }

  return result;
}

function toRelative(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
}

function getSelectedSizes(choice) {
  if (choice === 4) {
    return SIZE_LIST.filter((item) => item.id !== 4);
  }

  const selected = SIZE_LIST.find((item) => item.id === Number(choice));
  return selected && selected.id !== 4 ? [selected] : [];
}

function getOutputFileName(filePath, size) {
  const ext = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, ext);
  return `${baseName}.png`;
}

function promptUser() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('\nPilih ukuran gambar:');
    SIZE_LIST.forEach((size) => {
      console.log(`  ${size.id}. ${size.label}`);
    });

    rl.question('Masukkan pilihan (1-4): ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function resizeFile(filePath, outputDir, selectedSizes) {
  let sharp;

  try {
    sharp = require('sharp');
  } catch (error) {
    console.error('');
    console.error('❌ sharp belum terinstall.');
    console.error('Silakan jalankan perintah berikut di root project:');
    console.error('  npm install sharp');
    console.error('');
    process.exit(1);
  }

  console.log(`\n📁 File: ${toRelative(filePath)}`);

  for (const size of selectedSizes) {
    const targetFile = path.join(outputDir, getOutputFileName(filePath, size));

    await sharp(filePath)
      .resize({
        width: size.width,
        height: size.height,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(targetFile);

    console.log(`  ✓ ${size.width}x${size.height} -> ${toRelative(targetFile)}`);
  }
}

async function main() {
  ensureDirectory(INPUT_DIR);
  ensureDirectory(OUTPUT_DIR);

  const choice = await promptUser();
  const selectedSizes = getSelectedSizes(choice);

  if (selectedSizes.length === 0) {
    console.log('\n⚠️  Pilihan tidak valid. Gunakan angka 1 sampai 4.');
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('  Resize Image Script');
  console.log('========================================');
  console.log('Directory input :', toRelative(INPUT_DIR));
  console.log('Directory output:', toRelative(OUTPUT_DIR));
  console.log('Ukuran dipilih :');

  for (const size of selectedSizes) {
    console.log(`  - ${size.width}x${size.height}`);
  }

  const files = getAllFiles(INPUT_DIR).filter((filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    return SUPPORTED_EXTENSIONS.has(ext);
  });

  if (files.length === 0) {
    console.log('\n⚠️  Tidak ada file .svg / .webp di folder input.');
    console.log('Tempat file yang didukung:');
    console.log(`  ${toRelative(INPUT_DIR)}`);
    return;
  }

  console.log(`\nJumlah file yang diproses: ${files.length}`);

  for (const filePath of files) {
    await resizeFile(filePath, OUTPUT_DIR, selectedSizes);
  }

  console.log('\n✅ Proses resize selesai.');
  console.log(`Hasil ada di folder: ${toRelative(OUTPUT_DIR)}`);
}

main().catch((error) => {
  console.error('\n❌ Gagal menjalankan script:');
  console.error(error.message);
  process.exit(1);
});
