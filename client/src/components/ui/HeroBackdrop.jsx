import React from 'react';

/**
 * Real destination photography, not stock-photo filler — each image matches
 * a guide actually in the RAG corpus, so the backdrop is honest about what
 * the retrieval pipeline can ground answers in. Sourced from Wikimedia
 * Commons (freely licensed; credited below, per license terms) rather than
 * a paid image API, so no API key is required to run this project.
 *
 * Rendered at low opacity behind the existing mesh/grid layers — texture,
 * not a loud photo banner — so hero text contrast never depends on which
 * frame happens to be showing.
 */
const PHOTOS = [
  {
    city: 'Rome',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/1280px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg',
    credit: 'Diliff',
  },
  {
    city: 'Tokyo',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/1280px-Skyscrapers_of_Shinjuku_2009_January.jpg',
    credit: 'Morio',
  },
  {
    city: 'Paris',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/1280px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
    credit: 'Benh Lieu Song',
  },
  {
    city: 'Bali',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Pura_Luhur_Uluwatu_2017-08-17_%2834%29.jpg/1280px-Pura_Luhur_Uluwatu_2017-08-17_%2834%29.jpg',
    credit: 'Nicolas Lannuzel',
  },
  {
    city: 'Bangkok',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/4Y1A1159_Bangkok_%2833536795515%29.jpg/1280px-4Y1A1159_Bangkok_%2833536795515%29.jpg',
    credit: 'Diego Delso',
  },
  {
    city: 'New York',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/1280px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg',
    credit: 'Dllu',
  },
];

const HeroBackdrop = () => {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {PHOTOS.map((photo, i) => (
          <img
            key={photo.city}
            src={photo.src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            className="absolute inset-0 h-full w-full animate-hero-crossfade object-cover grayscale-[15%]"
            style={{ animationDelay: `${i * 6}s` }}
          />
        ))}
        {/* Scrim: keeps the backdrop as texture, never competing with text contrast.
            Uses the theme surface color (not a hardcoded white) so it stays
            correct under dark mode instead of washing out light-mode text
            against a still-white scrim. Dark mode needs a heavier scrim —
            a dark overlay at the same opacity lets bright sky/building
            highlights read as more visually competing than the equivalent
            light overlay does on the same photo. */}
        <div className="absolute inset-0 bg-surface/[0.86] dark:bg-surface/[0.94]" />
      </div>

      {/* Attribution — small, unobtrusive, required by the Commons licenses */}
      <p className="absolute bottom-2 right-3 z-10 text-[0.625rem] text-ink-faint/70">
        Photos:{' '}
        {PHOTOS.map((p, i) => (
          <React.Fragment key={p.city}>
            {i > 0 && ', '}
            {p.credit}
          </React.Fragment>
        ))}
        {' '}· Wikimedia Commons
      </p>
    </>
  );
};

export default HeroBackdrop;
