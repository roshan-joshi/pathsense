import { useEffect, useState } from 'react';
import { Viewer } from './Viewer';
import { ReadingMode } from '../components/ReadingMode';
import { PresenterView } from '../components/PresenterView';

type Route = 'cinematic' | 'read' | 'presenter-view';

function routeFromHash(): Route {
  const h = location.hash.replace(/^#\/?/, '');
  if (h.startsWith('read')) return 'read';
  if (h.startsWith('presenter-view')) return 'presenter-view';
  return 'cinematic';
}

export function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  useEffect(() => {
    const on = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  useEffect(() => { document.body.classList.toggle('reading', route === 'read'); }, [route]);
  if (route === 'read') return <ReadingMode />;
  if (route === 'presenter-view') return <PresenterView />;
  return <Viewer />;
}
