import { useEffect } from "react";

// Import only if you plan to support jQuery-based plugins
// (optional - you can remove these if not using jQuery or others)
declare global {
  interface Window {
    HSStaticMethods: {
      autoInit: () => void;
    };
  }
}

export default function PrelineScript() {
  useEffect(() => {
    const init = async () => {
      const { default: preline } = await import("preline/dist/index.js");

      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === "function"
      ) {
        window.HSStaticMethods.autoInit();
      }
    };

    init();
  }, []);

  return null;
}
