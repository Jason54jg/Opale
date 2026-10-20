/** Fond atmosphérique fixe — dégradés ember, sans texture étirée. */
export function PageBackground() {
  return (
    <div className="page-bg" aria-hidden>
      <div className="page-bg__base" />
      <div className="page-bg__glow" />
      <div className="page-bg__vignette" />
    </div>
  );
}
