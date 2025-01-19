<script lang="ts">

    import * as Form from "$lib/components/ui/form";
    import * as Select from "$lib/components/ui/select";
    export let form: any;
    export let item: any;
    export let items: any;
    export let formData: any;
</script>
<Form.Field {form} name="{item.name}">
    <Form.Control let:attrs>
      <Form.Label>{item.label}</Form.Label>
      <Select.Root
        
        onSelectedChange={(v) => {
          v && ($formData[item.name] = v.value);
        }}
      >
        <Select.Trigger {...attrs}>
          <Select.Value placeholder="{item.placeholder}" />
        </Select.Trigger>
        <Select.Content>
            {#each items as listItem}
             <Select.Item value="{listItem.value}" label="{listItem.display}" />
            {/each}
          
        </Select.Content>
      </Select.Root>
      <input hidden bind:value={$formData[item.name]} name={attrs.name} />
    </Form.Control>
    <Form.Description>
      {item.description}
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>