<script lang="ts">
	import { goto } from '$app/navigation';
	import { clickOutside } from '$lib/actions/clickOutside';
	import type { ISearch, ISearchRecipe } from '$lib/types';
	import Icon from '@iconify/svelte';
	import { debounce } from 'lodash-es';

	const descMaxLength = 70;

	let searchResults: ISearch<ISearchRecipe> | undefined;
	let searchInput = '';
	let selectedSearchResultIndex = -1;
	let isSearching = false;

	const handleInput = debounce(async () => {
		isSearching = true;
		try {
			const res = await fetch(`/api/search?q=${searchInput}`);
			searchResults = await res.json();
		} catch (e) {
			searchResults = undefined;
		} finally {
			isSearching = false;
		}
	}, 300);

	$: if (searchInput) {
		selectedSearchResultIndex = -1;
		handleInput();
	} else {
		searchResults = undefined;
	}

	const handleSubmit = () => {
		const query = searchInput;
		searchInput = '';
		if (selectedSearchResultIndex > -1 && searchResults) {
			const slug = searchResults.hits[selectedSearchResultIndex].document.slug;
			selectedSearchResultIndex = -1;
			goto(`/recipes/${slug}`);
		} else {
			goto(`/search?q=${query}`);
		}
	};

	// eslint-disable-next-line
	const handleKeydown = (e: any) => {
		if (!searchResults || !searchResults.hits || !searchResults.hits.length) {
			return;
		}
		if (e.key === 'ArrowDown' && selectedSearchResultIndex < searchResults.hits.length - 1) {
			selectedSearchResultIndex++;
		}
		if (e.key === 'ArrowUp' && selectedSearchResultIndex > 0) {
			selectedSearchResultIndex--;
		}
	};

	const handleOutsideClick = () => {
		searchInput = '';
		selectedSearchResultIndex = -1;
	};
</script>

<form
	action="/search"
	method="get"
	on:submit|preventDefault={handleSubmit}
	use:clickOutside={[]}
	on:clickoutside={handleOutsideClick}
>
	<div class="flex rounded w-96 border border-orange-500 hover:border-orange-600 relative">
		<input
			bind:value={searchInput}
			on:keydown={handleKeydown}
			autocomplete="off"
			type="text"
			id="q"
			name="q"
			placeholder="Search"
			class="rounded-l p-2 outline-none bg-orange-600 text-white placeholder-white placeholder-opacity-40 w-full"
		/>
		<button type="submit" class="rounded-r bg-orange-600 px-3 hover:bg-orange-700" title="Search">
			<span class:hidden={isSearching}>
				<Icon icon="ph:magnifying-glass" width="1.4rem" color="#fff" />
			</span>
			<span class:hidden={!isSearching}>
				<Icon icon="ph:circle-notch" color="#fff" width="1.4rem" class="animate-spin" />
			</span>
		</button>
		<div
			class="absolute top-full bg-white shadow-lg right-0 -left-44 mt-2 flex flex-col overflow-auto rounded max-h-96"
			class:hidden={!searchResults || !searchResults.found}
		>
			{#each searchResults?.hits || [] as hit, i}
				<a
					href={`/recipes/${hit.document.slug}`}
					class={`flex mb-1 last:mb-0 items-center hover:bg-gray-100${selectedSearchResultIndex === i ? ' bg-gray-100' : ''}`}
					on:click={() => {
						searchInput = '';
					}}
				>
					<div
						style={`background-image: url("${hit.document.imageUrl}")`}
						class="bg-center bg-no-repeat bg-cover h-24 basis-28 shrink-0"
					></div>
					<div class="p-2">
						<div>{@html hit.highlight.title.snippet}</div>
						<div>
							{hit.document.description.length > descMaxLength
								? `${hit.document.description.substring(0, descMaxLength)}...`
								: hit.document.description}
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</form>
