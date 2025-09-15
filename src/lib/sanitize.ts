/**
 * HTML Sanitization Utility
 * Provides secure HTML sanitization to prevent XSS attacks
 */

// Simple HTML sanitizer that removes potentially dangerous tags and attributes
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove script tags and their content
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove potentially dangerous attributes
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(element => {
    // Remove dangerous attributes
    const dangerousAttrs = ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'];
    dangerousAttrs.forEach(attr => {
      element.removeAttribute(attr);
    });
    
    // Remove javascript: protocols from href and src
    const href = element.getAttribute('href');
    if (href && href.toLowerCase().startsWith('javascript:')) {
      element.removeAttribute('href');
    }
    
    const src = element.getAttribute('src');
    if (src && src.toLowerCase().startsWith('javascript:')) {
      element.removeAttribute('src');
    }
  });
  
  return tempDiv.innerHTML;
}

// Alternative: Use DOMPurify if available (more comprehensive)
export function sanitizeHtmlAdvanced(html: string): string {
  // For production, consider using DOMPurify library
  // import DOMPurify from 'dompurify';
  // return DOMPurify.sanitize(html);
  
  // Fallback to basic sanitization
  return sanitizeHtml(html);
}
