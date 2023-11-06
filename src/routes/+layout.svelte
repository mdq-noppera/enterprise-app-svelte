<script lang="ts">
	import { onMount } from 'svelte';
	import { AuthModule } from './AuthModule';
	import { userStore } from '$lib/stores';
	import { type AccountInfo, EventType, InteractionRequiredAuthError } from '@azure/msal-browser';

	let authModule: AuthModule;

	function logout() {
		userStore.set(null);
		authModule.logout();
	}

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

		authModule = new AuthModule();
		await authModule.myMSALObj.initialize();

		const msalInstance = authModule.myMSALObj;

		const accounts = msalInstance.getAllAccounts();
		if (accounts.length > 0) {
			msalInstance.setActiveAccount(accounts[0]);
		}

		msalInstance.addEventCallback((event) => {
			// set active account after redirect
			if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
				const account = event.payload as AccountInfo;
				console.log('DEBUG: account to be set: ', account);
				msalInstance.setActiveAccount(account);
			}
		});

		console.log('get active account', msalInstance.getActiveAccount());

		// handle auth redired/do all initial setup for msal
		msalInstance
			.handleRedirectPromise()
			.then((authResult) => {
				// Check if user signed in
				const account = msalInstance.getActiveAccount();
				if (!account) {
					// redirect anonymous user to login page
					msalInstance.loginRedirect();
				} else {
					var request = {
						// scopes are only for MS Graph API -> read user details
						// --> why do we even have an id token then?
						scopes: ['User.Read']
					};

					authModule.myMSALObj
						.acquireTokenSilent(request)
						.then((tokenResponse) => {
							console.log('DEBUG: tokenResponse: ', tokenResponse);
							// create own user object with access token for http reqs
							const user = { ...account, accessToken: tokenResponse.accessToken };
							userStore.set(user);
						})
						.catch((error) => {
							if (error instanceof InteractionRequiredAuthError) {
								console.log('DEBUG: interaction required error: ', error);
								// fallback to interaction when silent call fails
								return authModule.myMSALObj.acquireTokenRedirect(request);
							} else {
								console.log('DEBUG: general error', error);
							}

							// handle other errors
						});
				}
			})
			.catch((err) => {
				// TODO: Handle errors
				console.log(err);
			});
	});
</script>

<slot />

<br />
<button on:click={logout}>Logout</button>
