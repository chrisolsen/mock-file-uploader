export class S3Uploader {
  public onprogress: (percent: number) => void;
  public onabort: () => void;
  public onfail: (err: string) => void;
  public oncomplete: () => void;
    
  upload(url: string | ArrayBuffer) {
    console.log("Uploading: ", url)  

    let progress = 0;

    const intervalId = setInterval(() => {
      progress += Math.random() * 10;
      this.onprogress(progress);
      if (progress >= 100) {
        this.oncomplete();
        clearInterval(intervalId)
      }
    }, 200)    
  }
}

export default S3Uploader;

