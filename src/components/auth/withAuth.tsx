import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Loader2 } from "lucide-react";

export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function WithAuthComponent(props: T) {
    const { isAuthenticated, loading } = useSupabaseAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate("/auth", { replace: true });
      }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
