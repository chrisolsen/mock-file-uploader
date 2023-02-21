<script lang="ts">
  import { onMount } from "svelte";
  import FileUploadStatus from "./FileUploadStatus.svelte";
  import S3Uploader from "./s3"

  let inputFiles: FileList;
  let fileInput: HTMLInputElement;
  let progressTable = {};
  let droppedFiles = []

  // Service credentials
  // export let S3Bucket: string;
  // export let S3PublicKey: string;

  onMount(() => {
    fileInput.addEventListener("change", () => {
      uploadFiles([...inputFiles])
    })
  })

  function onDrag(e: DragEvent) {
    e.preventDefault();
    return false;
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.items) {
      [...e.dataTransfer.items].forEach((item) => {
        if (item.kind === 'file') {
          droppedFiles.push(item.getAsFile())
        }
      });
      uploadFiles(droppedFiles);
    } else {
      droppedFiles = [...e.dataTransfer.files];
      uploadFiles(droppedFiles);
    }
  }

  function uploadFiles(files: File[]) {
    files.forEach(file => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const url = e.target.result;  
        const uploader = new S3Uploader();
        uploader.oncomplete = () => {
          console.log("File upload complete")    
        }
        uploader.onprogress = (percent: number) => {
          progressTable[file.name] = percent;
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
    })    
  }

  function openFilePicker() {
    fileInput.click()
  }
</script>

<style>
  .drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 3rem;
    border: 1px solid #ccc;
    background: #fafafa;
    text-align: center;
    cursor: pointer;
  }

  input[type=file] {
    display: none;
  }

</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
  class="drop"
  on:click={openFilePicker}
  on:drop={onDrop} 
  on:dragover={onDrag} 
>
  <div>Drag n' Drop</div>
  <div>or</div>
  <div>Click to select file</div>
  <input type="file" bind:this={fileInput} bind:files={inputFiles} multiple />
</div>


{#if inputFiles}
  input files
  {#each inputFiles as file}
    <FileUploadStatus type={file.type} size={file.size} name={file.name} progress={progressTable[file.name]} />
  {/each}
{/if}

{#each droppedFiles as file}
  <FileUploadStatus type={file.type} size={file.size} name={file.name} progress={progressTable[file.name]} />
{/each}

