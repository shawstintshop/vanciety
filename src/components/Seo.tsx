import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  schema?: Record<string, any> | Record<string, any>[];
};

function upsertMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function Seo({ title, description, canonicalPath, schema }: SeoProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta("description", description);
    upsertMeta("og:title", title, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("twitter:title", title, "name");
    upsertMeta("twitter:description", description, "name");

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://vanciety.com${canonicalPath || window.location.pathname}`);

    const existing = document.head.querySelector('script[data-vanciety-seo="true"]');
    if (existing) existing.remove();

    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.vancietySeo = "true";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    }

    return undefined;
  }, [title, description, canonicalPath, schema]);

  return null;
}
