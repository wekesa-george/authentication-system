<script lang="ts">
    import logo from "$lib/images/ll.svg"
    import { Button } from "$lib/components/ui/button";
	import { onMount } from "svelte";
    function getQueryPart(url:string) {
        const queryIndex = url.indexOf('?');
        if (queryIndex !== -1) {
            return url.slice(queryIndex + 1);
        }
        return '';
     }
     let query: any;
     let navigateTo: any;
     onMount(async()=>{

        navigateTo = (url: string)=>{
            window.location.href = url;
        }

        query = getQueryPart(window.location.href);

    });
</script> 
<div class="flex flex-col items-center justify-center min-h-[350px] ">
    
    <div class="font-bold" style="margin-top:50px; margin-bottom:40px">
        Please login or create an account to proceed.
    </div>
    <img src="{logo}" style="width:200px" alt=""> 
    <div class="flex items-center gap-2" style="margin-top:40px">
        <Button  href="/login?{query}" class="w-[100px]  border-0 bg-hch-700  text-white gap-2" style="width:160px;">
            <iconify-icon icon="material-symbols-light:login-rounded" width="24" height="24"></iconify-icon>
            Sign In
        </Button>
        <Button   href="/login/sign-up?{query}" style="width:160px;" class="border-0 bg-hch-700 gap-2 border-solid text-white ">
            <iconify-icon icon="mdi:register" width="24" height="24"></iconify-icon>
            Register
        </Button>
    </div>
</div>