import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SmolderingMyeloma from "./pages/SmolderingMyeloma";
import MultipleMyeloma from "./pages/MultipleMyeloma";
import MgusPrognosis from "./pages/MgusPrognosis";
import Amyloidosis from "./pages/Amyloidosis";
import Frailty from "./pages/Frailty";
import Waldenstrom from "./pages/Waldenstrom";
import Developers from "./pages/Developers";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/smoldering-myeloma" element={<SmolderingMyeloma />} />
          <Route path="/multiple-myeloma" element={<MultipleMyeloma />} />
          <Route path="/mgus-prognosis" element={<MgusPrognosis />} />
          <Route path="/amyloidosis" element={<Amyloidosis />} />
          <Route path="/frailty" element={<Frailty />} />
          <Route path="/waldenstrom" element={<Waldenstrom />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
