import React, { useState } from "react";
import { Quiz } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Trophy, ArrowRight, ArrowLeft, CheckCircle2, XCircle, RotateCcw, Home } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuizPlayerProps {
  quiz: Quiz;
  onClose: () => void;
  onFinish: (score: number, total: number) => void;
}

export function QuizPlayer({ quiz, onClose, onFinish }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = { ...answers, [currentQuestionIndex]: selectedAnswer };
      setAnswers(newAnswers);
      
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(newAnswers[currentQuestionIndex + 1] ?? null);
      } else {
        const finalScore = Object.entries(newAnswers).reduce((acc, [idx, ans]) => {
          return acc + (ans === quiz.questions[parseInt(idx)].correctAnswer ? 1 : 0);
        }, 0);
        onFinish(finalScore, quiz.questions.length);
        setIsFinished(true);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  if (isFinished) {
    const score = calculateScore();
    const percentage = Math.round((score / quiz.questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto py-12 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full" />
            <Trophy className="w-32 h-32 text-yellow-400 mx-auto relative z-10 drop-shadow-2xl" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">Quiz Completed!</h2>
            <p className="text-muted-foreground text-lg">
              Great job! You've finished the <strong>{quiz.title}</strong> quiz.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-white/5 p-6">
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-1">Score</p>
              <p className="text-3xl font-bold text-indigo-400">{score} / {quiz.questions.length}</p>
            </Card>
            <Card className="bg-card border-white/5 p-6">
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-emerald-400">{percentage}%</p>
            </Card>
          </div>

          <div className="space-y-4 pt-4">
            <Button 
              onClick={() => {
                setCurrentQuestionIndex(0);
                setAnswers({});
                setSelectedAnswer(null);
                setIsFinished(false);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 font-bold text-lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full border-white/10 hover:bg-white/5 rounded-xl py-6 font-bold text-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (quiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center space-y-6">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">No Questions Found</h2>
          <p className="text-muted-foreground">This quiz doesn't have any questions yet.</p>
        </div>
        <Button onClick={onClose} variant="outline" className="rounded-xl px-8">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Quiz
          </Button>
          <div className="text-sm font-bold tracking-widest text-indigo-400 uppercase">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2 bg-white/5" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card border-white/5 p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-12">
                {currentQuestion.text}
              </h3>

              <RadioGroup 
                value={selectedAnswer?.toString()} 
                onValueChange={(val) => setSelectedAnswer(parseInt(val))}
                className="space-y-4"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="relative">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex items-center justify-between p-4 rounded-2xl border-2 border-white/5 bg-white/[0.02] peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500/10 cursor-pointer transition-all hover:bg-white/5"
                    >
                      <span className="text-lg font-medium">{option}</span>
                      <div className="w-6 h-6 rounded-full border-2 border-white/10 peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-500 flex items-center justify-center">
                        {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="rounded-xl px-6 h-12 font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-indigo-900/20"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
