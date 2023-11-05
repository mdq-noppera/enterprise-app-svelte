import type { AccountInfo } from '@azure/msal-browser';
import { writable, type Writable } from 'svelte/store';

export const userStore: Writable<AccountInfo | null> = writable(null);
