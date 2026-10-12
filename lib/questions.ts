import type { Question, SectionId } from "./types"

export const QUESTIONS: Record<SectionId, Question[]> = {
  mathematics: [
    {
      id: 1,
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2x²"],
      correctAnswer: 1,
      explanation: "The derivative of x² is 2x using the power rule: d/dx(xⁿ) = n·xⁿ⁻¹",
    },
    {
      id: 2,
      question: "What is the value of π (pi) approximately?",
      options: ["3.14159", "2.71828", "1.41421", "1.61803"],
      correctAnswer: 0,
      explanation:
        "π (pi) is approximately 3.14159, representing the ratio of a circle's circumference to its diameter",
    },
    {
      id: 3,
      question: "What is the solution to the equation 2x + 5 = 15?",
      options: ["x = 5", "x = 10", "x = 7.5", "x = 20"],
      correctAnswer: 0,
      explanation: "Solving 2x + 5 = 15: subtract 5 from both sides (2x = 10), then divide by 2 (x = 5)",
    },
    {
      id: 4,
      question: "What is the area of a circle with radius 3?",
      options: ["6π", "9π", "18π", "3π"],
      correctAnswer: 1,
      explanation: "Area of a circle = πr². With radius 3: π × 3² = 9π",
    },
    {
      id: 5,
      question: "What is the square root of 144?",
      options: ["11", "12", "13", "14"],
      correctAnswer: 1,
      explanation: "√144 = 12 because 12 × 12 = 144",
    },
    {
      id: 6,
      question: "What is 7! (7 factorial)?",
      options: ["49", "343", "5040", "720"],
      correctAnswer: 2,
      explanation: "7! = 7 × 6 × 5 × 4 × 3 × 2 × 1 = 5040",
    },
    {
      id: 7,
      question: "What is the slope of the line y = 3x + 2?",
      options: ["2", "3", "5", "1"],
      correctAnswer: 1,
      explanation: "In the equation y = mx + b, m is the slope. Here, m = 3",
    },
    {
      id: 8,
      question: "What is sin(90°)?",
      options: ["0", "1", "0.5", "√3/2"],
      correctAnswer: 1,
      explanation: "sin(90°) = 1. This is a fundamental trigonometric value",
    },
    {
      id: 9,
      question: "What is the sum of interior angles in a triangle?",
      options: ["90°", "180°", "270°", "360°"],
      correctAnswer: 1,
      explanation: "The sum of interior angles in any triangle is always 180°",
    },
    {
      id: 10,
      question: "What is the quadratic formula?",
      options: [
        "x = -b ± √(b² - 4ac) / 2a",
        "x = b ± √(b² + 4ac) / 2a",
        "x = -b ± √(b² + 4ac) / 2a",
        "x = b ± √(b² - 4ac) / 2a",
      ],
      correctAnswer: 0,
      explanation: "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a for equations of the form ax² + bx + c = 0",
    },
  ],
  programming: [
    {
      id: 11,
      question: "What does 'DOM' stand for in web development?",
      options: ["Document Object Model", "Data Object Management", "Dynamic Object Method", "Document Oriented Model"],
      correctAnswer: 0,
      explanation: "DOM stands for Document Object Model, which represents the structure of HTML documents as objects",
    },
    {
      id: 12,
      question: "Which of these is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Symbol"],
      correctAnswer: 2,
      explanation: "JavaScript doesn't have a 'Float' data type. Numbers in JavaScript are all of type 'Number'",
    },
    {
      id: 13,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      explanation:
        "Binary search has O(log n) time complexity because it eliminates half of the search space in each iteration",
    },
    {
      id: 14,
      question: "Which HTTP method is used to update existing data?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correctAnswer: 2,
      explanation: "PUT is typically used to update existing resources, while POST creates new resources",
    },
    {
      id: 15,
      question: "What does 'SQL' stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Language",
        "Sequential Query Language",
      ],
      correctAnswer: 0,
      explanation: "SQL stands for Structured Query Language, used for managing relational databases",
    },
    {
      id: 16,
      question: "In object-oriented programming, what is encapsulation?",
      options: [
        "Hiding implementation details",
        "Creating multiple objects",
        "Inheriting from parent class",
        "Overriding methods",
      ],
      correctAnswer: 0,
      explanation:
        "Encapsulation is the principle of hiding internal implementation details and exposing only necessary interfaces",
    },
    {
      id: 17,
      question: "What is the output of console.log(typeof null) in JavaScript?",
      options: ["null", "undefined", "object", "boolean"],
      correctAnswer: 2,
      explanation:
        "This is a known JavaScript quirk: typeof null returns 'object', though null is not actually an object",
    },
    {
      id: 18,
      question: "Which data structure follows LIFO (Last In, First Out)?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      explanation: "Stack follows LIFO principle - the last element added is the first one to be removed",
    },
    {
      id: 19,
      question: "What does 'API' stand for?",
      options: [
        "Application Programming Interface",
        "Automated Program Integration",
        "Advanced Programming Implementation",
        "Application Process Integration",
      ],
      correctAnswer: 0,
      explanation:
        "API stands for Application Programming Interface, which defines how software components communicate",
    },
    {
      id: 20,
      question: "Which of these is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
      correctAnswer: 2,
      explanation: "MongoDB is a NoSQL (document-based) database, while the others are relational (SQL) databases",
    },
  ],
  generalKnowledge: [
    {
      id: 21,
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: 2,
      explanation: "Canberra is the capital of Australia, though Sydney and Melbourne are larger cities",
    },
    {
      id: 22,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      correctAnswer: 1,
      explanation: "Leonardo da Vinci painted the Mona Lisa between 1503-1519, and it's housed in the Louvre Museum",
    },
    {
      id: 23,
      question: "What is the largest planet in our solar system?",
      options: ["Saturn", "Jupiter", "Neptune", "Earth"],
      correctAnswer: 1,
      explanation:
        "Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined",
    },
    {
      id: 24,
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1,
      explanation: "World War II ended in 1945 with Japan's surrender on September 2, 1945",
    },
    {
      id: 25,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2,
      explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'",
    },
    {
      id: 26,
      question: "Which ocean is the largest?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3,
      explanation: "The Pacific Ocean is the largest ocean, covering about 46% of the world's water surface",
    },
    {
      id: 27,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: 1,
      explanation: "William Shakespeare wrote 'Romeo and Juliet' around 1594-1596",
    },
    {
      id: 28,
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      correctAnswer: 2,
      explanation: "Diamond is the hardest natural substance on Earth, rating 10 on the Mohs hardness scale",
    },
    {
      id: 29,
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      explanation:
        "There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia",
    },
    {
      id: 30,
      question: "What is the smallest country in the world?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correctAnswer: 1,
      explanation: "Vatican City is the smallest country in the world, with an area of just 0.17 square miles",
    },
  ],
}

export interface SectionMeta {
  id: SectionId
  title: string
  description: string
  mode: "sequential" | "batch"
  modeLabel: string
}

export const SECTION_META: Record<SectionId, SectionMeta> = {
  mathematics: {
    id: "mathematics",
    title: "Mathematics",
    description: "Derivatives, geometry, and core numeric reasoning.",
    mode: "sequential",
    modeLabel: "One-by-one · instant feedback",
  },
  programming: {
    id: "programming",
    title: "Programming",
    description: "Language fundamentals, complexity, and web concepts.",
    mode: "batch",
    modeLabel: "10 questions · batch submission",
  },
  generalKnowledge: {
    id: "generalKnowledge",
    title: "General Knowledge",
    description: "Geography, history, science, and culture.",
    mode: "batch",
    modeLabel: "10 questions · batch submission",
  },
}

export const SECTION_ORDER: SectionId[] = ["mathematics", "programming", "generalKnowledge"]

export const QUESTIONS_PER_SECTION = 10

export const TOTAL_QUESTIONS = SECTION_ORDER.length * QUESTIONS_PER_SECTION
