/**
 * SEO metadata and page title updater
 */

export function updatePageMeta(title, description) {
  if (title) {
    document.title = `${title} | TripMind AI`;
  } else {
    document.title = 'TripMind AI | Next-Gen AI Travel Planning Agent';
  }

  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }
}
