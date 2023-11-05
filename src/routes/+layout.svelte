<script lang="ts">
	import { userStore } from '$lib/stores';
	import { PublicClientApplication, type AccountInfo } from '@azure/msal-browser';
	import { onMount } from 'svelte';
	import { AuthModule } from './AuthModule';

	onMount(async () => {
		// const msalConfig = {
		// 	auth: {
		// 		clientId: 'cd2e557f-c84f-482a-9c98-8626b718b9df',
		// 		authority: 'https://login.microsoftonline.com/3dd30cf6-7303-4de6-aa64-f88072f89e11'
		// 	}
		// };

		// const msalInstance = new PublicClientApplication(msalConfig);
		// await msalInstance.initialize();
		// msalInstance.getProf
		const authModule = new AuthModule();
		await authModule.init();
		authModule.loadAuthModule();
		authModule.login('loginPopup');
		// authModule.attemptSsoSilent();
		// authModule.getProfileTokenPopup();
	});
</script>

<slot />
