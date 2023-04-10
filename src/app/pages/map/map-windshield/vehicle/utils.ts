export function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

export function getImage<T>(imgs: T[], value: number, min: number, max: number): T {
  const v = (value - min) / (max - min);
  const u = Math.round(v * imgs.length);
  return imgs[u - 1];
}

