<script lang="ts">
       import * as Form from "$lib/components/ui/form";
       import * as Popover from "$lib/components/ui/popover/index.js";
       export let form: any;
       export let item: any;
       import {
            Button,
            buttonVariants
        } from "$lib/components/ui/button/index.js";
       import {
        type DateValue,
        DateFormatter,
        getLocalTimeZone,
        parseDate,
        CalendarDate,
        today
    } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";
    const df = new DateFormatter("en-US", {
    dateStyle: "long"
  });
    let value: DateValue | undefined;
    $: value = $form[item.name] ? parseDate($form[item.name]) : undefined
    let placeholder: DateValue = today(getLocalTimeZone());
</script>
<Form.Field {form} name="dob" class="flex flex-col">
    <Form.Control let:attrs>
      <Form.Label>Date of birth</Form.Label>
      <Popover.Root>
        <Popover.Trigger
          {...attrs}
          class={cn(
            buttonVariants({ variant: "outline" }),
            "w-[280px] justify-start pl-4 text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
          <iconify-icon icon="solar:calendar-broken" class="ml-auto h-4 w-4 opacity-50"></iconify-icon>
        </Popover.Trigger>
        <Popover.Content class="w-auto p-0" side="top">
          <Calendar
            {value}
            bind:placeholder
            minValue={new CalendarDate(1900, 1, 1)}
            maxValue={today(getLocalTimeZone())}
            calendarLabel="Date of birth"
            initialFocus
            onValueChange={(v) => {
              if (v) {
                $form[item.name] = v.toString();
              } else {
                $form[item.name] = "";
              }
            }}
          />
        </Popover.Content>
      </Popover.Root>
      <Form.Description
        >{item.description}</Form.Description
      >
      <Form.FieldErrors />
      <input hidden value={$form[item.name]} name={attrs.name} />
    </Form.Control>
  </Form.Field>