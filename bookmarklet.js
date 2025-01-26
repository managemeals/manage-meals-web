// Create final code here: https://chriszarate.github.io/bookmarkleter/

// Configuration
const IMPORT_URL = 'https://managemeals.com/recipes/import';

// Get and encode the current page URL
const currentUrl = encodeURIComponent(window.location.href);

// Redirect to the import page with the URL as a parameter
window.location.href = `${IMPORT_URL}?url=${currentUrl}`;
