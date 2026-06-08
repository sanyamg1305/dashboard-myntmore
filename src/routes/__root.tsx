import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useNavigate,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

function NotFoundComponent() {
  const navigate = useNavigate()
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h1 style={{ fontSize: '80px', fontWeight: 'bold', color: '#000' }}>404</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Page not found.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => router.history.back()}
            style={{ padding: '10px 20px', border: '1px solid #E5E5E5', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>
            ← Go Back
          </button>
          <button onClick={() => navigate({ to: '/dashboard' })}
            style={{ padding: '10px 20px', background: '#FFC947', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLayout />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  const { user, loading, isClient } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const noSidebarPaths = ['/login', '/accept-invite', '/portal'];
  const isAuthPath = noSidebarPaths.some(p => path.startsWith(p));
  const showSidebar = user && !isAuthPath;

  // Guard: redirect client users away from internal pages
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (isClient && !path.startsWith('/portal') && !path.startsWith('/login')) {
      navigate({ to: '/portal' });
    }
  }, [loading, user, isClient, path]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!showSidebar) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
