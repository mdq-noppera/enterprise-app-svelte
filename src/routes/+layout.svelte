<script lang="ts">
	import { onMount } from 'svelte';
	import { AuthModule } from './AuthModule';
	import { userStore } from '$lib/stores';
	import { InteractionRequiredAuthError } from '@azure/msal-browser';

	onMount(async () => {
		// WARNING: this only works online!!!
		// TODOs: offline tokens
		// use token from storage
		// how do we check if still valid?
		// -> could try to get new tokens when ESB returns 401

		// do we need to handle the redirect?
		// --> prolly handled by the lib since we have all the data we need?

		// use session or local storage?
		// --> local storage to keep people logged in

		const authModule = new AuthModule();
		await authModule.myMSALObj.initialize();
		const accounts = authModule.myMSALObj.getAllAccounts();
		let user = await authModule.myMSALObj.handleRedirectPromise();

		if (accounts.length === 0) {
			try {
				// why does this expect details?
				await authModule.myMSALObj.loginRedirect({});
			} catch (err) {
				console.log('DEBUG: got err: ', err);
			}
		} else {
			// this might be important -> need to try out with M.
			const accounts = authModule.myMSALObj.getAllAccounts();
			console.log('DEBGU: accounts: ', accounts);
			if (accounts.length > 0) {
				var request = {
					// scopes are only for MS Graph API -> read user details
					// --> why do we even have an id token then?
					scopes: ['User.Read']
				};

				authModule.myMSALObj
					.acquireTokenSilent(request)
					.then((tokenResponse) => {
						console.log('DEBUG: tokenResponse: ', tokenResponse);
						const user = { ...accounts[0], accessToken: tokenResponse.accessToken };
						userStore.set(user);
					})
					.catch((error) => {
						if (error instanceof InteractionRequiredAuthError) {
							// fallback to interaction when silent call fails
							return authModule.myMSALObj.acquireTokenRedirect(request);
						}

						// handle other errors
					});
			} else {
				console.log('DEBUG: no one logged in...');
			}
		}
	});
</script>

<slot />
