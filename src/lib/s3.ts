import type { Uploader } from "./types";

export class S3Uploader implements Uploader {
  public onprogress: (percent: number) => void;
  public onabort: () => void;
  public onfail: (err: string) => void;
  public oncomplete: () => void;

  private processId: NodeJS.Timer;
    
  upload(url: string | ArrayBuffer) {
    let progress = 0;

    this.processId = setInterval(() => {
      progress += Math.random() * 10;
      this.onprogress(progress);
      if (progress >= 100) {
        this.oncomplete();
       clearInterval(this.processId)
      }
    }, 200)    
  }

  abort() {
    clearInterval(this.processId)
    this.onabort()
  }
}

export default S3Uploader;

