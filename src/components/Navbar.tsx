import { Button } from "@/components/ui/button";
import { LayoutGrid, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  user: { name: string | null; photo: string | null } | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function Navbar({ user, onSignIn, onSignOut }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <div className="bg-primary p-2 rounded-lg">
          <LayoutGrid className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight">HRS QUIZ</span>
      </div>
      
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold leading-none">{user.name}</p>
              <button 
                onClick={onSignOut}
                className="text-[10px] text-muted-foreground hover:text-destructive transition-colors uppercase font-bold tracking-tighter"
              >
                Sign Out
              </button>
            </div>
            <Avatar className="w-10 h-10 border border-white/10">
              <AvatarImage src={user.photo || ""} />
              <AvatarFallback className="bg-indigo-600 text-white font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onSignOut}
              className="md:hidden text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <Button 
            variant="secondary" 
            onClick={onSignIn}
            className="rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white border-none"
          >
            Sign In with Google
          </Button>
        )}
      </div>
    </nav>
  );
}
