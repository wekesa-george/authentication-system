import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	copyPublicDir:true,
	outDir:'build',
	vitePlugin: {
		inspector: true,   
	},
	kit: {
		adapter: adapter({
		
			paths: {
				base: '/office',
			  }
		}),
	
		appDir:'src',
		alias: {
			$lib: "./src/lib",
			"$lib/*": "./src/lib/*"
		  }
	}
};

export default config;
