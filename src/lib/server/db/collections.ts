import db from '$lib/server/db/mongo';
import type { Recipe, User } from '$lib/types';

export const users = db.collection<User>('users');

export const recipes = db.collection<Recipe>('recipes');
