import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Setup from "@/pages/setup";
import Diary from "@/pages/diary";
import Appointments from "@/pages/appointments";
import WeightTracking from "@/pages/weight-tracking";
import KickCounter from "@/pages/kick-counter";
import ShoppingList from "@/pages/shopping-list";
import BellyPhotos from "@/pages/belly-photos";
import Exercises from "@/pages/exercises";
import Recipes from "@/pages/recipes";
import Symptoms from "@/pages/symptoms";
import Medications from "@/pages/medications";
import BirthPlan from "@/pages/birth-plan";
import Community from "@/pages/community";
import Baby from "@/pages/baby";
import Tips from "@/pages/tips";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import InstallPWA from "@/components/InstallPWA";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  const { data: pregnancy, isLoading: pregnancyLoading } = useQuery({
    queryKey: ["/api/pregnancies/active"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-indigo-200 rounded-full opacity-25 animate-pulse delay-2000"></div>
        </div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            </div>
            <p className="text-gray-700 font-medium">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {pregnancyLoading ? (
            <Route path="/" component={() => (
              <div className="max-w-sm mx-auto min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute top-40 right-16 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
                  <div className="absolute bottom-32 left-20 w-12 h-12 bg-indigo-200 rounded-full opacity-25 animate-pulse delay-2000"></div>
                </div>
                <div className="relative flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                    </div>
                    <p className="text-gray-700 font-medium">Carregando...</p>
                  </div>
                </div>
              </div>
            )} />
          ) : !pregnancy ? (
            <Route path="/" component={Setup} />
          ) : (
            <>
              <Route path="/" component={Home} />
              <Route path="/home" component={Home} />
              <Route path="/diary" component={Diary} />
              <Route path="/appointments" component={Appointments} />
              <Route path="/weight-tracking" component={WeightTracking} />
              <Route path="/kick-counter" component={KickCounter} />
              <Route path="/shopping-list" component={ShoppingList} />
              <Route path="/belly-photos" component={BellyPhotos} />
              <Route path="/exercises" component={Exercises} />
              <Route path="/recipes" component={Recipes} />
              <Route path="/symptoms" component={Symptoms} />
              <Route path="/medications" component={Medications} />
              <Route path="/birth-plan" component={BirthPlan} />
              <Route path="/community" component={Community} />
              <Route path="/baby" component={Baby} />
              <Route path="/tips" component={Tips} />
              <Route path="/profile" component={Profile} />
            </>
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <InstallPWA />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
