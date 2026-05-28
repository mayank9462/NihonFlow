// import { useEffect, useRef } from "react";
// import { ClerkProvider, Show, useClerk } from "@clerk/react";
// import { shadcn } from "@clerk/themes";
// import { Switch, Route, useLocation, Redirect, Router as WouterRouter } from "wouter";
// import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { AppLayout } from "@/components/layout/AppLayout";
// import Landing from "@/pages/Landing";
// import Dashboard from "@/pages/Dashboard";
// import Hiragana from "@/pages/Hiragana";
// import Katakana from "@/pages/Katakana";
// import Flashcards from "@/pages/Flashcards";
// import Quiz from "@/pages/Quiz";
// import Profile from "@/pages/Profile";
// import NotFound from "@/pages/not-found";
// import SignInPage from "@/pages/SignIn";
// import SignUpPage from "@/pages/SignUp";

// const queryClient = new QueryClient();

// // const clerkPubKey = publishableKeyFromHost(
// //   window.location.hostname,
// //   import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
// // );

// const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

// const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// function stripBase(path: string): string {
//   return basePath && path.startsWith(basePath)
//     ? path.slice(basePath.length) || "/"
//     : path;
// }

// if (!clerkPubKey) {
//   throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
// }

// const clerkAppearance = {
//   theme: shadcn,
//   cssLayerName: "clerk",
//   options: {
//     logoPlacement: "inside" as const,
//     logoLinkUrl: basePath || "/",
//     logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
//   },
//   variables: {
//     colorPrimary: "hsl(270, 80%, 65%)",
//     colorForeground: "hsl(210, 40%, 95%)",
//     colorMutedForeground: "hsl(215, 20%, 65%)",
//     colorDanger: "hsl(0, 84%, 60%)",
//     colorBackground: "hsl(222, 47%, 11%)",
//     colorInput: "hsl(222, 40%, 18%)",
//     colorInputForeground: "hsl(210, 40%, 95%)",
//     colorNeutral: "hsl(222, 40%, 25%)",
//     fontFamily: "'Inter', sans-serif",
//     borderRadius: "0.75rem",
//   },
//   elements: {
//     rootBox: "w-full flex justify-center",
//     cardBox:
//       "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/5",
//     card: "!shadow-none !border-0 !bg-transparent !rounded-none",
//     footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
//     headerTitle: "text-foreground font-bold tracking-tight",
//     headerSubtitle: "text-muted-foreground",
//     socialButtonsBlockButtonText: "text-foreground font-medium",
//     formFieldLabel: "text-foreground font-medium",
//     footerActionLink: "text-primary hover:opacity-80 font-medium",
//     footerActionText: "text-muted-foreground",
//     dividerText: "text-muted-foreground",
//     identityPreviewEditButton: "text-primary",
//     formFieldSuccessText: "text-green-400",
//     alertText: "text-foreground",
//     logoBox: "flex justify-center mb-1",
//     logoImage: "h-10 w-auto",
//     socialButtonsBlockButton:
//       "border border-white/10 bg-white/5 hover:bg-white/10 transition-colors",
//     formButtonPrimary:
//       "bg-primary hover:opacity-90 text-white font-semibold transition-opacity",
//     formFieldInput:
//       "bg-input border-white/10 text-foreground focus:border-primary/50",
//     footerAction: "bg-transparent",
//     dividerLine: "bg-white/10",
//     alert: "bg-destructive/10 border border-destructive/20",
//     otpCodeFieldInput: "bg-input border-white/10 text-foreground",
//     formFieldRow: "",
//     main: "",
//   },
// };

// function HomeRedirect() {
//   return (
//     <>
//       <Show when="signed-in">
//         <Redirect to="/dashboard" />
//       </Show>
//       <Show when="signed-out">
//         <Landing />
//       </Show>
//     </>
//   );
// }

// function AuthenticatedApp() {
//   return (
//     <>
//       <Show when="signed-in">
//         <AppLayout>
//           <Switch>
//             <Route path="/dashboard" component={Dashboard} />
//             <Route path="/hiragana" component={Hiragana} />
//             <Route path="/katakana" component={Katakana} />
//             <Route path="/flashcards" component={Flashcards} />
//             <Route path="/quiz" component={Quiz} />
//             <Route path="/profile" component={Profile} />
//             <Route component={NotFound} />
//           </Switch>
//         </AppLayout>
//       </Show>
//       <Show when="signed-out">
//         <Redirect to="/" />
//       </Show>
//     </>
//   );
// }

// function ClerkQueryClientCacheInvalidator() {
//   const { addListener } = useClerk();
//   const qc = useQueryClient();
//   const prevUserIdRef = useRef<string | null | undefined>(undefined);

//   useEffect(() => {
//     const unsubscribe = addListener(({ user }) => {
//       const userId = user?.id ?? null;
//       if (
//         prevUserIdRef.current !== undefined &&
//         prevUserIdRef.current !== userId
//       ) {
//         qc.clear();
//       }
//       prevUserIdRef.current = userId;
//     });
//     return unsubscribe;
//   }, [addListener, qc]);

//   return null;
// }

// function ClerkProviderWithRoutes() {
//   const [, setLocation] = useLocation();

//   return (
//     <ClerkProvider
//       publishableKey={clerkPubKey}
//       proxyUrl={clerkProxyUrl}
//       appearance={clerkAppearance}
//       signInUrl={`${basePath}/sign-in`}
//       signUpUrl={`${basePath}/sign-up`}
//       localization={{
//         signIn: {
//           start: {
//             title: "Welcome back",
//             subtitle: "Sign in to continue your Japanese journey",
//           },
//         },
//         signUp: {
//           start: {
//             title: "Start learning Japanese",
//             subtitle: "Create your free NihonFlow account",
//           },
//         },
//       }}
//       routerPush={(to) => setLocation(stripBase(to))}
//       routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
//     >
//       <QueryClientProvider client={queryClient}>
//         <ClerkQueryClientCacheInvalidator />
//         <TooltipProvider>
//           <Switch>
//             <Route path="/" component={HomeRedirect} />
//             <Route path="/sign-in/*?" component={SignInPage} />
//             <Route path="/sign-up/*?" component={SignUpPage} />
//             <Route component={AuthenticatedApp} />
//           </Switch>
//           <Toaster />
//         </TooltipProvider>
//       </QueryClientProvider>
//     </ClerkProvider>
//   );
// }

// function App() {
//   return (
//     <WouterRouter base={basePath}>
//       <ClerkProviderWithRoutes />
//     </WouterRouter>
//   );
// }

// export default App;











// import { useEffect, useRef } from "react";
// import { ClerkProvider, Show, useClerk } from "@clerk/react";
// import { shadcn } from "@clerk/themes";
// import {
//   Switch,
//   Route,
//   useLocation,
//   Redirect,
//   Router as WouterRouter,
// } from "wouter";

// import {
//   QueryClient,
//   QueryClientProvider,
//   useQueryClient,
// } from "@tanstack/react-query";

// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";

// import { AppLayout } from "@/components/layout/AppLayout";

// import Landing from "@/pages/Landing";
// import Dashboard from "@/pages/Dashboard";
// import Hiragana from "@/pages/Hiragana";
// import Katakana from "@/pages/Katakana";
// import Flashcards from "@/pages/Flashcards";
// import Quiz from "@/pages/Quiz";
// import Profile from "@/pages/Profile";
// import NotFound from "@/pages/not-found";
// import SignInPage from "@/pages/SignIn";
// import SignUpPage from "@/pages/SignUp";

// const queryClient = new QueryClient();

// const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

// const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// function stripBase(path: string): string {
//   return basePath && path.startsWith(basePath)
//     ? path.slice(basePath.length) || "/"
//     : path;
// }

// if (!clerkPubKey) {
//   throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
// }

// const clerkAppearance = {
//   theme: shadcn,
//   cssLayerName: "clerk",

//   options: {
//     logoPlacement: "inside" as const,
//     logoLinkUrl: basePath || "/",
//     logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
//   },

//   variables: {
//     colorPrimary: "hsl(270, 80%, 65%)",
//     colorForeground: "hsl(210, 40%, 95%)",
//     colorMutedForeground: "hsl(215, 20%, 65%)",
//     colorDanger: "hsl(0, 84%, 60%)",
//     colorBackground: "hsl(222, 47%, 11%)",
//     colorInput: "hsl(222, 40%, 18%)",
//     colorInputForeground: "hsl(210, 40%, 95%)",
//     colorNeutral: "hsl(222, 40%, 25%)",
//     fontFamily: "'Inter', sans-serif",
//     borderRadius: "0.75rem",
//   },

//   elements: {
//     rootBox: "w-full flex justify-center",

//     cardBox:
//       "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden shadow-2xl shadow-purple-900/20 border border-white/5",

//     card: "!shadow-none !border-0 !bg-transparent !rounded-none",

//     footer: "!shadow-none !border-0 !bg-transparent !rounded-none",

//     headerTitle: "text-foreground font-bold tracking-tight",

//     headerSubtitle: "text-muted-foreground",

//     socialButtonsBlockButtonText: "text-foreground font-medium",

//     formFieldLabel: "text-foreground font-medium",

//     footerActionLink: "text-primary hover:opacity-80 font-medium",

//     footerActionText: "text-muted-foreground",

//     dividerText: "text-muted-foreground",

//     identityPreviewEditButton: "text-primary",

//     formFieldSuccessText: "text-green-400",

//     alertText: "text-foreground",

//     logoBox: "flex justify-center mb-1",

//     logoImage: "h-10 w-auto",

//     socialButtonsBlockButton:
//       "border border-white/10 bg-white/5 hover:bg-white/10 transition-colors",

//     formButtonPrimary:
//       "bg-primary hover:opacity-90 text-white font-semibold transition-opacity",

//     formFieldInput:
//       "bg-input border-white/10 text-foreground focus:border-primary/50",

//     footerAction: "bg-transparent",

//     dividerLine: "bg-white/10",

//     alert: "bg-destructive/10 border border-destructive/20",

//     otpCodeFieldInput: "bg-input border-white/10 text-foreground",

//     formFieldRow: "",

//     main: "",
//   },
// };

// function HomeRedirect() {
//   return (
//     <>
//       <Show when="signed-in">
//         <Redirect to="/dashboard" />
//       </Show>

//       <Show when="signed-out">
//         <Landing />
//       </Show>
//     </>
//   );
// }

// function AuthenticatedRoutes() {
//   return (
//     <>
//       <Show when="signed-in">
//         <AppLayout>
//           <Switch>
//             <Route path="/dashboard" component={Dashboard} />

//             <Route path="/hiragana" component={Hiragana} />

//             <Route path="/katakana" component={Katakana} />

//             <Route path="/flashcards" component={Flashcards} />

//             <Route path="/quiz" component={Quiz} />

//             <Route path="/profile" component={Profile} />

//             <Route>
//               <NotFound />
//             </Route>
//           </Switch>
//         </AppLayout>
//       </Show>

//       <Show when="signed-out">
//         <Redirect to="/" />
//       </Show>
//     </>
//   );
// }

// function ClerkQueryClientCacheInvalidator() {
//   const { addListener } = useClerk();

//   const qc = useQueryClient();

//   const prevUserIdRef = useRef<string | null | undefined>(undefined);

//   useEffect(() => {
//     const unsubscribe = addListener(({ user }) => {
//       const userId = user?.id ?? null;

//       if (
//         prevUserIdRef.current !== undefined &&
//         prevUserIdRef.current !== userId
//       ) {
//         qc.clear();
//       }

//       prevUserIdRef.current = userId;
//     });

//     return unsubscribe;
//   }, [addListener, qc]);

//   return null;
// }

// function ClerkProviderWithRoutes() {
//   const [, setLocation] = useLocation();

//   return (
//     <ClerkProvider
//       publishableKey={clerkPubKey}
//       proxyUrl={clerkProxyUrl}
//       appearance={clerkAppearance}
//       signInUrl={`${basePath}/sign-in`}
//       signUpUrl={`${basePath}/sign-up`}
//       localization={{
//         signIn: {
//           start: {
//             title: "Welcome back",
//             subtitle: "Sign in to continue your Japanese journey",
//           },
//         },

//         signUp: {
//           start: {
//             title: "Start learning Japanese",
//             subtitle: "Create your free NihonFlow account",
//           },
//         },
//       }}
//       routerPush={(to) => setLocation(stripBase(to))}
//       routerReplace={(to) =>
//         setLocation(stripBase(to), { replace: true })
//       }
//     >
//       <QueryClientProvider client={queryClient}>
//         <ClerkQueryClientCacheInvalidator />

//         <TooltipProvider>
//           <Switch>
//             <Route path="/" component={HomeRedirect} />

//             <Route path="/sign-in/*?" component={SignInPage} />

//             <Route path="/sign-up/*?" component={SignUpPage} />
//           </Switch>

//           <AuthenticatedRoutes />

//           <Toaster />
//         </TooltipProvider>
//       </QueryClientProvider>
//     </ClerkProvider>
//   );
// }

// function App() {
//   return (
//     <WouterRouter base={basePath}>
//       <ClerkProviderWithRoutes />
//     </WouterRouter>
//   );
// }

// export default App;



import { ClerkProvider, SignedIn, SignedOut } from "@clerk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route, Redirect } from "wouter";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route path="/">
            <SignedOut>
              <Landing />
            </SignedOut>

            <SignedIn>
              <Redirect to="/dashboard" />
            </SignedIn>
          </Route>

          <Route path="/dashboard">
            <SignedIn>
              <Dashboard />
            </SignedIn>

            <SignedOut>
              <Redirect to="/" />
            </SignedOut>
          </Route>
        </Switch>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;

















// import Dashboard from "@/pages/Dashboard";

// function App() {
//   return <Dashboard />;
// }

// export default App;


// import Landing from "@/pages/Landing";

// function App() {
//   return <Landing />;
// }

// export default App;



// function App() {
//   return (
//     <div
//       style={{
//         background: "#111",
//         color: "white",
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         fontSize: "40px",
//       }}
//     >
//       NihonFlow is Working 🚀
//     </div>
//   );
// }
// export default App;
