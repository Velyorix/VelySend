import { AppLayout } from "./components/layout/app-layout";
import { Routes, Route } from "react-router-dom";
import { ComposerPage } from "./pages/composer/ComposerPage";
import { HistoryPage } from "./pages/history/HistoryPage";  
import { TemplatesPage } from "./pages/templates/TemplatesPage";
import { AccountsPage } from "./pages/accounts/AccountsPage";
import { ContactsPage } from "./pages/contacts/ContactsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { HelpPage } from "./pages/help/HelpPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <AppLayout>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/composer" element={<ComposerPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppLayout>
);

export default App;
