import { writable } from 'svelte/store';

interface Taxon {
	usageKey: number;
	scientificName: string;
	canonicalName: string;
	rank: string;
	status: string;
	confidence: number;
	matchType: string;
	kingdom: string;
	phylum: string;
	order: string;
	family: string;
	genus: string;
	species: string;
	kingdomKey: number;
	phylumKey: number;
	classKey: number;
	orderKey: number;
	familyKey: number;
	genusKey: number;
	speciesKey: number;
	synonym: boolean;
	class: string;
};

export const speciesData = writable<Taxon>({});