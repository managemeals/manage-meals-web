// See https://kit.svelte.dev/docs/types#app

import type { IUser } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: IUser;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:clickoutside'?: (event: CustomEvent) => void;
		}
	}
}

export {};
