
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
  import { signUpEmailSchema , type SignUpSchema , signUpTelnoSchema, type SignUpTelnoSchema} from "../../../schemas/sign-up.schema";
  import { onMount } from "svelte";
	import { applyAction } from "$app/forms";

export let data: PageData;
function getQueryPart(url:string) {
  const queryIndex = url.indexOf('?');
  if (queryIndex !== -1) {
    return url.slice(queryIndex + 1);
  }
  return '';
}
let query = ''

    let action: string = 'signUp';
    let fields: any = [{
        name:'email',
        label:'Email',
        type:'email',
        description:'',
        placeholder:'Enter your email'
    },{
        name:'fullname',
        label:'Full Name',
        type:'text',
        description:'',
        placeholder:'Enter your Full Name'
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
    },{
        name:'fullname',
        label:'Full Name',
        type:'text',
        description:'',
        placeholder:'Enter your Full Name'
    }];
    let btnText: string = "Create Account"
    let error: any = {
        isError: false,
        message: true
    };
    let width: any ='100%';
    let enctype: any;
let disabled = false;
let formdata: SuperValidated<Infer<SignUpSchema>>;
let formdataTelno: SuperValidated<Infer<SignUpTelnoSchema>>;
formdata = data.form
 const form = superForm(formdata, {
   validators: zodClient(signUpEmailSchema),
   onResult: ({result})=>{

                    disabled = false; 

                    if(result.status!==200){
                        error.isError = true
                        error.message = result.data.error
                    }else{
                        navigateTo(`/login/activation?${query}&token=${result.data.tokenResp.activation_token}&email=${encodeURIComponent(result.data.tokenResp.email)}`);
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
   validators: zodClient(signUpTelnoSchema),
   onResult: ({result})=>{

disabled = false; 

if(result.status!==200){
    error.isError = true
    error.message = result.data.error
}else{
    navigateTo(`/login/activation?${query}&token=${result.data.tokenResp.activation_token}&email=${encodeURIComponent(result.data.tokenResp.email)}`);
}
//setCookie('slat', result.data.tokenResp.accessToken, { path: '/' })
//setCookie('slrt', result.data.tokenResp.refreshToken, { path: '/' })
},

onSubmit: ({formData})=>{
    console.log('Submitted Data:', Object.fromEntries(formData));
disabled=true
error.isError = false;

}
 });
 const { form: formData2, enhance: enhance2 } = form2;

let navigateTo: (url: string)=>void;

 onMount(async()=>{
    navigateTo = (url: string)=>{
        window.location.href = url;
    }
    query = getQueryPart(window.location.href);
 });
</script>
{#if data.config.configValue.enableSignUp}

{#if data.tenancy.name!=='HCH Business Online' && data.tenancy.name!=='HCH Client Portal'}
<Card.Title class="mx-auto">Create Account</Card.Title>
{:else} 
<div class="mb-5">

</div>
<Card.Title class="mx-auto text-[21px]">Create Account</Card.Title>
{/if}
<Card.Description class="mx-auto">Create account with email or Phone number</Card.Description>
<Tabs.Root value="account" class="w-[400px] mx-auto">
    <Tabs.List class="grid w-[80%] mx-auto grid-cols-2">
      <Tabs.Trigger value="account" class="gap-1">
        Email</Tabs.Trigger>
        {#if data.config.configValue.enableMobileSignUp }
        <Tabs.Trigger value="telno">Phone</Tabs.Trigger>
        {/if}
      
    </Tabs.List>
    <Tabs.Content value="account">
        <div class="w-[80%] mx-auto flex flex-col items-center">
            <SuperForm
                {form}
                {formData}
                {action}
                {fields}
                {btnText}
                {disabled}
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
                action={`signUpPhone`}
                fields={telfields}
                {btnText}
                {error}
                {width}
                {disabled}
                cls={data.tenancy.website == 'hchfinancial.services'?'bg-hch-700':''}
                enhance={enhance2}
                {enctype}
            />
            <SuperDebug data={$formData2} />
            </div>
    </Tabs.Content>
</Tabs.Root>
<div class="mx-auto flex flex-col">
   
    <Button size="icon" variant="outline" class="text-[12px] rounded-full" href="/login?{query}"> 
        <DoubleArrowLeft
        class="w-[15px]"
        />
    </Button>
</div>
{:else}
<Card.Title class="mx-auto">Action Not Permitted</Card.Title>
<Card.Description class="mx-auto">Not Permitted</Card.Description>
<div class="mx-auto">
<Button  class="text-[12px]" href="/">
    Go back home
</Button>
</div>
{/if}
<div class="mt-5 text-[10px] text-center">
    All Rights Reserved 2024
</div>