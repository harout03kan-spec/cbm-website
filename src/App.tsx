import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import ScrollManager from "./router/ScrollManager";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import WhatsAppChat from "./components/feature/WhatsAppChat";
import EcwidCartDrawer from "./components/feature/EcwidCartDrawer";
import { CartProvider } from "./hooks/useCart";
import { EcwidCartProvider } from "./hooks/useEcwidCart";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <CartProvider>
        <EcwidCartProvider>
          <BrowserRouter basename={__BASE_PATH__}>
            <ScrollManager />
            <AppRoutes />
            <WhatsAppChat />
          </BrowserRouter>
          <EcwidCartDrawer />
        </EcwidCartProvider>
      </CartProvider>
    </I18nextProvider>
  );
}

export default App;
