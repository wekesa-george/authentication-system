 
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
    export let file: any = null;
    export let action: any;
    export let formData: any;
    export let btnText: string;
    export let error: any; 
    export let width: string =""; 
    export let enhance: any;
    export let enctype: string = ""
    export let disabled: boolean=false;
    export let cls: string = ''
 
</script> 

<form class="h-auto w-full flex" enctype="{enctype}" method="POST" action="?/{action}" use:enhance >
   <div class={`mx-auto  flex flex-col w-[${width?width:'90%'}] lg:w-[${width?width:'70%'}]`}>
     {#if error.isError == true}
     <div class="w-[100%] border border-red-600 dark:bg-black border-dashed bg-red-200 h-auto rounded-md text-[12px] p-2 font-bold text-red-500 mb-3">
        {error.message??'An Error occurred'}
     </div>
     {/if}
   
   {#each fields  as item }
       {#if item.type == 'text' || item.type == 'email' || item.type == 'number' || item.type == 'password' }
        <div class="mb-3 w-[100%] relative"> 
          <Form.Field {form} name="{item.name}">
            <Form.Control let:attrs>
              <Form.Label>{item.label}</Form.Label>
              <Input placeholder="{item.placeholder}" type={item.type} {...attrs} bind:value={$formData[item.name]}>
              </Input>
              {#if item.isPassword}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div class="absolute right-2 top-[22px] hover:cursor-pointer"
              on:click={()=>{
                if(item.showPassword){
                  item.showPassword = false
                  item.type = 'password'
                }else{
                  item.showPassword = true
                   item.type = 'text'
                }
              }}
              >
                <iconify-icon icon="{item.showPassword?'ph:eye-slash-duotone':'ph:eye-duotone'}" width="20"></iconify-icon>
              </div>
              {/if}
             
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
         {:else if item.type == 'file'}
         <div class="mb-3 w-[100%]"> 
          <Form.Field {form} name="{item.name}">
            <Form.Control let:attrs>
              <Form.Label>{item.label}</Form.Label>
              <div class="border border-slate-200 border-solid rounded-md p-2">
                <input
                type="file"
                placeholder="{item.placeholder}"
                name="{item.name}"
                accept="{item.accept??'image/png, image/jpeg, application/pdf'}"
                bind:files={$file}
              />
              </div>
              
            </Form.Control>
            <Form.Description>{item.description}</Form.Description>
            <Form.FieldErrors />
          </Form.Field>
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
            <TelnoField 

            valid={item.valid} closeOnClick={true} clickOutside={true} options={item.options} {form} {item} {formData} />
           </div>
           {/if}
   {/each}
 <Form.Button {disabled} class=" {cls} dark:text-white dark:hover:bg-black">
  <iconify-icon icon="line-md:loading-twotone-loop" class={disabled?'mr-3 text-[20px]':'mr-3 text-[20px] hidden'}>
  </iconify-icon>
  {btnText}
</Form.Button>
   </div>
</form>