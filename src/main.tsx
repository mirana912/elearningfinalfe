// src/main.tsx
// ==========================================

import ReactDOM from "react-dom/client";
import { BrowserRouter, RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { store } from "./store/store/store";
import App from "./App";
import "./index.css";

console.log("Application starting...");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </RouterProvider>
);

// ==========================================
