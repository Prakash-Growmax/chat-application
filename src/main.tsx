import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initSupabase } from "./lib/supabase";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/sw.js")
//     .then((registration) => {
//     })
//     .catch((error) => {
//     });
// }

async function initApp() {
  try {
    const root = document.getElementById("root");
    if (!root) {
      throw new Error("Root element not found");
    }

    const DOM_Root = createRoot(root);

    await initSupabase();

    DOM_Root.render(
      <>
        <App />
      </>
    );
  } catch (error) {
    console.error("Failed to initialize application:", error);
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center;">
          <div>
            <h1 style="color: #ef4444; margin-bottom: 1rem;">Unable to Start Application</h1>
            <p style="color: #6b7280;">Please refresh the page or try again later.</p>
          </div>
        </div>
      `;
    }
  }
}

initApp();
