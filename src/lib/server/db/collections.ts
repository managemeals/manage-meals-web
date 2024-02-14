import db from '$lib/server/db/mongo';
import type { Recipe } from '$lib/types';

export const recipes = db.collection<Recipe>('recipes');
