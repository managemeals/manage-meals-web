import { writable } from 'svelte/store';
import type { IIconLink } from './types';

export const sidebarLinks = writable<IIconLink[]>([]);

export const hasSidebar = writable(true);
