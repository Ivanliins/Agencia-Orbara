import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

// Páginas pré-renderizadas no build chegam com HTML pronto: hidrata em vez de recriar.
if (root.hasChildNodes()) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
