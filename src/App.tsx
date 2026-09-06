import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SmolderingMyeloma from "./pages/SmolderingMyeloma";
import SmolderingMyelomaGenomic from "./pages/SmolderingMyelomaGenomic";
import MultipleMyeloma from "./pages/MultipleMyeloma";
import MgusPrognosis from "./pages/MgusPrognosis";
import Amyloidosis from "./pages/Amyloidosis";
import BnpConversion from "./pages/BnpConversion";
import Preview from "./pages/Preview";
import Frailty from "./pages/Frailty";
import Waldenstrom from "./pages/Waldenstrom";
import Developers from "./pages/Developers";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import PreviewGate from "./components/PreviewGate";
import StagingBanner from "./components/StagingBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PreviewGate>
      <Toaster />
      <Sonner />
      <HashRouter>
        <ScrollToTop />
        <StagingBanner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/smoldering-myeloma" element={<SmolderingMyeloma />} />
          <Route path="/smoldering-myeloma-genomic" element={<SmolderingMyelomaGenomic />} />
          <Route path="/multiple-myeloma" element={<MultipleMyeloma />} />
          <Route path="/mgus-prognosis" element={<MgusPrognosis />} />
          <Route path="/amyloidosis" element={<Amyloidosis />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/bnp-conversion" element={<BnpConversion />} />
          <Route path="/frailty" element={<Frailty />} />
          <Route path="/waldenstrom" element={<Waldenstrom />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
      </PreviewGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
