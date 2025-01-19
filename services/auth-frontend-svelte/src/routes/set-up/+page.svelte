
<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import logo from '$lib/images/logo.png' 
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import SuperForm from "../../components/super-form.svelte";
    import { Button } from "$lib/components/ui/button";
    import SuperDebug, {
    type SuperValidated,
    type Infer,
    superForm,
    fileProxy
  } from "sveltekit-superforms";

  import { zodClient } from "sveltekit-superforms/adapters";
  import { configSchema , type ConfigSchema } from "../../schemas/configs.schema";
  export let data: any;
         let action: any;

let telfields: any = [{
        name:'company_name',
        label:'Company Name',
        type:'text',
        description:'',
        placeholder:'Enter company name'
    },{
        name:'company_logo',
        label:'Company Logo',
        type:'file',
        description:'',
        placeholder:'Select File'
    },{
        name:'country',
        label:'Country',
        type:'combobox',
        description:'',
        items:data.countries,
        placeholder:'-- select country --'
    },{
        name:'currency',
        label:'Base Currency',
        type:'combobox',
        description:'',
        items:data.currencies,
        placeholder:'-- select currency --'
    },{
        name:'timezone',
        label:'Timezone',
        type:'combobox',
        description:'',
        items:data.timezones,
        placeholder:'-- select timezone --'
    }];
    let btnText: string = "Submit"
    let error: any = {
        isError: false,
        message: true
    };
    let width: any ='100%';
    let enctype: any ='multipart/form-data';

let formdata: SuperValidated<Infer<ConfigSchema>>;

formdata = data.form
 const form = superForm(formdata, {
   validators: zodClient(configSchema),
 });
 const { form: formData, enhance } = form;
 const file = fileProxy(form, 'company_logo')
</script>
<Card.Title class="mx-auto">Welcome  Mr Wekesa George</Card.Title>
<Card.Description class="mx-auto">
    Please provide the details below to set up your account
</Card.Description>
<div class="w-[70%] mx-auto flex flex-col items-center">
    <SuperForm
        {form}
        {formData}
        {action}
        fields={telfields}
        {btnText}
        {error}
        {width}
        {enhance}
        {enctype}
        {file}
    />
    </div>


<div class="mt-5 text-[10px] text-center">
    All Rights Reserved 2024
</div>