import { PDFDocument } from 'pdf-lib';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'));
    img.src = src;
  });
}

// JPG/PNG가 아닌 포맷(webp, gif, bmp 등)은 캔버스로 PNG 변환
async function convertToPng(file: File): Promise<Uint8Array> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('캔버스를 사용할 수 없습니다.');
    }
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) {
      throw new Error('이미지 변환에 실패했습니다.');
    }
    return new Uint8Array(await blob.arrayBuffer());
  }
  finally {
    URL.revokeObjectURL(url);
  }
}

export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());

    let image;
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(bytes);
    }
    else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(bytes);
    }
    else {
      // webp, gif, bmp 등 → PNG로 변환 후 삽입
      image = await pdfDoc.embedPng(await convertToPng(file));
    }

    // 각 이미지를 원본 크기의 한 페이지로
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  return pdfDoc.save();
}
