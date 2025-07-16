import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App.tsx";
import "./index.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Theme (choose any)
import "primereact/resources/primereact.min.css"; // Core PrimeReact CSS
import { PrimeReactProvider } from "primereact/api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </HeroUIProvider>
  </StrictMode>
);
