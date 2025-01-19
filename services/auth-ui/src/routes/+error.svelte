<script>
    import error from "$lib/images/error.png"
import Button from "$lib/components/ui/button/button.svelte";
</script>
<div class="w-full min-h-screen flex items-center flex-col justify-center">
    <img src="{error}" class="w-[400px]" alt="">
    <Button href="/"> 
        Go Home
    </Button>
</div>