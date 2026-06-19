// UTF-8 기준으로 텍스트 ↔ HEX 변환 (한글·이모지 지원)

export function textToHex(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');
}

export function hexToText(hex: string): string {
  // 0x 접두사·공백·구분자 제거, 16진수 문자만 남김
  const clean = hex.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '');
  const even = clean.slice(0, clean.length - (clean.length % 2));

  const bytes = new Uint8Array(even.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(even.slice(i * 2, i * 2 + 2), 16);
  }

  return new TextDecoder().decode(bytes);
}
