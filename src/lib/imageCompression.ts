import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

export async function compressAndConvertToWebP(
  file: File,
  customOptions?: CompressionOptions
): Promise<File> {
  const defaultOptions: CompressionOptions = {
    maxSizeMB: 0.3, // Compress to ~300KB max
    maxWidthOrHeight: 1600, // Max dimensions 1600px
    useWebWorker: true,
    fileType: 'image/webp',
  };

  const options = { ...defaultOptions, ...customOptions };

  try {
    const compressedBlob = await imageCompression(file, options);
    // Convert blob back to a File with .webp extension
    const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
    return new File([compressedBlob], newFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    return file; // Return original if compression fails
  }
}
