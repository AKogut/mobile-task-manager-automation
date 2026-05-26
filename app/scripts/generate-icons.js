#!/usr/bin/env node
/* eslint-env node */
/**
 * Generates iOS and Android app icons from assets/icon.svg
 * Run: node scripts/generate-icons.js
 * Requires: npm install sharp --save-dev
 */

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const SVG_SRC = path.join(ROOT, 'assets', 'icon.svg');

// ─── iOS ─────────────────────────────────────────────────────────────────────

const IOS_APPICONSET = path.join(
  ROOT,
  'ios',
  'MobileTaskManager',
  'Images.xcassets',
  'AppIcon.appiconset',
);

const IOS_SIZES = [
  { size: 20, scale: 2 },
  { size: 20, scale: 3 },
  { size: 29, scale: 2 },
  { size: 29, scale: 3 },
  { size: 40, scale: 2 },
  { size: 40, scale: 3 },
  { size: 60, scale: 2 },
  { size: 60, scale: 3 },
  { size: 1024, scale: 1 },
];

// ─── Android ─────────────────────────────────────────────────────────────────

const ANDROID_MIPMAP = path.join(ROOT, 'android', 'app', 'src', 'main', 'res');

const ANDROID_SIZES = [
  { dir: 'mipmap-mdpi',    px: 48 },
  { dir: 'mipmap-hdpi',    px: 72 },
  { dir: 'mipmap-xhdpi',  px: 96 },
  { dir: 'mipmap-xxhdpi', px: 144 },
  { dir: 'mipmap-xxxhdpi',px: 192 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function circleMask(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    `<circle cx="${r}" cy="${r}" r="${r}" fill="white"/>` +
    `</svg>`,
  );
}

async function resizePng(px, destPath) {
  await sharp(SVG_SRC).resize(px, px).png().toFile(destPath);
}

async function resizeRoundPng(px, destPath) {
  const base = await sharp(SVG_SRC).resize(px, px).png().toBuffer();
  await sharp(base)
    .composite([{ input: circleMask(px), blend: 'dest-in' }])
    .png()
    .toFile(destPath);
}

// ─── iOS generation ──────────────────────────────────────────────────────────

async function generateIos() {
  const images = [];

  for (const { size, scale } of IOS_SIZES) {
    const px = size * scale;
    const filename =
      scale === 1 ? `icon-${size}.png` : `icon-${size}@${scale}x.png`;
    const dest = path.join(IOS_APPICONSET, filename);
    await resizePng(px, dest);

    const idiom = size === 1024 ? 'ios-marketing' : 'iphone';
    images.push({
      filename,
      idiom,
      scale: `${scale}x`,
      size: `${size}x${size}`,
    });

    console.log(`  iOS  ${filename} (${px}×${px})`);
  }

  const contents = { images, info: { author: 'xcode', version: 1 } };
  fs.writeFileSync(
    path.join(IOS_APPICONSET, 'Contents.json'),
    JSON.stringify(contents, null, 2) + '\n',
  );
}

// ─── Android generation ──────────────────────────────────────────────────────

async function generateAndroid() {
  for (const { dir, px } of ANDROID_SIZES) {
    const dirPath = path.join(ANDROID_MIPMAP, dir);
    fs.mkdirSync(dirPath, { recursive: true });

    await resizePng(px, path.join(dirPath, 'ic_launcher.png'));
    await resizeRoundPng(px, path.join(dirPath, 'ic_launcher_round.png'));

    console.log(`  Android  ${dir}  ${px}×${px}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  if (!fs.existsSync(SVG_SRC)) {
    console.error(`SVG not found: ${SVG_SRC}`);
    process.exit(1);
  }

  console.log('\nGenerating iOS icons...');
  await generateIos();

  console.log('\nGenerating Android icons...');
  await generateAndroid();

  console.log('\nDone. All icons generated.\n');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
