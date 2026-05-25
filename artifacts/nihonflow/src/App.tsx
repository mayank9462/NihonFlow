import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Hiragana from "@/pages/Hiragana";
import Katakana from "@/pages/Katakana";
import Flashcards from "@/pages/Flashcards";
import Quiz from "@/pages/Quiz";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/hiragana" component={Hiragana} />
            <Route path="/katakana" component={Katakana} />
            <Route path="/flashcards" component={Flashcards} />
            <Route path="/quiz" component={Quiz} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
