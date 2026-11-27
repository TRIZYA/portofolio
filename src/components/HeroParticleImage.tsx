"use client";

import type React from "react";
import { useCallback, useEffect, useRef } from "react";

/**
 * Konfigurasi efek hero:
 *  - reveal hero-ac.png berbentuk gelembung (blob) yang melayang saat idle dan
 *    mengikuti kursor saat hover,
 *  - serpihan kaca (glass shards) di DEPAN gambar, bergerak ke kanan atas.
 *
 * Semua nilai bisa diatur di sini tanpa menyentuh logika di bawah.
 */
export const HERO_GLASS_CONFIG = {
  // -------------------------------------------------------------- blob reveal
  BLOB_POINTS: 9,
  /** Radius dasar blob sebagai fraksi lebar gambar. */
  BLOB_BASE_SIZE: 0.3,
  /** Amplitudo gelombang tepi blob (0..1). */
  BLOB_WOBBLE: 0.16,
  MORPH_SPEED: 0.0012,
  IDLE_DRIFT_SPEED: 0.00045,
  /** Kecepatan blob mengikuti target per frame (0..1). */
  FOLLOW_SPEED: 0.1,
  /** Pembesaran blob saat hover. */
  HOVER_SCALE: 1.15,
  /** Kehalusan transisi pembesaran/pengecilan saat hover masuk/keluar. */
  HOVER_SCALE_EASE: 0.08,

  // -------------------------------------------------------- glass shards
  /** Jumlah serpihan kaca yang aktif sekaligus. */
  shardCount: 44,
  /** Ukuran minimum/maksimum serpihan (CSS px). */
  shardSizeMin: 7,
  shardSizeMax: 26,
  /** Kecepatan dasar serpihan (CSS px per frame). */
  shardSpeedMin: 0.22,
  shardSpeedMax: 0.72,
  /** Arah gerak (derajat). -45° pada koordinat canvas = kanan atas. */
  shardDirectionDeg: -45,
  /** Sebaran sudut agar pergerakan terlihat natural. */
  shardDirectionSpreadDeg: 34,
  /** Lama hidup serpihan (frame). */
  shardLifeMinFrames: 220,
  shardLifeMaxFrames: 520,
  /** Kecepatan rotasi (derajat per frame). */
  shardSpinMin: -0.28,
  shardSpinMax: 0.28,
  /** Opasitas isi serpihan (potongan hero-ac.png). */
  shardContentOpacityMin: 0.4,
  shardContentOpacityMax: 0.6,
  /** Opasitas tepi berkilau. */
  shardEdgeOpacity: 0.55,
  /** Ketebalan overlay gelap pada isi serpihan. */
  shardContentShadeOpacity: 0.34,
  /** Query cache-busting untuk hero-ac.png (naikkan bila gambar basi). */
  acImageVersion: 2,
  /** Ketebalan tepi serpihan (CSS px). */
  shardEdgeWidth: 1,
  /** Area tempat serpihan muncul: 0..1 dari tinggi area gambar. */
  spawnBandTop: 0.18,
  spawnBandBottom: 0.92,
  /** Radius (sebagai fraksi lebar) dari pusat gambar tempat serpihan muncul. */
  spawnRadiusFactor: 0.42,

  // --------------------------------------------------------------- umum
  /** Rasio perangkat piksel maksimum untuk canvas. */
  maxDevicePixelRatio: 2,
  /** Debounce saat ukuran jendela berubah (ms). */
  resizeDebounceMs: 180,
  /** Menahan efek sentuhan sebentar setelah jari dilepas (ms). */
  touchHoldAfterEndMs: 420,
} as const;

/** Mask underside agar gambar hero menyatu dengan latar halaman. */
const IMAGE_MASK = "linear-gradient(to bottom, black 80%, transparent 100%)";

/**
 * Offset vertikal (CSS px) layer gambar hero terhadap container.
 *
 * DIPAKAI OLEH KEDUA layer gambar (hero asli dan hero-ac) serta oleh
 * pemetaan koordinat serpihan. Kalau posisi gambar perlu digeser, ubah
 * nilai ini saja, jangan ubah `top` di JSX.
 */
const HERO_LAYER_TOP_OFFSET = 20;

/**
 * DEBUG: saat true, isi serpihan diberi tint merah dan `src` gambar yang
 * dipakai canvas dicetak ke console. Setel ke false untuk menonaktifkan.
 */
const DEBUG_SHARDS = false;

type Pt = readonly [number, number];

interface GlassShard {
  /** Posisi pusat serpihan (CSS px, relatif terhadap container). */
  x: number;
  y: number;
  /** Bentuk poligon tak beraturan (titik relatif terhadap pusat, skala 0..1). */
  points: number[][];
  /** Radius efektif serpihan (CSS px). */
  radius: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  life: number;
  maxLife: number;
  contentOpacity: number;
}

interface HeroParticleImageProps {
  /** Gambar hero utama (layer bawah). */
  src: string;
  /** Gambar versi Assassin's Creed (layer atas, dimasker blob). */
  acSrc: string;
  alt: string;
  imgStyle?: React.CSSProperties;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Membuat poligon tak beraturan (segitiga/segiempat) untuk bentuk serpihan kaca.
 */
function makeShardShape(): { points: number[][]; radius: number } {
  const vertexCount = Math.random() < 0.55 ? 3 : 4;
  const points: number[][] = [];
  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2 + randomBetween(-0.35, 0.35);
    const radius = randomBetween(0.55, 1);
    points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
  }
  const maxRadius = Math.max(...points.map(([px, py]) => Math.hypot(px, py)));
  return { points, radius: maxRadius };
}

/**
 * Mengubah titik-titik blob menjadi path SVG tertutup yang mulus
 * (Catmull-Rom -> Bezier kubik). `dy` dikurangkan dari setiap nilai y,
 * dipakai untuk mengubah koordinat container menjadi koordinat layer gambar.
 */
function toBlobPath(points: ReadonlyArray<Pt>, dy: number): string {
  const n = points.length;
  const f = (v: number) => v.toFixed(2);
  let d = `M ${f(points[0][0])} ${f(points[0][1] - dy)}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] - dy + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - dy - (p3[1] - p1[1]) / 6;
    d += ` C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(p2[0])} ${f(p2[1] - dy)}`;
  }
  return `${d} Z`;
}

/**
 * Menghitung persegi sumber (dalam piksel natural gambar) untuk titik (x, y)
 * di koordinat container, dengan meniru geometri `object-fit: cover` +
 * `object-position: center left` + `top: HERO_LAYER_TOP_OFFSET` pada <img>.
 *
 * Rantai koordinat:
 *   container (x, y)
 *     -> elemen <img>      (x, y - TOP)
 *     -> gambar tergambar  (x - offsetX, y - TOP - offsetY)
 *     -> piksel natural    (dibagi scale)
 *
 * `offsetY` bernilai negatif saat gambar dipotong secara vertikal, sehingga
 * harus DIKURANGKAN (bukan ditambahkan).
 *
 * Hasil `sx`/`sy` tidak di-clamp: bagian yang keluar dari gambar dipotong
 * saat menggambar, supaya potongan tidak bergeser dari posisi aslinya.
 */
function sourceRectFor(
  x: number,
  y: number,
  sizeCss: number,
  image: HTMLImageElement,
  boxW: number,
  boxH: number,
): { sx: number; sy: number; size: number } {
  const naturalW = image.naturalWidth;
  const naturalH = image.naturalHeight;
  if (naturalW <= 0 || naturalH <= 0 || boxW <= 0 || boxH <= 0) {
    return { sx: 0, sy: 0, size: 0 };
  }

  const scale = Math.max(boxW / naturalW, boxH / naturalH);
  const drawH = naturalH * scale;
  // "center left": horizontal rata kiri (0), vertikal di tengah (0.5).
  const offsetX = 0;
  const offsetY = (boxH - drawH) * 0.5;

  const px = x - offsetX;
  const py = y - HERO_LAYER_TOP_OFFSET - offsetY;

  const size = sizeCss / scale;
  return {
    sx: px / scale - size / 2,
    sy: py / scale - size / 2,
    size,
  };
}

/**
 * drawImage untuk potongan persegi yang boleh melewati batas gambar:
 * bagian di luar gambar dipotong dan tujuan digambar proporsional.
 */
function drawImagePatch(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  sx: number,
  sy: number,
  size: number,
  dx: number,
  dy: number,
  dSize: number,
): void {
  if (size <= 0) return;
  const k = dSize / size;
  const x0 = Math.max(sx, 0);
  const y0 = Math.max(sy, 0);
  const x1 = Math.min(sx + size, image.naturalWidth);
  const y1 = Math.min(sy + size, image.naturalHeight);
  if (x1 <= x0 || y1 <= y0) return;
  ctx.drawImage(
    image,
    x0,
    y0,
    x1 - x0,
    y1 - y0,
    dx + (x0 - sx) * k,
    dy + (y0 - sy) * k,
    (x1 - x0) * k,
    (y1 - y0) * k,
  );
}

export const HeroParticleImage: React.FC<HeroParticleImageProps> = ({
  src,
  acSrc,
  alt,
  imgStyle,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const acImgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Gambar KHUSUS untuk canvas serpihan (instance terpisah dari <img> DOM),
   * dimuat dari `acSrc` yang sama dengan layer reveal.
   */
  const shardImageRef = useRef<HTMLImageElement | null>(null);

  const shardsRef = useRef<GlassShard[]>([]);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  /** Posisi target blob saat hover (koordinat container). */
  const pointerTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  /** Posisi blob saat ini (sudah di-smooth). */
  const pointerCurrentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const blobInitRef = useRef<boolean>(false);
  const blobScaleRef = useRef<number>(1);
  const revealActiveRef = useRef<boolean>(false);

  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const isVisibleRef = useRef<boolean>(true);
  const isTabActiveRef = useRef<boolean>(true);
  const reducedMotionRef = useRef<boolean>(false);
  /** Apakah hero-ac.png berhasil dimuat; bila tidak, reveal & isi serpihan dinonaktifkan. */
  const acReadyRef = useRef<boolean>(false);
  const touchTimeoutRef = useRef<number | null>(null);

  /**
   * Menghitung blob untuk frame ini dan mengembalikan dua path:
   *  - rim: koordinat container (untuk garis tepi SVG),
   *  - clip: koordinat layer gambar (untuk clip-path), yaitu y dikurangi offset.
   */
  const buildBlobPaths = useCallback(
    (time: number, width: number, height: number, dtScale: number) => {
      const cfg = HERO_GLASS_CONFIG;
      const hover = revealActiveRef.current;

      const idleX = width * (0.5 + Math.sin(time * cfg.IDLE_DRIFT_SPEED) * 0.16);
      const idleY = height * (0.68 + Math.cos(time * cfg.IDLE_DRIFT_SPEED * 0.83) * 0.10);
      const target = hover ? pointerTargetRef.current : { x: idleX, y: idleY };
      const current = pointerCurrentRef.current;

      // Frame pertama: langsung di posisi target, jangan terbang dari (0, 0).
      if (!blobInitRef.current) {
        current.x = target.x;
        current.y = target.y;
        blobInitRef.current = true;
      }

      const follow = 1 - Math.pow(1 - cfg.FOLLOW_SPEED, dtScale);
      current.x += (target.x - current.x) * follow;
      current.y += (target.y - current.y) * follow;

      const scaleEase = 1 - Math.pow(1 - cfg.HOVER_SCALE_EASE, dtScale);
      const scaleTarget = hover ? cfg.HOVER_SCALE : 1;
      blobScaleRef.current += (scaleTarget - blobScaleRef.current) * scaleEase;

      const radius =
        width * cfg.BLOB_BASE_SIZE * blobScaleRef.current * (0.96 + Math.sin(time * 0.001) * 0.04);

      const points: Pt[] = Array.from({ length: cfg.BLOB_POINTS }, (_, index) => {
        const angle = (index / cfg.BLOB_POINTS) * Math.PI * 2 - Math.PI / 2;
        const wobble = 1 + Math.sin(time * cfg.MORPH_SPEED + index * 1.71) * cfg.BLOB_WOBBLE;
        return [
          current.x + Math.cos(angle) * radius * wobble,
          current.y + Math.sin(angle) * radius * wobble,
        ] as const;
      });

      return {
        rim: toBlobPath(points, 0),
        clip: toBlobPath(points, HERO_LAYER_TOP_OFFSET),
      };
    },
    [],
  );

  const applyRevealBlob = useCallback(
    (time = performance.now(), dtScale = 1) => {
      const acImg = acImgRef.current;
      if (!acImg || !acReadyRef.current) return;
      const { width, height } = sizeRef.current;
      if (width <= 0 || height <= 0) return;

      const { clip } = buildBlobPaths(time, width, height, dtScale);
      acImg.style.opacity = "1";
      acImg.style.setProperty("clip-path", `path('${clip}')`);
      acImg.style.setProperty("-webkit-clip-path", `path('${clip}')`);
    },
    [buildBlobPaths],
  );

  const hideReveal = useCallback(() => {
    const acImg = acImgRef.current;
    if (acImg) {
      acImg.style.opacity = "0";
      acImg.style.setProperty("clip-path", "none");
      acImg.style.setProperty("-webkit-clip-path", "none");
    }
  }, []);

  const spawnShard = useCallback((prewarm = false): GlassShard | null => {
    const { width, height } = sizeRef.current;
    if (width <= 0 || height <= 0) return null;

    const size = randomBetween(HERO_GLASS_CONFIG.shardSizeMin, HERO_GLASS_CONFIG.shardSizeMax);
    const shape = makeShardShape();
    const radius = (size / 2) * shape.radius;

    // Serpihan muncul dari area sosok karakter (bagian tengah-bawah gambar).
    const bandTop = height * HERO_GLASS_CONFIG.spawnBandTop;
    const bandBottom = height * HERO_GLASS_CONFIG.spawnBandBottom;
    const originY = randomBetween(bandTop, bandBottom);
    const maxOffsetX = width * HERO_GLASS_CONFIG.spawnRadiusFactor;
    const originX = width / 2 + randomBetween(-maxOffsetX, maxOffsetX);

    const angleDeg =
      HERO_GLASS_CONFIG.shardDirectionDeg +
      randomBetween(
        -HERO_GLASS_CONFIG.shardDirectionSpreadDeg,
        HERO_GLASS_CONFIG.shardDirectionSpreadDeg,
      );
    const angleRad = (angleDeg * Math.PI) / 180;
    const speed = randomBetween(HERO_GLASS_CONFIG.shardSpeedMin, HERO_GLASS_CONFIG.shardSpeedMax);
    const vx = Math.cos(angleRad) * speed;
    const vy = Math.sin(angleRad) * speed;

    const maxLife = randomBetween(
      HERO_GLASS_CONFIG.shardLifeMinFrames,
      HERO_GLASS_CONFIG.shardLifeMaxFrames,
    );
    // Prewarm: sebar umur awal agar serpihan tidak muncul dan hilang serempak.
    const life = prewarm ? Math.random() * maxLife : 0;

    return {
      x: originX + vx * life,
      y: originY + vy * life,
      points: shape.points,
      radius,
      vx,
      vy,
      angle: randomBetween(0, Math.PI * 2),
      spin: randomBetween(HERO_GLASS_CONFIG.shardSpinMin, HERO_GLASS_CONFIG.shardSpinMax),
      life,
      maxLife,
      contentOpacity: randomBetween(
        HERO_GLASS_CONFIG.shardContentOpacityMin,
        HERO_GLASS_CONFIG.shardContentOpacityMax,
      ),
    };
  }, []);

  const populateShards = useCallback(() => {
    const { width, height } = sizeRef.current;
    if (width <= 0 || height <= 0) return false;

    const next: GlassShard[] = [];
    for (let i = 0; i < HERO_GLASS_CONFIG.shardCount; i++) {
      const shard = spawnShard(true);
      if (shard) next.push(shard);
    }
    shardsRef.current = next;
    return next.length > 0;
  }, [spawnShard]);

  const stopLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, sizeRef.current.width, sizeRef.current.height);
    }
  }, []);

  /**
   * Menggambar satu serpihan kaca:
   *  - bentuk: poligon yang berputar,
   *  - isi: jendela ke hero-ac.png pada posisi serpihan (gambar TIDAK ikut
   *    berputar, jadi isinya benar-benar sejajar dengan sosok di bawahnya),
   *  - tepi: garis tipis berkilau.
   */
  const drawShard = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      shard: GlassShard,
      alpha: number,
      acImage: HTMLImageElement,
      boxW: number,
      boxH: number,
    ) => {
      const { x, y, points, radius, angle } = shard;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const tracePath = () => {
        ctx.beginPath();
        points.forEach(([px, py], index) => {
          const vx = px * radius;
          const vy = py * radius;
          if (index === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        });
        ctx.closePath();
      };

      // --- isi serpihan ---------------------------------------------------
      if (acImage.complete && acImage.naturalWidth > 0) {
        const drawSize = radius * 2;

        ctx.save();
        ctx.globalAlpha = shard.contentOpacity * alpha;
        tracePath();
        ctx.clip();
        // Batalkan rotasi setelah clip: bentuk berputar, gambar tetap lurus.
        ctx.rotate(-angle);

        const { sx, sy, size } = sourceRectFor(x, y, drawSize, acImage, boxW, boxH);
        try {
          drawImagePatch(ctx, acImage, sx, sy, size, -radius, -radius, drawSize);
        } catch (error) {
          // Gambar tidak bisa dibaca (CORS) -> lewati isi, sisakan tepi.
          console.error("[HeroParticleImage] Gagal menggambar isi serpihan:", error);
        }

        // Nuansa gelap tipis di atas potongan gambar.
        ctx.fillStyle = `rgba(6, 8, 12, ${HERO_GLASS_CONFIG.shardContentShadeOpacity})`;
        ctx.fillRect(-radius, -radius, drawSize, drawSize);

        if (DEBUG_SHARDS) {
          ctx.fillStyle = "rgba(255, 0, 0, 0.18)";
          ctx.fillRect(-radius, -radius, drawSize, drawSize);
        }
        ctx.restore();
      }

      // --- tepi serpihan: garis tipis berkilau ------------------------------
      ctx.globalAlpha = HERO_GLASS_CONFIG.shardEdgeOpacity * alpha;
      ctx.strokeStyle = "rgba(226, 234, 246, 0.9)";
      ctx.lineWidth = HERO_GLASS_CONFIG.shardEdgeWidth;
      tracePath();
      ctx.stroke();

      // Kilau kecil di salah satu sudut.
      ctx.globalAlpha = HERO_GLASS_CONFIG.shardEdgeOpacity * alpha * 0.8;
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      const [hx, hy] = points[0];
      ctx.beginPath();
      ctx.arc(hx * radius, hy * radius, Math.max(0.6, radius * 0.09), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },
    [],
  );

  const stepAndRender = useCallback(
    (now: number) => {
      const canvas = canvasRef.current;
      const acImage = shardImageRef.current;
      if (!canvas || !acImage) {
        rafIdRef.current = null;
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafIdRef.current = null;
        return;
      }

      const { width, height } = sizeRef.current;
      if (width <= 0 || height <= 0) {
        rafIdRef.current = requestAnimationFrame(stepAndRender);
        return;
      }

      const rawDt = lastTimeRef.current ? now - lastTimeRef.current : 16.6667;
      lastTimeRef.current = now;
      const dtScale = Math.min(Math.max(rawDt, 4), 33.33) / 16.6667;

      ctx.clearRect(0, 0, width, height);

      // --- 1. Blob reveal (idle melayang / hover mengikuti kursor) -------------
      applyRevealBlob(now, dtScale);

      // --- 2. Serpihan kaca -------------------------------------------------
      const shards = shardsRef.current;
      if (shards.length > 0 && acReadyRef.current) {
        for (let i = 0; i < shards.length; i++) {
          const shard = shards[i];

          shard.life += dtScale;
          shard.x += shard.vx * dtScale;
          shard.y += shard.vy * dtScale;
          shard.angle += shard.spin * dtScale;

          if (shard.life >= shard.maxLife) {
            const replacement = spawnShard(false);
            if (replacement) shards[i] = replacement;
            continue;
          }

          // Fade in di awal, fade out di akhir (loop halus).
          const progress = shard.life / shard.maxLife;
          let alpha = 1;
          if (progress < 0.15) alpha = progress / 0.15;
          else if (progress > 0.62) alpha = Math.max(0, 1 - (progress - 0.62) / 0.38);

          if (alpha <= 0.01) continue;

          drawShard(ctx, shard, alpha, acImage, width, height);
        }
      }

      ctx.globalAlpha = 1;
      rafIdRef.current = requestAnimationFrame(stepAndRender);
    },
    [applyRevealBlob, drawShard, spawnShard],
  );

  const ensureLoopRunning = useCallback(() => {
    if (reducedMotionRef.current || !isVisibleRef.current || !isTabActiveRef.current) {
      stopLoop();
      return;
    }
    if (rafIdRef.current === null) {
      lastTimeRef.current = performance.now();
      rafIdRef.current = requestAnimationFrame(stepAndRender);
    }
  }, [stepAndRender, stopLoop]);

  /**
   * Mengatur ukuran canvas mengikuti ukuran container + devicePixelRatio.
   */
  const resizeCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = Math.round(container.clientWidth);
    const height = Math.round(container.clientHeight);
    if (width <= 0 || height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, HERO_GLASS_CONFIG.maxDevicePixelRatio);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    sizeRef.current = { width, height };

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  /**
   * Menyinkronkan seluruh pipeline efek: ukuran canvas -> serpihan -> loop.
   * Aman dipanggil berulang kali dari mana pun (load gambar, resize,
   * pointer masuk, tab aktif kembali).
   */
  const syncSetup = useCallback(() => {
    if (reducedMotionRef.current || !acReadyRef.current) return;

    resizeCanvas();

    const { width, height } = sizeRef.current;
    if (width <= 0 || height <= 0) return;

    if (shardsRef.current.length === 0) {
      populateShards();
    }
    ensureLoopRunning();
  }, [ensureLoopRunning, populateShards, resizeCanvas]);

  const startReveal = useCallback(
    (localX: number, localY: number) => {
      pointerTargetRef.current = { x: localX, y: localY };
      revealActiveRef.current = true;
      syncSetup();
      ensureLoopRunning();
    },
    [ensureLoopRunning, syncSetup],
  );

  const endReveal = useCallback(() => {
    revealActiveRef.current = false;
    ensureLoopRunning();
  }, [ensureLoopRunning]);

  const getLocalCoords = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return { x: 0, y: 0 };
    const rect = container.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    if (!acReadyRef.current) return;
    const { x, y } = getLocalCoords(e.clientX, e.clientY);
    startReveal(x, y);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch") return;
    if (!acReadyRef.current) return;
    if (touchTimeoutRef.current !== null) {
      window.clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    const { x, y } = getLocalCoords(e.clientX, e.clientY);
    startReveal(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current) return;
    if (!acReadyRef.current) return;
    const { x, y } = getLocalCoords(e.clientX, e.clientY);
    pointerTargetRef.current = { x, y };
    if (!revealActiveRef.current && e.pointerType !== "touch") {
      startReveal(x, y);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    endReveal();
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "touch") return;
    // Tahan blob di posisi sentuhan sebentar, lalu kembali ke gerak idle.
    if (touchTimeoutRef.current !== null) {
      window.clearTimeout(touchTimeoutRef.current);
    }
    touchTimeoutRef.current = window.setTimeout(() => {
      touchTimeoutRef.current = null;
      endReveal();
    }, HERO_GLASS_CONFIG.touchHoldAfterEndMs);
  };

  /**
   * Preload gambar-gambar yang dipakai efek.
   *
   * Gambar canvas serpihan dimuat lewat `new Image()` terpisah dari <img>
   * layer reveal, dari `acSrc` yang SAMA (ditambah `v=<acImageVersion>`
   * sebagai cache-busting). Path tidak lagi ditulis keras di dalam kode.
   *
   * Jika hero-ac.png gagal dimuat -> `console.error` (bukan fallback diam-diam
   * ke hero asli) dan efek reveal + isi serpihan dimatikan.
   */
  const preloadImages = useCallback(() => {
    const acImage = acImgRef.current;
    if (!acImage) return;

    acReadyRef.current = false;

    const separator = acSrc.includes("?") ? "&" : "?";
    const shardSrc = `${acSrc}${separator}v=${HERO_GLASS_CONFIG.acImageVersion}`;
    const shardImage = new Image();
    shardImage.crossOrigin = "anonymous";
    shardImageRef.current = shardImage;

    if (DEBUG_SHARDS) {
      console.log("[HeroParticleImage] src gambar canvas:", shardSrc);
    }

    let revealLoaded = acImage.complete && acImage.naturalWidth > 0;
    let shardLoaded = false;
    const handleReady = () => {
      // Animasi baru boleh dimulai setelah kedua layer hero-ac siap.
      if (!revealLoaded || !shardLoaded) return;
      acReadyRef.current = true;
      if (reducedMotionRef.current) return;
      syncSetup();
    };

    const handleError = (imageName: string, imageSrc: string) => {
      console.error(`[HeroParticleImage] Gagal memuat ${imageName}:`, imageSrc);
      acReadyRef.current = false;
      shardsRef.current = [];
      clearCanvas();
      hideReveal();
    };

    // <img> layer reveal
    if (!revealLoaded) {
      acImage.addEventListener(
        "load",
        () => {
          revealLoaded = true;
          handleReady();
        },
        { once: true },
      );
      acImage.addEventListener(
        "error",
        () => {
          handleError("hero-ac.png untuk layer reveal", acSrc);
        },
        { once: true },
      );
    }

    // Gambar canvas
    shardImage.addEventListener(
      "load",
      () => {
        shardLoaded = true;
        handleReady();
      },
      { once: true },
    );
    shardImage.addEventListener(
      "error",
      () => {
        handleError("hero-ac.png untuk canvas serpihan", shardSrc);
      },
      { once: true },
    );
    shardImage.src = shardSrc;

    if (shardImage.complete && shardImage.naturalWidth > 0) {
      shardLoaded = true;
      handleReady();
    }
  }, [acSrc, clearCanvas, hideReveal, syncSetup]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      if (event.matches) {
        stopLoop();
        clearCanvas();
        shardsRef.current = [];
        revealActiveRef.current = false;
        // Reduced motion: tampilkan hero asli saja, tanpa reveal.
        hideReveal();
      } else {
        syncSetup();
      }
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    const handleVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
      if (document.hidden) {
        stopLoop();
      } else {
        syncSetup();
      }
    };
    isTabActiveRef.current = !document.hidden;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Hentikan animasi saat hero tidak terlihat di viewport.
    const container = containerRef.current;
    let intersectionObserver: IntersectionObserver | null = null;
    if (container && "IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isVisibleRef.current = Boolean(entry?.isIntersecting);
          if (isVisibleRef.current) {
            syncSetup();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.01 },
      );
      intersectionObserver.observe(container);
    }

    // Hitung ulang ukuran canvas saat layout berubah (debounce).
    let resizeTimer: number | null = null;
    const scheduleResize = () => {
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(() => {
        resizeTimer = null;
        syncSetup();
      }, HERO_GLASS_CONFIG.resizeDebounceMs);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (container && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(scheduleResize);
      resizeObserver.observe(container);
    }
    window.addEventListener("resize", scheduleResize);

    resizeCanvas();
    preloadImages();
    // Jaring pengaman: container mungkin belum ter-layout saat mount.
    requestAnimationFrame(syncSetup);

    return () => {
      stopLoop();
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      if (touchTimeoutRef.current !== null) window.clearTimeout(touchTimeoutRef.current);
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", scheduleResize);
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
    };
  }, [clearCanvas, hideReveal, preloadImages, resizeCanvas, stopLoop, syncSetup]);

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        touchAction: "pan-y",
      }}
    >
      {/* Layer 1 (bawah): gambar hero asli */}
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          top: HERO_LAYER_TOP_OFFSET,
          objectFit: "cover",
          objectPosition: "center left",
          display: "block",
          WebkitMaskImage: IMAGE_MASK,
          maskImage: IMAGE_MASK,
          userSelect: "none",
          ...imgStyle,
        }}
      />

      {/* Layer 2: hero-ac.png, dipotong berbentuk blob. Posisi & mask sama dengan layer 1. */}
      <img
        ref={acImgRef}
        src={acSrc}
        alt=""
        aria-hidden="true"
        crossOrigin="anonymous"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center left",
          display: "block",
          opacity: 0,
          clipPath: "none",
          WebkitClipPath: "none",
          WebkitMaskImage: IMAGE_MASK,
          maskImage: IMAGE_MASK,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* Layer 4 (paling depan): canvas serpihan kaca */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -3,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          display: "block",
        }}
      />
    </div>
  );
};
