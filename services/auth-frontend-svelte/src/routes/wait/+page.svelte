<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    import Loader from "../../components/loader.svelte";
    export let data: any;

    onMount(async ()=>{

        localStorage.setItem('clientData', JSON.stringify({
            client:data.client,
            tenancy: data.tenancy
        }));
        if(data.tenancy.name =="HCH Client Portal"){
            goto(`/login/start?continueTo=${encodeURIComponent(data.continue)}&redirect=${encodeURIComponent(data.tenantDomain.otherInfo.redirect_url)}`);
        }else{
            goto(`/login?continueTo=${encodeURIComponent(data.continue)}&redirect=${encodeURIComponent(data.tenantDomain.otherInfo.redirect_url)}`);
        }
        
    })


</script>
<div class="w-full flex flex-col items-center justify-center" style="height:300px;">
    
    <div class="p-10 mb-5 animate-pulse">
        Please wait ...
    </div>
    <Loader/>
    
</div>
