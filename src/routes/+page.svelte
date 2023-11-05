<script lang="ts">
	import { userStore } from '$lib/stores';
</script>

<h1>MS Entra ID OAuth sample app</h1>

{#if $userStore}
	<span>Username: {$userStore.name}</span>
	<br />
	<span>AccessToken: {$userStore.accessToken.slice(0, 10)}...</span>
{/if}
