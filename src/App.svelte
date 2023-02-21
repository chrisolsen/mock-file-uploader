<script lang="ts">
  import FileUpload from "./lib/FileUpload.svelte";
  import FileUploadStatus from "./lib/FileUploadStatus.svelte";
  import S3Uploader from "./lib/s3"
  import type { Uploader } from "./lib/types";

  interface Upload {
    file: File;
    uploader: Uploader;
  }

  let uploads: Upload[] = [];
  let progressList = {};

  function uploadFile(e: CustomEvent) {
    const reader = new FileReader()
    const file = e.detail.file;

    reader.onload = (e) => {
      const url = e.target.result;  
      const uploader = new S3Uploader();
      uploads = [...uploads, { file, uploader }]
    
      uploader.oncomplete = () => {
        console.log("File upload complete")    
      }
      uploader.onprogress = (percent: number) => {
        progressList[file.name] = percent;
      }
      uploader.onabort = () => {
        console.log("Aborting upload")  
      }
      uploader.onfail = (err: string) => {
        console.log("Upload failed: ", err)
      }
      uploader.upload(url)
    }

    reader.readAsDataURL(file)  
  }

  function deleteFile(upload: Upload) {
    upload.uploader.abort()
    uploads = [...uploads].filter(u => u.file.name !== upload.file.name)
  }
</script>

<FileUpload on:fileSelected={uploadFile} />

{#each uploads as upload (upload.file.name)}
  <FileUploadStatus
    type={upload.file.type}
    size={upload.file.size}
    name={upload.file.name}
    progress={progressList[upload.file.name]}
    on:delete={() => deleteFile(upload)}
  />
{/each}

