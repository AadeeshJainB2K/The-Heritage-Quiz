export type QuizQuestion = {
  id: number;
  category: "monuments" | "foods" | "dances" | "general";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: "monuments",
    difficulty: "easy",
    question: "Which monument is also known as the 'Palace of Winds'?",
    options: [
      "Red Fort",
      "Hawa Mahal",
      "Gateway of India",
      "Victoria Memorial",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Hawa Mahal in Jaipur, built in 1799, is famous for its intricate latticed windows.",
  },
  {
    id: 2,
    category: "monuments",
    difficulty: "easy",
    question: "The Taj Mahal is located in which state?",
    options: ["Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Karnataka"],
    correctAnswerIndex: 1,
    explanation:
      "The Taj Mahal is in Agra, Uttar Pradesh, built by Emperor Shah Jahan for his wife Mumtaz Mahal.",
  },
  {
    id: 3,
    category: "monuments",
    difficulty: "medium",
    question: "In which century was the Red Fort constructed?",
    options: ["16th century", "17th century", "18th century", "19th century"],
    correctAnswerIndex: 1,
    explanation:
      "The Red Fort was built by Emperor Shah Jahan in the 17th century (1638-1648).",
  },
  {
    id: 4,
    category: "monuments",
    difficulty: "hard",
    question: "Who designed the Taj Mahal?",
    options: ["Ustad Ahmad Lahori", "Michelangelo", "I.M. Pei", "Le Corbusier"],
    correctAnswerIndex: 0,
    explanation: "Ustad Ahmad Lahori was the chief architect of the Taj Mahal.",
  },
  {
    id: 5,
    category: "foods",
    difficulty: "easy",
    question: "Idli and Dosa originate from which region?",
    options: ["North India", "South India", "East India", "West India"],
    correctAnswerIndex: 1,
    explanation:
      "Idli and Dosa are iconic South Indian dishes that originated in Tamil Nadu and Kerala.",
  },
  {
    id: 6,
    category: "foods",
    difficulty: "medium",
    question: "Which Indian bread is associated with Punjab?",
    options: ["Dosa", "Puri", "Naan", "Dhokla"],
    correctAnswerIndex: 2,
    explanation:
      "Naan is a traditional flatbread from North India, especially popular in Punjab.",
  },
  {
    id: 7,
    category: "dances",
    difficulty: "easy",
    question: "Kathakali is a classical dance form from which state?",
    options: ["Tamil Nadu", "Kerala", "Odisha", "Karnataka"],
    correctAnswerIndex: 1,
    explanation:
      "Kathakali is a classical dance form from Kerala, known for elaborate makeup and costumes.",
  },
  {
    id: 8,
    category: "dances",
    difficulty: "medium",
    question: "Bharatanatyam dance originated in which state?",
    options: ["Karnataka", "Tamil Nadu", "Telangana", "Andhra Pradesh"],
    correctAnswerIndex: 1,
    explanation:
      "Bharatanatyam is a classical dance form that originated in Tamil Nadu temples.",
  },
  {
    id: 9,
    category: "general",
    difficulty: "medium",
    question: "What is the official national animal of India?",
    options: ["Leopard", "Tiger", "Lion", "Elephant"],
    correctAnswerIndex: 1,
    explanation: "The Bengal Tiger is the national animal of India.",
  },
  {
    id: 10,
    category: "general",
    difficulty: "hard",
    question:
      "Which temple is considered the richest in the world by donation?",
    options: [
      "Golden Temple",
      "Tirupati Temple",
      "Varanasi Temple",
      "Meenakshi Temple",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Tirupati Temple in Andhra Pradesh is the world's richest temple by donation.",
  },
];
