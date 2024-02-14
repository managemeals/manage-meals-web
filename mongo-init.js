db.createCollection('users');
db.users.createIndex({ uuid: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

db.createCollection('recipes');
db.recipes.createIndex({ uuid: 1 }, { unique: true });
db.recipes.createIndex({ slug: 1 }, { unique: true });

db.createCollection('tags');
db.tags.createIndex({ uuid: 1 }, { unique: true });
db.tags.createIndex({ slug: 1 }, { unique: true });

db.createCollection('categories');
db.categories.createIndex({ uuid: 1 }, { unique: true });
db.categories.createIndex({ slug: 1 }, { unique: true });
