import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Clock, Trash2 } from "lucide-react";
import { Quiz } from "../types";

export interface QuizCardProps {
  quiz: Quiz;
  onStart: (quiz: Quiz) => void;
  onRemove?: (id: string) => void;
  isAuthor?: boolean;
  key?: React.Key;
}

export function QuizCard({ quiz, onStart, onRemove, isAuthor }: QuizCardProps) {
  return (
    <Card className="bg-card border-white/5 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-none">
            {quiz.subject}
          </Badge>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
            <Clock className="w-3 h-3" />
            {new Date(quiz.createdAt).toLocaleDateString()}
          </div>
        </div>
        <CardTitle className="text-xl font-bold group-hover:text-indigo-400 transition-colors">
          {quiz.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {quiz.description || "No description provided for this quiz."}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{quiz.questions.length} Questions</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthor && onRemove && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                onClick={() => onRemove(quiz.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              onClick={() => onStart(quiz)}
            >
              <Play className="w-3 h-3 mr-2 fill-current" />
              Start
            </Button>
          </div>
        </div>
      </CardContent>
      {isAuthor && (
        <div className="absolute top-0 right-0 p-1">
          <Badge variant="outline" className="text-[8px] border-indigo-500/20 text-indigo-400 bg-indigo-500/5">
            MY QUIZ
          </Badge>
        </div>
      )}
    </Card>
  );
}
