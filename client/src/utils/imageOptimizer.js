// src/utils/imageOptimizer.js
export function optimizeCloudinaryUrl(url, width = 500) {
  if (!url) return '';
  
  // If already optimized, return as-is
  if (url.includes('/upload/') && url.includes('/upload/w_')) {
    return url;
  }
  
  // Insert optimization parameters
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
  }
  
  return url;
}

// For multiple images
export function optimizeAllCloudinaryUrls(urls, width = 500) {
  if (!urls) return [];
  if (Array.isArray(urls)) {
    return urls.map(url => optimizeCloudinaryUrl(url, width));
  }
  return [optimizeCloudinaryUrl(urls, width)];
}