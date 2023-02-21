export interface Uploader {
  upload: (url: string | ArrayBuffer) => void;
  abort: () => void;
}