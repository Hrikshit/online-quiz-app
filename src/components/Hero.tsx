import { Badge } from "@/components/ui/badge";
import { Sparkles, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { CreateQuizDialog } from "./CreateQuizDialog";
import { Quiz } from "../types";

interface HeroProps {
  onQuizCreated: (quiz: Quiz) => void;
}

export function Hero({ onQuizCreated }: HeroProps) {
  return (
    <section className="px-6 py-8 max-w-7xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="flex-1 space-y-8 relative z-10">
          <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none px-4 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 w-fit">
            <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">Level up your knowledge</span>
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            Master Any Subject <br />
            with <span className="text-white/90">HRS QUIZ</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
            Create interactive quizzes in seconds, challenge your friends, and track your progress with our beautiful dashboard.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <CreateQuizDialog onQuizCreated={onQuizCreated} />
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-3 border border-white/10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-[10px] font-bold text-white">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-white">Join 500+ learners</span>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10 hidden lg:block"
        >
          <div className="relative w-72 h-72 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl rotate-3">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
            <Trophy className="w-40 h-40 text-white drop-shadow-2xl" />
          </div>
          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg -rotate-12">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
