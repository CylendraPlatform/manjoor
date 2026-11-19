import { Link } from "react-router-dom";
import { CONCEPT_SHORT_LABEL, conceptInquiryPath, type ManufacturingConcept } from "@/content/concepts";
import { trackEvent } from "@/lib/analytics";

/**
 * Public concept card. Importers: HomePage (teaser, inquiryCta false) and CustomOrderPage (full gallery).
 * Data: ManufacturingConcept from src/content/concepts.ts — not products, no prices.
 * User: "Keep all 10 existing concepts and their inquiry links" and "shorter card labels".
 */
export default function ConceptCard({
  item,
  inquiryCta = true,
}: {
  item: ManufacturingConcept;
  inquiryCta?: boolean;
}) {
  return (
    <article className="card-lift flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="aspect-[4/3] overflow-hidden bg-manjoor-sand/40">
        <img
          src={item.image}
          alt=""
          width={900}
          height={675}
          className="h-full w-full object-cover transition duration-500 ease-out hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold tracking-wide text-manjoor-brass">{CONCEPT_SHORT_LABEL}</p>
        <h2 className="mt-2 text-lg font-extrabold leading-7 text-manjoor-walnut">{item.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-manjoor-charcoal/80">{item.summary}</p>
        {inquiryCta ? (
          <Link
            to={conceptInquiryPath(item.id)}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-manjoor-walnut px-4 py-2 text-center text-sm font-bold text-manjoor-sand"
            onClick={() => trackEvent("concept_inquiry_click", { concept_id: item.id })}
          >
            اطلب تصنيع تصميم مشابه
          </Link>
        ) : (
          <Link
            to="/custom-orders"
            className="mt-4 text-sm font-bold text-manjoor-walnut underline-offset-4 hover:underline"
          >
            استعرض أفكار التصنيع
          </Link>
        )}
      </div>
    </article>
  );
}
