<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let name: string;
  export let type: string;
  export let size: number;
  export let progress: number = -1;

  const dispatch = createEventDispatcher();

  function dispatchDelete() {
    dispatch("delete")
  }
</script>

<div class="root">
  <div>
    {name}
    <button on:click={dispatchDelete}>X</button>
  </div>
  <em>{type} {size}B</em>

  {#if progress >= 0}
    <progress value={progress} max="100" />
  {/if}
</div>

<style>
  .root {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 2px;
    margin: 0.5rem 0;
  }

  em {
    color: #999;
    font-size: 0.7em;
  }

  progress {
    width: 100%;
    display: block;
  }
</style>
