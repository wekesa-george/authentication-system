<script lang="ts">

    import * as Form from "$lib/components/ui/form";
    import * as Select from "$lib/components/ui/select";
    export let form: any;
    export let item: any;
    import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>
<Form.Field {form} name="{item.name}">
    <Form.Control let:attrs>
      <Form.Label>{item.label}</Form.Label>
      <Textarea
        {...attrs}
        placeholder="{item.placeholder}"
        class="resize-none"
        bind:value={$form[item.name]}
      />
      <Form.Description>
       {item.description}
      </Form.Description>
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>