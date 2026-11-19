/**
 * Wraps the app with Capacitor-specific behavior:
 * - Offline detection (Network plugin)
 * - External link interception (Browser plugin)
 * - Android back button handling
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isNative, shouldOpenExternally, openExternal } from "@/lib/capacitor";
import OfflineScreen from "./OfflineScreen";

interface Props {
  children: React.ReactNode;
}

const CapacitorAppWrapper = ({ children }: Props) => {
  const [offline, setOffline] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRetry = useCallback(() => {
    setOffline(false);
    window.location.reload();
  }, []);

  useEffect(() => {
    if (!isNative()) return;
    let handle: { remove: () => Promise<void> } | null = null;

    const setupNetwork = async () => {
      const { Network } = await import("@capacitor/network");
      const s = await Network.getStatus();
      setOffline(!s.connected);
      handle = await Network.addListener("networkStatusChange", (st) => setOffline(!st.connected));
    };
    setupNetwork();
    return () => {
      handle?.remove();
    };
  }, []);

  useEffect(() => {
    if (!isNative()) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href]");
      if (!target) return;
      const a = target as HTMLAnchorElement;
      const href = a.getAttribute("href");
      if (!href) return;
      if (shouldOpenExternally(href)) {
        e.preventDefault();
        e.stopPropagation();
        openExternal(href);
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    if (!isNative()) return;
    let unlisten: (() => Promise<void>) | undefined;

    const setupBack = async () => {
      const { App } = await import("@capacitor/app");
      unlisten = await App.addListener("backButton", () => {
        if (location.pathname === "/" || !document.referrer) {
          App.exitApp();
        } else {
          navigate(-1);
        }
      });
    };
    setupBack();
    return () => {
      unlisten?.();
    };
  }, [navigate, location.pathname]);

  return (
    <>
      {children}
      {offline && <OfflineScreen onRetry={handleRetry} />}
    </>
  );
};

export default CapacitorAppWrapper;
