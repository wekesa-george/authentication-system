<script lang="ts">
	import '../app.pcss';
	import { Toaster } from "$lib/components/ui/sonner";
	import { ModeWatcher } from "mode-watcher";
	import "carbon-components-svelte/css/white.css";
	import 'iconify-icon'
	import { onMount } from 'svelte';
  import { Fireworks } from 'fireworks-js'
	export let data;

	onMount(() => {
    // Function to change the favicon
    const changeFavicon = (href:any) => {
      const link = document.createElement('link');
      const oldLink = document.getElementById('dynamic-favicon');
      link.id = 'dynamic-favicon';
      link.rel = 'shortcut icon';
      link.href = href;
      if (oldLink) {
        document.head.removeChild(oldLink);
      }
      document.head.appendChild(link);
    };

    // Example: Change favicon after 3 seconds
    setTimeout(() => {
     
      changeFavicon(data.config.configValue.faviconUrl);
    }, 3000);

  });

</script>
<ModeWatcher  />
  <Toaster />
   <div class="w-full h-full" id="fws">
    <slot />
   </div>


<svelte:head>
	<title>
		{data.tenancy.name}
	</title>
	<link rel="icon" type="image/png" href="{data.config.configValue.faviconUrl}">
</svelte:head>