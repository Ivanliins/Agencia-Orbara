import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/theme";
import { useSeo } from "@/seo/useSeo";
import { lazy, Suspense } from "react";
const Home = lazy(() => import("@/pages/Home"));
const CaseDetail = lazy(() => import("@/pages/CaseDetail"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  useSeo(location);
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"></div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/cases/:slug" component={CaseDetail} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

/** `ssrPath` é usado apenas na pré-renderização (build) para renderizar uma rota específica. */
function App({ ssrPath }: { ssrPath?: string }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")} ssrPath={ssrPath}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
