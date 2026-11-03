import { lazy, Suspense, useCallback, useState } from 'react';
import { useMedia } from '../utils/useMedia';

const Planet = lazy(() => import('./Planet'));

function PlanetStatic() {
  return <div className="planet planet--static" aria-hidden="true" />;
}

/** three.js грузится лениво; на мобильных, при reduced-motion и без WebGL — статичная заглушка. */
export default function HeroPlanet() {
  const small = useMedia('(max-width: 768px)');
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  const [failed, setFailed] = useState(false);
  const onFail = useCallback(() => setFailed(true), []);

  if (small || reduce || failed) return <PlanetStatic />;
  return (
    <Suspense fallback={<PlanetStatic />}>
      <Planet onFail={onFail} />
    </Suspense>
  );
}
