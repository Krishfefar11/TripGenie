import { useEffect, useState } from 'react';

/**
 * Resolves a real photo for an arbitrary destination string via Wikipedia's
 * REST summary API — no API key, and its title-matching already resolves
 * typos/casing well (verified directly: "ahemdabad" -> Ahmedabad's photo).
 * Fails silently: an unresolvable destination just means no photo, never a
 * broken image or a thrown error the page has to handle.
 */
export function useDestinationImage(destination) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    setImageUrl(null);
    if (!destination) return;

    let cancelled = false;
    const controller = new AbortController();

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination.trim())}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const source = data?.thumbnail?.source;
        if (!cancelled && source) setImageUrl(source.split('?')[0]);
      })
      .catch(() => {
        /* No photo — the page falls back to its plain gradient header. */
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [destination]);

  return imageUrl;
}
