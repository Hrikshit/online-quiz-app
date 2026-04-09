export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  description: string;
  questions: Question[];
  createdAt: number;
  authorId: string;
  authorName: string;
}
