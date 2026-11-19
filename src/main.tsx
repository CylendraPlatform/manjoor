import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Capacitor } from "@capacitor/core";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

if (Capacitor.isNativePlatform()) {
  import("@capacitor/splash-screen").then(({ SplashScreen }) => {
    requestAnimationFrame(() => {
      setTimeout(() => SplashScreen.hide({ fadeOutDuration: 300 }), 100);
    });
  });
}
