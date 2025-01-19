
<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import bg from '$lib/images/bg.svg' 
    import HchChristmas from "../../components/hch-christmas.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Sun from "svelte-radix/Sun.svelte";
    import Christ from "$lib/images/hch-christmas.png"
    import Moon from "svelte-radix/Moon.svelte";
    import { toggleMode } from "mode-watcher";
    export let data;
    let {tenancy,config} = data;
    function isCurrentMonthDecember() {
    const currentMonth = new Date().getMonth(); // getMonth() returns 0 for January, 1 for February, ..., 11 for December
    return currentMonth === 11; // 11 corresponds to December
}

let isDecember = isCurrentMonthDecember();
</script>
   {#if tenancy.name!=="HCH Business Online" && tenancy.name !=="HCH Client Portal" }
   <div class="w-screen fixed top-2 left-2">
    <Button on:click={toggleMode} variant="outline" size="icon">
        <Sun
          class="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-50"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
</div>
   <div class="w-full min-h-screen flex items-start justify-center relative dark:bg-slate-800  bg-slate-100 "
   style="{tenancy.name=='Propati'?`background-image: url(${bg});`:''} background-size:500px"
   >
     
     <Card.Root class="w-[480px] mt-5 mb-5 dark:bg-slate-900 {tenancy.name=='Propati'?'border border-solid border-slate-400 dark:border-slate-500 shadow-lg shadow-slate-300 dark:shadow-black':''} ">
         <Card.Header>
             <img src="{config.configValue.logoUrl??''}" class="w-[100px] mx-auto" alt="" srcset="">
         </Card.Header>
         <Card.Content class="grid gap-4 mt-0">
            <slot/>
         </Card.Content>
         <Card.Footer>
         
         </Card.Footer>
     </Card.Root>
   </div>
    {:else}
    <div class="w-full min-h-screen flex items-center justify-center relative dark:from-slate-950 dark:via-slate-800 dark:to-hch-950 bg-gradient-to-b from-hch-800 via-hch-600 to-hch-400"
    style="{tenancy.name=='Propati'?`background-image: url(${bg});`:''} background-size:500px"
    >
      <div class="w-screen fixed top-2 left-2">
          <Button on:click={toggleMode} variant="outline" size="icon">
              <Sun
                class="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              />
              <Moon
                class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-50"
              />
              <span class="sr-only">Toggle theme</span>
            </Button>
      </div>

      <div class="flex flex-col items-center">
        <div class="h-[60px]">

        </div>
        <img src="{!isDecember?(config.configValue.logoUrl??''):Christ}" class="{isDecember?'w-[100px] mx-auto ml-[45%]':'w-[400px] mx-auto'}" alt="" srcset="">
        {#if isDecember}
        <HchChristmas/>
        {/if}
    
        
        <Card.Root class="w-[480px] mt-5 mb-5 dark:bg-slate-900 border dark:border dark:border-hch-900 border-b-4 dark:border-b-4 border-solid   {isDecember?'border-red-500':'border-b-red-500'} dark:border-b-hch-500 min-h-[400px] z-[100000] ">
            
            <Card.Content class="grid gap-4 mt-0">
               <slot/>
            </Card.Content>
            <Card.Footer>
            
            </Card.Footer>
        </Card.Root>
        <div class="text-white text-[11px] font-bold mt-5 w-[100%] text-center">HCH Financial Services is a licensed financial services provider regulated by the Uganda Microfinance Regulatory Authority(UMRA)</div>
        <div class="text-white text-[10px] font-medium mt-7 w-[100%] text-center">© 2024 HCH Financial Services. All rights reserved</div>
        <div class="h-[60px]">

        </div>
      </div>
      
    </div>
   {/if}
 