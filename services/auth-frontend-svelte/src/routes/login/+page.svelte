
<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import logo from '$lib/images/logo.png' 
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import SuperForm from "../../components/super-form.svelte";
    import { Button } from "$lib/components/ui/button";
    import SuperDebug, {
    type SuperValidated,
    type Infer,
    superForm
  } from "sveltekit-superforms";

  import { zodClient } from "sveltekit-superforms/adapters";
  import { loginEmailSchema , type LoginEmailSchema , loginTelnoSchema, type LoginTelnoSchema} from "../../schemas/login.schema";
  import { goto } from "$app/navigation";
	import { onMount } from "svelte";
export let data: any;
    let action: any;
    let fields: any = [{
        name:'email',
        label:'Email',
        type:'email',
        description:'',
        placeholder:'Enter your email'
    },{
        name:'password',
        label:'Password',
        type:'password',
        description:'',
        isPassword:true,
        placeholder:'Enter your password'
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
        name:'password',
        label:'Password',
        type:'password',
        description:'',
        isPassword:true,
        placeholder:'Enter your password'
    }];
    let btnText: string = "  Login "
    let error: any = {
        isError: false,
        message: true
    };

let width: any ='100%';
let enctype: any;
let disabled = false;
let formdata: SuperValidated<Infer<LoginEmailSchema>>;
let formdataTelno: SuperValidated<Infer<LoginEmailSchema>>;
let navigateTo : any ;

formdata = data.form
 const form = superForm(formdata, {
resetForm: false,
   validators: zodClient(loginEmailSchema),
   onResult: ({result})=>{

            
           
            if(result.status!==200){
                error.isError = true
                error.message = result.data.error
                disabled = false; 
            }else{
                
                let link = `${data.tenant.otherInfo.redirect_url}?access=${encodeURIComponent(result.data.tokenResp.accessToken)}&refresh=${encodeURIComponent(result.data.tokenResp.refreshToken)}&tenant=${data.tenancy.id}`;
                    navigateTo(link);
                
                
            }
            //setCookie('slat', result.data.tokenResp.accessToken, { path: '/' })
            //setCookie('slrt', result.data.tokenResp.refreshToken, { path: '/' })
        },

        onSubmit: (result: any)=>{
            
            disabled=true
            error.isError = false
        }
 });

 const { form: formData, enhance } = form;

 formdataTelno = data.form_telno
 const form2 = superForm(formdataTelno, {
    resetForm: false,
   validators: zodClient(loginTelnoSchema),
 });
 const { form: formData2, enhance: enhance2 } = form2;

 function getQueryPart(url:string) {
  const queryIndex = url.indexOf('?');
  if (queryIndex !== -1) {
    return url.slice(queryIndex + 1);
  }
  return '';
}
let query = ''
onMount(async()=>{
    navigateTo = (url: string)=>{
        window.location.href = url;
    }
    query = getQueryPart(window.location.href);
    
});


</script>
{#if data.client.clientId!=='hch-lms'&& data.client.clientId!=='hch-lms-client'}
<Card.Title class="mx-auto">{data.config.configValue.title}</Card.Title>
{:else}
<div class="mb-5">

</div>
{/if}

<Card.Description class="mx-auto text-slate-700 font-medium">Please provide crdentials below to proceed.</Card.Description>
<Tabs.Root value="account" class="w-[400px] mx-auto">
    <Tabs.List class="grid w-[80%] mx-auto grid-cols-2">
      <Tabs.Trigger value="account" class="gap-1">
        Email
      </Tabs.Trigger>
        {#if data.config.configValue.enableMobileLogin}
          <Tabs.Trigger value="telno">Phone</Tabs.Trigger>
        {/if}
      

    </Tabs.List>
    <Tabs.Content value="account">
        <div class="w-[80%] mx-auto flex flex-col items-center">
            <SuperForm
                {form}
                {formData}
                action={`loginEmail`}
                {fields}
                {btnText}
                {error}
                {disabled}
                {width}
                cls={data.tenancy.website == 'hchfinancial.services'?'bg-hch-700':''}
                enhance={enhance}
                {enctype}
            />
            </div>
    </Tabs.Content>
    {#if data.config.configValue.enableMobileLogin}
    <Tabs.Content value="telno">
        <div class="w-[80%] mx-auto flex flex-col items-center">
            <SuperForm
                form={form2}
                formData={formData2}
                action={`loginTelno`}
                fields={telfields}
                {btnText}
                {error}
                {width}
                cls={data.tenancy.website == 'hchfinancial.services'?'bg-hch-700':''}
                {disabled}
                enhance={enhance2}
                {enctype}
            />
            </div>
    </Tabs.Content>
    {/if}
</Tabs.Root>
<div class=" w-[70%] mx-auto font-medium text-slate-700 text-right text-[11px] mt-5 flex items-center justify-between">
    {#if data.config.configValue.enableSignUp}
       <a href="/login/sign-up?{query}" class="dark:text-white">Create account</a>
    {/if}
   
    <a href="/login/forgot-password?{query}" class="dark:text-white"> Forgot Password</a>
</div>
{#if data.config.configValue.enableSocialLogin}
<div class=" mb-2  border-t border-solid border-slate-200 mx-auto w-[60%] relative">
    <div class='absolute -top-4 bg-white dark:bg-black p-1 left-1/2'>or</div>
</div>

    {#if data.config.configValue.enabledProviders.indexOf('google')>-1 }
    
        <form method="POST" action="{data.configEnv.AUTH_API}/auth/google" class="w-[70%] mx-auto gap-3"  enctype="application/x-www-form-urlencoded">
            <input type="hidden" name="client_id" value="{data.client.clientId}" />
            <input type="hidden" name="client_secret" value="{data.client.clientSecret}" />
            <Button variant="outline"  type="submit" class="w-full gap-2">
                <iconify-icon icon="devicon:google" width="20"></iconify-icon>
                 Continue with Gmail
            </Button>
        </form>
    {/if}
    {#if data.config.configValue.enabledProviders.indexOf('microsoft')>-1 }
    <form method="POST" action="{data.configEnv.AUTH_API}/auth/azure" class="w-[70%] mx-auto gap-3"  enctype="application/x-www-form-urlencoded">
        <input type="hidden" name="client_id" value="{data.client.clientId}" />
        <input type="hidden" name="client_secret" value="{data.client.clientSecret}" />
        <Button variant="outline"  type="submit" class="w-full gap-2">
            <iconify-icon icon="logos:microsoft-icon" width="20"></iconify-icon>
            Continue with Microsoft
        </Button>
    </form>
    
    {/if}  
{/if}

{#if data.tenancy.website!=='hchfinancial.services'}
<div class="mt-5 text-[10px] text-center">
    All Rights Reserved 2024
</div>
{/if}

<style>
    a{
        color:rgb(55, 55, 55);
        font-weight: bold;
    }
</style>