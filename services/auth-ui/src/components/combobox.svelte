<script lang="ts">

   import * as Form from "$lib/components/ui/form/index.js";
   import * as Popover from "$lib/components/ui/popover/index.js";
   import * as Command from "$lib/components/ui/command/index.js";
   import Check from "svelte-radix/Check.svelte";
   import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import CaretSort from "svelte-radix/CaretSort.svelte";
    import { buttonVariants } from "$lib/components/ui/button";
    export let form: any;
    export let item: any;
    export let items: any;
    export let formData: any;
    import { cn } from "$lib/utils.js";
    import { tick } from "svelte";
    let open = false;
      // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>
<Form.Field {form} name="{item.name}" class="flex flex-col">
    <Popover.Root bind:open let:ids>
      <Form.Control let:attrs>
        <Form.Label>{item.label}</Form.Label>
        <Popover.Trigger
          class={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-between",
            !$formData[item.name] && "text-muted-foreground"
          )}
          role="combobox"
          {...attrs}
        >
          {items.find((f) => f.value === $formData[item.name])?.name ??
            `Select ${item.label}`}
          <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Popover.Trigger>
        <input hidden value={$formData[item.name]} name={attrs.name} />
      </Form.Control>
      <Popover.Content class="w-[300px] p-0 h-[400px] max-h-[600px] overflow-y-auto">
        <Command.Root>
          <Command.Input
            autofocus
            placeholder="Search {item.label}..."
            class="h-9"
          />
          <Command.Empty>No {item.label} found.</Command.Empty>

          <Command.Group>
            {#each items as item1}
              <Command.Item
                value={item1.value}
                onSelect={() => {
                  $formData[item.name] = item1.value;
                  closeAndFocusTrigger(ids.trigger);
                }}
              >
                {item1.name}
                <Check
                  class={cn(
                    "ml-auto h-4 w-4",
                    item.value !== $formData[item.name] && "text-transparent"
                  )}
                />
              </Command.Item>
            {/each}
            
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <Form.Description>
      {item.description}
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>