export interface Answer {
  _id: string;
  content: string;
  username: string;
  createdAt: string;
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  username: string;
  votes: number;
  answers: Answer[];
  createdAt: string;
  isPending?: boolean;
  isNew?: boolean;
  hasVoted?: boolean;
}
