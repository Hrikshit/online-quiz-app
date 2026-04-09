import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, BookOpen, Trash2, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Quiz, Question } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateQuizDialogProps {
  onQuizCreated: (quiz: { title: string; subject: string; description: string; questions: Question[] }) => void;
}

export function CreateQuizDialog({ onQuizCreated }: CreateQuizDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Questions
  
  // Quiz Details
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  
  // Question Builder
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setDescription("");
    setQuestions([]);
    setCurrentQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setStep(1);
  };

  const handleAddQuestion = () => {
    if (!currentQuestionText || options.some(opt => !opt)) return;

    const newQuestion: Question = {
      id: Math.random().toString(36).substring(7),
      text: currentQuestionText,
      options: [...options],
      correctAnswer,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleCreate = () => {
    if (!title || !subject || questions.length === 0) return;

    onQuizCreated({
      title,
      subject,
      description,
      questions,
    });
    setOpen(false);
    resetForm();
  };

  const isQuestionValid = currentQuestionText && options.every(opt => opt.trim() !== "");

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold shadow-xl shadow-indigo-900/20">
          <Plus className="w-5 h-5 mr-2" />
          Create Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-foreground max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            {step === 1 ? "Quiz Details" : "Add Questions"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 1 
              ? "Start by giving your quiz a title and subject." 
              : `Add questions to your quiz. You have added ${questions.length} questions.`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          {step === 1 ? (
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-medium">Quiz Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. DSA Fundamentals"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-indigo-500/50 transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <Select onValueChange={setSubject} value={subject}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10 text-foreground">
                    <SelectItem value="DSA">DSA</SelectItem>
                    <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Briefly describe what this quiz covers"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8 py-4">
              {/* Question List */}
              {questions.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Added Questions</Label>
                  <div className="space-y-2">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-indigo-400">Q{idx + 1}</span>
                          <span className="text-sm font-medium truncate max-w-[300px]">{q.text}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Question Form */}
              <div className="space-y-6 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold">Question Text</Label>
                  <Input
                    placeholder="Enter your question here"
                    value={currentQuestionText}
                    onChange={(e) => setCurrentQuestionText(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="grid gap-4">
                  <Label className="text-sm font-semibold">Options (Select the correct one)</Label>
                  <RadioGroup value={correctAnswer.toString()} onValueChange={(val) => setCorrectAnswer(parseInt(val))}>
                    {options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="border-white/20" />
                        <Input
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[idx] = e.target.value;
                            setOptions(newOptions);
                          }}
                          className="bg-white/5 border-white/10 h-9"
                        />
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button 
                  onClick={handleAddQuestion} 
                  disabled={!isQuestionValid}
                  variant="secondary"
                  className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Quiz
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t border-white/5">
          {step === 1 ? (
            <Button 
              onClick={() => setStep(2)} 
              disabled={!title || !subject}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 font-bold text-lg"
            >
              Next: Add Questions
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <div className="flex gap-3 w-full">
              <Button 
                variant="ghost"
                onClick={() => setStep(1)}
                className="flex-1 rounded-xl py-6 font-bold"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={questions.length === 0}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 font-bold text-lg"
              >
                <Check className="w-5 h-5 mr-2" />
                Finish & Create
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
