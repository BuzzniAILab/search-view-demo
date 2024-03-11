export const matches = (el: any, selector: string): boolean => {
  let element = el;
  const elements = (element.document || element.ownerDocument).querySelectorAll(
    selector
  );

  document.querySelector('body');
  let index = 0;

  while (elements[index] && elements[index] !== element) {
    ++index;
  }

  return Boolean(elements[index]);
};

export const closest = (el: any, selector: string): Element | null => {
  let element = el;

  while (element && element.nodeType === 1) {
    if (matches(element, selector)) {
      return element;
    }

    element = element.parentNode;
  }
  return null;
};

export const scrollY = () => {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';
  var y = supportPageOffset
    ? window.pageYOffset
    : isCSS1Compat
    ? document.documentElement.scrollTop
    : document.body.scrollTop;
  return Math.floor(y);
};

const dom = {
  matches,
  closest,
  scrollY,
};

export default dom;
