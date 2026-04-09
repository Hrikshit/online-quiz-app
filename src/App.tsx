import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { ActivityFeed, ActivityItem } from "./components/ActivityFeed";
import { QuizCard } from "./components/QuizCard";
import { QuizPlayer } from "./components/QuizPlayer";
import { Quiz } from "./types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  limit
} from "./lib/firebase";
import { User } from "firebase/auth";

export default function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Quizzes Listener
  useEffect(() => {
    const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const quizList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quiz[];
      setQuizzes(quizList);
    }, (error) => {
      console.error("Firestore Error (quizzes):", error);
    });
    return () => unsubscribe();
  }, []);

  // Activities Listener
  useEffect(() => {
    const q = query(collection(db, "activities"), orderBy("createdAt", "desc"), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activityList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: "Now" // Simplified for display
      })) as ActivityItem[];
      setActivities(activityList);
    }, (error) => {
      console.error("Firestore Error (activities):", error);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Failed to sign in with Google.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.info("Signed out successfully.");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const addActivity = async (userName: string, action: string, avatar: string) => {
    try {
      await addDoc(collection(db, "activities"), {
        user: userName,
        action,
        avatar,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const handleQuizCreated = async (newQuiz: Omit<Quiz, 'id'>) => {
    if (!user) {
      toast.error("Please sign in to create a quiz.");
      return;
    }

    try {
      const quizData = {
        ...newQuiz,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        createdAt: Date.now()
      };
      await addDoc(collection(db, "quizzes"), quizData);
      
      addActivity(user.displayName || "Anonymous", `Created quiz: ${newQuiz.title}`, (user.displayName || "A").charAt(0).toUpperCase());
      toast.success("Quiz Created!", {
        description: `"${newQuiz.title}" is now live on your dashboard.`,
      });
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz.");
    }
  };

  const handleRemoveQuiz = async (quizId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      toast.success("Quiz removed successfully.");
    } catch (error) {
      console.error("Error removing quiz:", error);
      toast.error("Failed to remove quiz.");
    }
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
  };

  const handleQuizFinished = (score: number, total: number) => {
    if (activeQuiz && user) {
      const userName = user.displayName || "Anonymous";
      addActivity(userName, `Scored ${score}/${total} in ${activeQuiz.title}`, userName.charAt(0).toUpperCase());
      toast.info("Quiz Completed!", {
        description: `${userName} scored ${score} out of ${total} in ${activeQuiz.title}.`,
      });
    }
  };

  const navbarUser = user ? { name: user.displayName, photo: user.photoURL } : null;

  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
        <Navbar 
          user={navbarUser} 
          onSignIn={handleSignIn} 
          onSignOut={handleSignOut} 
        />
        <QuizPlayer 
          quiz={activeQuiz} 
          onClose={() => setActiveQuiz(null)} 
          onFinish={handleQuizFinished}
        />
        <Toaster position="top-right" theme="dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      <Navbar 
        user={navbarUser} 
        onSignIn={handleSignIn} 
        onSignOut={handleSignOut} 
      />
      
      <main className="pb-20 space-y-8">
        <Hero onQuizCreated={handleQuizCreated} />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <Stats quizCount={quizzes.length} />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Recent Quizzes</h2>
                <span className="text-sm text-muted-foreground font-medium">View all</span>
              </div>

              {quizzes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes.map((quiz) => (
                    <QuizCard 
                      key={quiz.id} 
                      quiz={quiz} 
                      onStart={handleStartQuiz}
                      onRemove={handleRemoveQuiz}
                      isAuthor={user?.uid === quiz.authorId}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02]">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">No quizzes yet</h3>
                    <p className="text-muted-foreground max-w-xs">
                      Start your learning journey by creating your first interactive quiz.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </main>
      
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}
