<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  let inputFiles: FileList;
  let fileInput: HTMLInputElement;

  const dispatch = createEventDispatcher();

  onMount(() => {
    fileInput.addEventListener("change", () => {
      [...inputFiles].forEach(dispatchFile)
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
          dispatchFile(item.getAsFile())
        }
      });
    } else {
      [...e.dataTransfer.files].forEach(dispatchFile)
    }
  }

  function dispatchFile(file: File) {
    dispatch("fileSelected", {file})
  }

  function openFilePicker() {
    fileInput.click()
  }
</script>

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

  input[type="file"] {
    display: none;
  }
</style>
