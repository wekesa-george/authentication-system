
<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import logo from '$lib/images/logo.png' 
    import { Button } from "$lib/components/ui/button";
    import Sun from "svelte-radix/Sun.svelte";
    import Moon from "svelte-radix/Moon.svelte";
    
  import { toggleMode } from "mode-watcher";
</script>
   
  <div class="w-full min-h-screen flex items-center justify-center relative bg-stone-50 dark:bg-black">
    <div class="w-screen fixed top-2 left-2">
        <Button on:click={toggleMode} variant="outline" size="icon">
            <Sun
              class="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span class="sr-only">Toggle theme</span>
          </Button>
    </div>
    <Card.Root class="w-[580px] mt-5 mb-5">
        <Card.Header>
            <img src="{logo}" class="w-[100px] mx-auto" alt="" srcset="" style="width:100px">
        </Card.Header>
        <Card.Content class="grid gap-4 mt-0">
           <slot/>
        </Card.Content>
        <Card.Footer>
        
        </Card.Footer>
    </Card.Root>
  </div>