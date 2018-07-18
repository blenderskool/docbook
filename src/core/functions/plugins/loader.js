import addAttributes from '../../utils/attributes';
import camelKebab from '../../utils/camelKebab';
import concat from '../../utils/concat';

/**
 * This function takes a children object which includes the properties for that
 * single HTML element
 */
function appendElement(children) {
  // Adds the attribtutes to the specified tag
  let element = addAttributes(children.tag, children.attributes);

  // If children exist, then recursively keep calling the function
  if (children.children)
    element += addChildren(children.children);

  // Ends the HTML element
  element += `</${children.tag}>`;

  return element;
}

/**
 * This function adds additional children data to the parent HTML element
 */
function addChildren(children) {
  let data = '';

  // If children is passed as array of objects
  if (Array.isArray(children)) {
    children.forEach(child => {
      data += appendElement(child);
    });
  }
  // If children is passed as a single object
  else if (typeof children === 'object') {
    data = appendElement(children);
  }
  else {
    data = children;
  }
  
  return data;
}

function parseStyles(styles) {
  let css = '';

  for (let selector in styles) {
    css += `${selector} {`;

    for (let attribute in styles[selector]) {
      const attrVal = styles[selector][attribute];

      if (typeof attrVal === 'object') {
        css += `${attribute} {`;
        for (let subAttr in attrVal) {
          css += `${camelKebab(subAttr)}: ${attrVal[subAttr]};`
        }
        css += '}';
      }
      else {
        css += `${camelKebab(attribute)}: ${styles[selector][attribute]};`;
      }
    }

    css += '}';
  }

  return css;
}

export default function(plugin, elemRef, type='html') {
  const config = require(__base + '/docbook.config');
  const mod = require(plugin);

  if (type === 'html') {
    /**
     * Get the static element of the plugin.
     * JSON methods are used to send a deep copy of config data to the plugins
     * to prevent mutability.
     */
    const html = mod.data(elemRef, JSON.parse(JSON.stringify(config)));

    /**
     * We add user specified inline styles and class list to the plugin element.
     * This gives customizability to the user.
     */

    html.attributes.style = concat(html.attributes.style, elemRef.getAttribute('style'));
    html.attributes.class = concat(html.attributes.class, ' ', elemRef.getAttribute('class'));
  
    // Delete the cached plugins data
    delete require.cache[require.resolve(plugin)];
    return addChildren(html);  
  }
  else if (type === 'css') {
    delete require.cache[require.resolve(plugin)];
    return parseStyles(mod.styles());
  }

}