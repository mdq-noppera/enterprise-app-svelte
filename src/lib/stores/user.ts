import type { AccountInfo } from '@azure/msal-browser';
import { writable, type Writable } from 'svelte/store';

type IsaAccount = AccountInfo & { accessToken: string };

export const userStore: Writable<IsaAccount> = writable(null);
