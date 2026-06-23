import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — fires window.scrollTo(0,0) on every route change.
 * Mount once inside <BrowserRouter> in App.tsx.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
