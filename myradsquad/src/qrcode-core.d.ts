declare module 'qrcode/lib/core/qrcode' {
  type QRCodeModel = {
    modules: { size: number; data: Uint8Array | number[] };
  };
  export function create(
    text: string,
    options?: { errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' },
  ): QRCodeModel;
}
