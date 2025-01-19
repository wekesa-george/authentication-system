
<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import logo from '$lib/images/logo.png' 
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import SuperForm from "../../../components/super-form.svelte";
    import { Button } from "$lib/components/ui/button";
    import { DoubleArrowLeft } from "svelte-radix";
    import { applyAction } from "$app/forms";
    import SuperDebug, {
    type SuperValidated,
    type Infer,
    superForm
  } from "sveltekit-superforms";
import type { PageData } from './$types.js';
import { zodClient } from "sveltekit-superforms/adapters";
import { email , type Email , telno, type Telno} from "../../../schemas/forgot-password.schema";
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
    let action: any;
    let fields: any = [{
        name:'email',
        label:'Email',
        type:'email',
        description:'',
        placeholder:'Enter your email'
    }];

    let telfields: any = [{
        name:'telno',
        label:'Phone Number',
        type:'telno',
        description:'',
        options:{ 
            format:'national'
        },
        placeholder:''
    }];
    let btnText: string = "Get recovery token"
    let error: any = {
        isError: false,
        message: true
    };
    let width: any ='100%';
    let enctype: any;
let disabled=false
let navigateTo: (url: string)=>void;
let formdata: SuperValidated<Infer<Email>>;
let formdataTelno: SuperValidated<Infer<Telno>>;
formdata = data.form
 const form = superForm(formdata, {
   validators: zodClient(email),
   onResult: ({result})=>{

disabled = false; 

if(result.status!==200){
    error.isError = true
    error.message = result.data.error
}else{
    navigateTo(`/login/activation?${query}&token=${result.data.tokenResp.activation_token}&email=${encodeURIComponent(result.data.tokenResp.email)}&type=forgot`);
}
//setCookie('slat', result.data.tokenResp.accessToken, { path: '/' })
//setCookie('slrt', result.data.tokenResp.refreshToken, { path: '/' })
},

onSubmit: ({formData})=>{
    
    disabled=true
    error.isError = false
    return async ({ result }:{result: any}) => {
    // `result` is an `ActionResult` object
    await applyAction(result);
};
    
}
 });
 const { form: formData, enhance } = form;

 formdataTelno = data.form_telno
 const form2 = superForm(formdataTelno, {
   validators: zodClient(telno),
 });
 const { form: formData2, enhance: enhance2 } = form2;
 onMount(async ()=>{
    navigateTo = (url: string)=>{
        window.location.href = url;
    }
    query = getQueryPart(window.location.href);
 });
</script>

{#if data.client.clientId!=='hch-lms'&&data.client.clientId!=='hch-lms-client'}
<Card.Title class="mx-auto">Forgot Password</Card.Title>
{:else}
<div class="mb-5">

</div>
<Card.Title class="mx-auto text-[21px]">Forgot Password</Card.Title>
{/if}
<Card.Description class="mx-auto">Please provide email or phone number .</Card.Description>
<Tabs.Root value="account" class="w-[400px] mx-auto">
    <Tabs.List class="grid w-[80%] mx-auto grid-cols-2">
      <Tabs.Trigger value="account" class="gap-1">
        Email</Tabs.Trigger>
        {#if data.config.configValue.enableMobileLogin}
            <Tabs.Trigger value="telno">Phone</Tabs.Trigger>
        {/if}
    </Tabs.List>
    <Tabs.Content value="account">
        <div class="w-[80%] mx-auto flex flex-col items-center">
            <SuperForm
                {form}
                {formData}
                {disabled}
                action={`forgotPwdEmail`}
                {fields}
                {btnText}
                {error}
                {width}
                cls={data.tenancy.website == 'hchfinancial.services'?'bg-hch-700':''}
                enhance={enhance}
                {enctype}
            />
            </div>
    </Tabs.Content>
    <Tabs.Content value="telno">
        <div class="w-[80%] mx-auto flex flex-col items-center">
            <SuperForm
                form={form2}
                formData={formData2}
                action={`forgotPwdTelno`}
                fields={telfields}
                {btnText}
                {disabled}
                {error}
                cls={data.tenancy.website == 'hchfinancial.services'?'bg-hch-700':''}
                {width}
                enhance={enhance2}
                {enctype}
            />
            </div>
    </Tabs.Content>
</Tabs.Root>
<div class="mx-auto">
    <Button size="icon" variant="outline" class="text-[12px] rounded-full" href="/login?{query}"> 
        <DoubleArrowLeft
        class="w-[15px]"
        />
    </Button>
</div>
<div class="mt-5 text-[10px] text-center">
    All Rights Reserved 2024
</div>