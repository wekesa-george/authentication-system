
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

import { zodClient } from "sveltekit-superforms/adapters";
import { newPwdSchema } from "../../../schemas/password.schema";
	import { onMount } from "svelte";


export let data: any;
    let action: any ='setNewPassword';
    let disabled = false;
    let fields: any = [{
        name:'password',
        label:'New Password',
        type:'password',
        isPassword:true,
        description:'',
        placeholder:'Enter new password'
    },{
        name:'confirm_password',
        label:'Confirm New Password',
        type:'password',
        description:'',
        isPassword:true,
        placeholder:'Confirm new password'
    }];

    
    let btnText: string = "Continue"
    let error: any = {
        isError: false,
        message: true
    };
    let navigateTo: any;
    let width: any ='100%';
    let enctype: any;
    
    type PasswordSchema = typeof newPwdSchema;
let formdata: SuperValidated<Infer<PasswordSchema>>;
    function getQueryPart(url:string) {
  const queryIndex = url.indexOf('?');
  if (queryIndex !== -1) {
    return url.slice(queryIndex + 1);
  }
  return '';
}
let query = ''
formdata = data.form
 const form = superForm(formdata, {
   validators: zodClient(newPwdSchema),
   onResult: ({result}:{result: any})=>{

        disabled = false; 

        if(result.status!==200){
            error.isError = true
            error.message = result.data.error
        }else{
            navigateTo(`/login?${query}&showMessage=1`);
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
onMount(()=>{
    navigateTo = (url: string)=>{
        window.location.href = url;
    }
    query = getQueryPart(window.location.href);
});
</script>

{#if data.client.clientId!=='hch-lms' && data.client.clientId!=='hch-lms-client'}
<Card.Title class="mx-auto">Confirmation</Card.Title>
{:else}
<div class="mb-5">

</div>
<Card.Title class="mx-auto text-[21px]">Confirmation</Card.Title>
{/if}
<Card.Description class="mx-auto">Please provide a new password below</Card.Description>
<div class="w-[80%] mx-auto flex flex-col items-center">
    <SuperForm
        {form}
        {formData}
        {action}
        {fields}
        {disabled}
        {btnText}
        {error}
        {width}
        cls={data.tenancy.website == 'hchfinancial.services'?'bg-hch-700':''}
        enhance={enhance}
        {enctype}
    /> 
    </div>
<div class="mx-auto">
    <Button size="icon" variant="outline" class="text-[12px] rounded-full" href="/login/forgot-password"> 
        <DoubleArrowLeft
        class="w-[15px]"
        />
    </Button>
</div>
<div class="mt-5 text-[10px] text-center">
    All Rights Reserved 2024
</div>