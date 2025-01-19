<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { cn } from "$lib/utils.js";
    import * as Tooltip from "$lib/components/ui/tooltip";
	import { page } from "$app/stores";
	export let isCollapsed: boolean;
	export let routes: any[];
	import { Separator } from "$lib/components/ui/separator";
	import {ScrollArea} from "$lib/components/ui/scroll-area";
	import { goto } from "$app/navigation";
	async function setActive(route: any){
		
	}
	let path : string|null;
	$:{
		path = $page.route.id
		routes.map((item: any)=>{
			item.variant = 'ghost'
			item.active = false
			item.expanded = false
			if(item.hasChildren){
					item.children.map((child: any)=>{
						child.active = false;
						return child;
					});
			}
			return item
		});
		let index = routes.findIndex((item: any)=>{

			const samePath: any = item.children.findIndex((child: any)=>{
				return  child.href == $page.route.id
			})
			return item.href == $page.route.id || (item.hasChildren&&(samePath>-1))
		});
		
		routes[index].variant = 'default'
		routes[index].active = true
		if(routes[index].hasChildren){

			routes[index].expanded = true

			const activeChild = routes[index].children.findIndex((ac: any)=>{
					return ac.href == $page.route.id
			});

			if(activeChild>-1){
				console.log(routes[index]);
				routes[index].children[activeChild].active = true;
			}
			

		}
		routes = routes;
	}
</script>
<ScrollArea class="flex-1 h-[90%]">
<div data-collapsed={isCollapsed} class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 ">
	<nav class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
		{#each routes as route}
			{#if isCollapsed}
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild let:builder>
						<Button
							href="{route.href}"
							on:click={()=>{
								setActive(route);
							}}
							builders={[builder]}
							variant={route.variant}
							size="icon"
							class={cn(
								"size-9 p-1",
								route.variant === "default" &&
									"dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
							)}
						>
							<svelte:component this={route.icon} class="size-5 w-5  {route.active?'':'text-black'}" aria-hidden="true" />
							<span class="sr-only">{route.title}</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="right" class="flex flex-col gap-4">
						<div class="flex items-center">
							{route.title}
							{#if route.label}
								<span class="ml-auto text-muted-foreground">
									{route.label}
								</span>
							{/if}
						</div>
						
						{#if route.hasChildren}
							{#each route.children as child }

							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div class="p-2 text-[12px] font-medium hover:bg-slate-700 hover:cursor-pointer rounded-md"
							on:click={()=> goto(child.href)}
							>
								{child.title}
							</div>
							
							{/each}
						{/if}
					</Tooltip.Content>
				</Tooltip.Root>
			{:else}

				<Button
				    href="{route.href}"
					variant={route.variant}
					size="sm"
					on:click={()=>{
						if(route.hasChildren){
							route.expanded = !route.expanded
							routes=routes;
						}
					}}
					class={cn("justify-start "+(route.active?'':'text-black'), {
						"dark:bg-muted dark:text-white  dark:hover:bg-muted dark:hover:text-white":
							route.variant === "default",
					})}
				>
					<svelte:component this={route.icon} class="mr-2 size-4 w-5" aria-hidden="true" />
					{route.title}
					
					<div class="flex-1">

					</div>
					{#if route.label}
						<span
							class={cn("ml-auto", {
								"text-background dark:text-white": route.variant === "default",
							})}
						>
							{route.label}
						</span>
					{/if}
					{#if route.hasChildren}
						{#if !route.expanded}
							<iconify-icon icon="ic:baseline-keyboard-arrow-right" width="20"></iconify-icon>
							{:else}
							<iconify-icon icon="iconoir:nav-arrow-down" width="20"></iconify-icon>
						{/if}
						
					{/if}
					
				</Button>
				{#if route.expanded}
					<div class="bg-slate-200 p-1 rounded-md">
						{#each route.children as child }
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div class="p-2 text-[12px] font-medium mb-1 hover:bg-slate-300 hover:cursor-pointer rounded-md {child.active?'bg-slate-300':''}"
							on:click={()=> goto(child.href)}
							>
								{child.title}
							</div>
						{/each}
					</div>
				{/if}
				{#if route.separate}
				<Separator/>
				{/if}

			{/if}
		{/each}
	</nav>
</div>
</ScrollArea>