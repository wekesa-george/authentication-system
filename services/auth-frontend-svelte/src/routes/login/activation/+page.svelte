
<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import logo from '$lib/images/logo.png' 
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import SuperForm from "../../../components/super-form.svelte";
    import { Button } from "$lib/components/ui/button";
    import { DoubleArrowLeft } from "svelte-radix";
    import SuperDebug, {
    type SuperValidated,
    type Infer,
    superForm
  } from "sveltekit-superforms";
  import type { PageData } from './$types.js';
  import { zodClient } from "sveltekit-superforms/adapters";
  import { type ActivationSchema, activationSchema } from "../../../schemas/activation.schema";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
	import { onMount } from "svelte";

  
export let data: any;


function getQueryPart(url:string) {
  const queryIndex = url.indexOf('?');
  if (queryIndex !== -1) {
    return url.slice(queryIndex + 1);
  }
  return '';
}
let query = ''

let activation_code = $page.url.searchParams.get('activation_code')||'';
    let action: any;
    let fields: any = [{
        name:'token',
        label:'Activation Token',
        type:'password',
        isPassword:true,
        description:'Activation Token',
        placeholder:'Enter activation/verification token'
    }];

    
    let btnText: string = "Continue"
    let error: any = {
        isError: false,
        message: true
    };
    let width: any ='100%';
    let enctype: any;
let disabled = false;
let formdata: SuperValidated<Infer<ActivationSchema>>;
let navigateTo: any;
formdata = data.form
 const form = superForm(formdata, {
   validators: zodClient(activationSchema),
   onResult: ({result}:{result: any})=>{

disabled = false; 

if(result.status!==200){
    error.isError = true
    error.message = result.data.error
}else{
    navigateTo(`/login/confirmation?${query}&token=${result.data.tokenResp.password_token}`);
}
//setCookie('slat', result.data.tokenResp.accessToken, { path: '/' })
//setCookie('slrt', result.data.tokenResp.refreshToken, { path: '/' })
},

onSubmit: (result)=>{
    
    disabled=true
    error.isError = false
}
 });
 const { form: formData, enhance } = form;

onMount(async ()=>{
    query = getQueryPart(window.location.href);
    navigateTo = (url: string)=>{
        window.location.href = url;
    }
});
 action='activateAccount'
</script>

{#if data.client.clientId!=='hch-lms'&&data.client.clientId!=='hch-lms-client'}
<Card.Title class="mx-auto">Verification</Card.Title>
{:else}
<div class="mb-5">

</div>
<Card.Title class="mx-auto text-[21px]">Verification</Card.Title>
{/if}
<Card.Description class="mx-auto">Please provide the token you have received on your email.</Card.Description>
<div class="w-[80%] mx-auto flex flex-col items-center">
    <SuperForm
        {form}
        {formData}
        {action}
        {disabled}
        {fields}
        {btnText}
        {error}
        cls={data.tenancy.website == 'hchfinancial.services'?'bg-hch-700':''}
        {width}
        enhance={enhance}
        {enctype}
    />
    </div>
<div class="mx-auto">
    
    <Button size="icon" variant="outline" class="text-[12px] rounded-full" href="/login/sign-up?{query}"> 
        <DoubleArrowLeft
        class="w-[15px]"
        />
    </Button>
</div>
<div class="mt-5 text-[10px] text-center">
    All Rights Reserved 2024
</div>