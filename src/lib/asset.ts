/** Resolve a public asset (images/…, audio/…) against the build's base path.
 *  Base is './' for the offline/file:// build and '/pathsense/' for GitHub Pages. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
