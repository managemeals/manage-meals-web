import { writable } from 'svelte/store';
import type { ISidebarLink } from './types';

export const sidebarLinks = writable<ISidebarLink[]>([]);

export const hasSidebar = writable(true);
