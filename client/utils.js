/**
 * Queries the context for the node matching the specified selector.
 * @param {HTMLElement} ctx
 * @param {string} queryName
 * @returns {HTMLElement}
 */
export function $(ctx, queryName) {
  if (ctx.shadowRoot) {
    return ctx.shadowRoot.querySelector(queryName);
  }
  return ctx.querySelector(queryName);
}
/**
 * Creates an instance of the element for the specified tag.
 * @param {string} elName
 * @param {string} [template] Path to template file for contents of element.
 * @returns {HTMLElement}
 */
export async function $r(elName, template) {
  const el = document.createElement(elName);
  if (template) {
    const parser = new DOMParser();
    const res = await fetch(template);
    const textTemplate = await res.text();
    const htmlTemplate = parser.parseFromString(textTemplate, 'text/html').querySelector('template');
    el.append(htmlTemplate.content.cloneNode(true));
  }
  return el;
}
/**
 * Creates an instance of the element for the specified tag.
 * @param {string} elName
 * @param {string} [template] Path to template file for contents of element.
 * @returns {HTMLElement}
 */
export function html(elName) {
  return document.createElement(elName);
}
/**
 * Clear inner content of element
 * @param {HTMLElement} el
 */
export function $clear(el) {
  Array.from(el.children).forEach(childNode => childNode.remove());
}
