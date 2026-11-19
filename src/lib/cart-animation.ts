/**
 * Dispatches the "fly-to-cart" animation event from a source element.
 * Kept separate from the <FlyingCartAnimation/> component so the component file
 * only exports a component (React Fast Refresh requirement).
 */
export const triggerCartAnimation = (startElement: HTMLElement) => {
  const rect = startElement.getBoundingClientRect();
  const event = new CustomEvent("fly-to-cart", {
    detail: {
      x: rect.left + startElement.offsetWidth / 2,
      y: rect.top + startElement.offsetHeight / 2,
    },
  });
  window.dispatchEvent(event);
};
