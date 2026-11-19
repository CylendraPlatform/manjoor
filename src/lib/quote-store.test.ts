import { describe, it, expect, beforeEach } from "vitest";
import { useQuoteStore } from "./quote-store";

const reset = () => useQuoteStore.setState({ items: [] });
const p = (id: string) => ({ productId: id, slug: "s-" + id, name: "P" + id, imageUrl: null });

describe("quote store (quotation cart)", () => {
  beforeEach(reset);

  it("adds items with a default quantity of 1", () => {
    useQuoteStore.getState().addItem(p("a"));
    expect(useQuoteStore.getState().items).toHaveLength(1);
    expect(useQuoteStore.getState().items[0].quantity).toBe(1);
  });

  it("accumulates quantity when the same product is added again", () => {
    useQuoteStore.getState().addItem(p("a"), 20);
    useQuoteStore.getState().addItem(p("a"), 30);
    expect(useQuoteStore.getState().items[0].quantity).toBe(50);
  });

  it("captures multiple line items (A=20, B=50, C=100)", () => {
    const s = useQuoteStore.getState();
    s.addItem(p("a"), 20); s.addItem(p("b"), 50); s.addItem(p("c"), 100);
    expect(useQuoteStore.getState().itemCount()).toBe(3);
    expect(useQuoteStore.getState().totalQuantity()).toBe(170);
  });

  it("removes an item when quantity drops below 1", () => {
    useQuoteStore.getState().addItem(p("a"), 5);
    useQuoteStore.getState().setQuantity("a", 0);
    expect(useQuoteStore.getState().hasItem("a")).toBe(false);
  });

  it("floors fractional quantities and never goes below 1 on add", () => {
    useQuoteStore.getState().addItem(p("a"), 2.9);
    expect(useQuoteStore.getState().items[0].quantity).toBe(2);
  });
});
