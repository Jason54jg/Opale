/** Fond atmosphérique fixe — texture ember + lueurs. */
export function PageBackground() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="page-bg" aria-hidden>
      <div
        className="page-bg__texture"
        style={{ backgroundImage: `url(${base}/bg-ember.png)` }}
      />
      <div className="page-bg__glow" />
      <div className="page-bg__vignette" />
    </div>
  );
}
