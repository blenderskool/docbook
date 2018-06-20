import addAttributes from '../utils/attributes';
import camelKebab from '../utils/camelKebab';
import concat from '../utils/concat';

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
      data = appendElement(child);
    });
  }
  // If children is passed as a single object
  else if (typeof children === 'object') {
    data = appendElement(children);
  }
  // If children is a string
  else if (typeof children === "string") {
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

export default function(plugin, elemRef) {
  const mod = require(plugin);

  const html = mod.data(elemRef);
  const css = parseStyles(mod.styles(elemRef));

  /**
   * We add user specified inline styles and class list to the plugin element.
   * This gives customizability to the user.
   */
  html.attributes.style = concat(html.attributes.style, elemRef.getAttribute('style'));
  html.attributes.class = concat(html.attributes.class, ' ', elemRef.getAttribute('class'));

  let element = addChildren(html);

  return { element, css};
}