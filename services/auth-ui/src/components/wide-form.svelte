 
 <script lang="ts">
  
    import 'iconify-icon'
    import CurrencyInput from "./currency.svelte";
    import { Input } from "$lib/components/ui/input";
    import * as Form from "$lib/components/ui/form";
    import Date from "./date-picker.svelte"
    import Combobox from './combobox.svelte';
    import TextArea from './text-area.svelte';
    import TelnoField from './telno-field.svelte';
    import Select from './select.svelte';
    export let fields: any;
    export let form: any;
    export let action: any;
    export let formData: any;
    export let btnText: string;
    export let error: any; 
    export let width: string =""; 
    export let enhance: any;
    export let enctype: string = ""
  
</script> 

<form class="h-auto w-full " enctype="{enctype}" method="POST" action="?/{action}" use:enhance >
   <div class={`mx-auto gap-2  grid grid-cols-2 w-[${width?width:'100%'}] lg:w-[${width?width:'100%'}]`}>
     {#if error.isError == true}
     <div class="w-[100%] border border-red-600 bg-red-200 h-auto rounded-md text-[12px] p-1 mb-3">
        {error.message}
     </div>
     {/if}
   
   {#each fields  as item }
       {#if item.type == 'text' || item.type == 'email' || item.type == 'number' || item.type == 'password' || item.type == 'file' }
        <div class="mb-3 w-[100%]"> 
          <Form.Field {form} name="{item.name}">
            <Form.Control let:attrs>
              <Form.Label>{item.label}</Form.Label>
              <Input placeholder="{item.placeholder}" type={item.type} {...attrs} bind:value={$formData[item.name]}>
              </Input>
            </Form.Control>
            <Form.Description>{item.description}</Form.Description>
            <Form.FieldErrors />
          </Form.Field>
        </div>
        {:else if item.type == 'date'}
          <div class="w-[100%] flex flex-col mb-3">
          <Date {form} {item}/>
          </div>
        {:else if item.type == 'select'}
           <div class="mb-3">
               <Select {form} {formData} {item} items={item.items}/>
           </div>
           {:else if item.type == 'combobox'}
          <div class="w-full">
            <Combobox {form} {formData} {item} items={item.items}/>
          </div>
         {:else if item.type == 'checkbox'}
           <div>
               
           </div>
         {:else if item.type == 'radio'}
           <div>
               
           </div>
           {:else if item.type == 'money'}
           <div class="mb-2 p-2 {item.hidden?'hidden':''}">
            
          </div>
         {:else if item.type == 'textarea'}
           <div class="mb-2 w-[100%]">
            <TextArea {form} {item}/>
           </div>
           
           {:else if item.type == 'telno'}
           <div class="mb-2 w-[100%]">
            <TelnoField valid={item.valid} closeOnClick={true} clickOutside={true} options={item.options} {form} {item} {formData} />
           </div>
           {/if}
   {/each}
 <Form.Button>{btnText}</Form.Button>
   </div>
</form>