import * as sharp from 'sharp';

export interface IShape {
  width: number;
  height: number;
}

export function resizedImage(image: Buffer, size: IShape = { width: 500, height: 5000 }) {
  return sharp(image)
    .resize(size.width, size.height, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .withMetadata()
    .jpeg({ quality: 80 })
    .toBuffer();
}
