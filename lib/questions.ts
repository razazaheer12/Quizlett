import type { Question, QuestionCountChoice, SectionId } from "./types"

export const QUESTIONS: Record<SectionId, Question[]> = {
  mathematics: [
    {
      id: 1,
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2x²"],
      correctAnswer: 1,
      explanation: "The derivative of x² is 2x using the power rule: d/dx(xⁿ) = n·xⁿ⁻¹",
      difficulty: "medium",
      topic: "Calculus",
    },
    {
      id: 2,
      question: "What is the value of π (pi) approximately?",
      options: ["3.14159", "2.71828", "1.41421", "1.61803"],
      correctAnswer: 0,
      explanation:
        "π (pi) is approximately 3.14159, representing the ratio of a circle's circumference to its diameter",
      difficulty: "easy",
      topic: "Geometry",
    },
    {
      id: 3,
      question: "What is the solution to the equation 2x + 5 = 15?",
      options: ["x = 5", "x = 10", "x = 7.5", "x = 20"],
      correctAnswer: 0,
      explanation: "Solving 2x + 5 = 15: subtract 5 from both sides (2x = 10), then divide by 2 (x = 5)",
      difficulty: "easy",
      topic: "Algebra",
    },
    {
      id: 4,
      question: "What is the area of a circle with radius 3?",
      options: ["6π", "9π", "18π", "3π"],
      correctAnswer: 1,
      explanation: "Area of a circle = πr². With radius 3: π × 3² = 9π",
      difficulty: "easy",
      topic: "Geometry",
    },
    {
      id: 5,
      question: "What is the square root of 144?",
      options: ["11", "12", "13", "14"],
      correctAnswer: 1,
      explanation: "√144 = 12 because 12 × 12 = 144",
      difficulty: "easy",
      topic: "Algebra",
    },
    {
      id: 6,
      question: "What is 7! (7 factorial)?",
      options: ["49", "343", "5040", "720"],
      correctAnswer: 2,
      explanation: "7! = 7 × 6 × 5 × 4 × 3 × 2 × 1 = 5040",
      difficulty: "medium",
      topic: "Combinatorics",
    },
    {
      id: 7,
      question: "What is the slope of the line y = 3x + 2?",
      options: ["2", "3", "5", "1"],
      correctAnswer: 1,
      explanation: "In the equation y = mx + b, m is the slope. Here, m = 3",
      difficulty: "easy",
      topic: "Algebra",
    },
    {
      id: 8,
      question: "What is sin(90°)?",
      options: ["0", "1", "0.5", "√3/2"],
      correctAnswer: 1,
      explanation: "sin(90°) = 1. This is a fundamental trigonometric value",
      difficulty: "easy",
      topic: "Trigonometry",
    },
    {
      id: 9,
      question: "What is the sum of interior angles in a triangle?",
      options: ["90°", "180°", "270°", "360°"],
      correctAnswer: 1,
      explanation: "The sum of interior angles in any triangle is always 180°",
      difficulty: "easy",
      topic: "Geometry",
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
      explanation:
        "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a for equations of the form ax² + bx + c = 0",
      difficulty: "medium",
      topic: "Algebra",
    },
    {
      id: 31,
      question: "What is the median of the set {3, 7, 9, 12, 15}?",
      options: ["7", "9", "12", "10"],
      correctAnswer: 1,
      explanation:
        "The median is the middle value of an ordered set. With five values, the third one — 9 — is the median.",
      difficulty: "medium",
      topic: "Statistics",
    },
    {
      id: 32,
      question: "What is the value of 3² + 4²?",
      options: ["25", "12", "7", "49"],
      correctAnswer: 0,
      explanation: "3² = 9 and 4² = 16, so 3² + 4² = 9 + 16 = 25.",
      difficulty: "easy",
      topic: "Algebra",
    },
    {
      id: 33,
      question: "What is the indefinite integral of 1/x with respect to x (for x ≠ 0)?",
      options: ["ln|x| + C", "x²/2 + C", "-1/x² + C", "eˣ + C"],
      correctAnswer: 0,
      explanation:
        "∫(1/x) dx = ln|x| + C, because the derivative of ln|x| is 1/x. The absolute value covers negative x.",
      difficulty: "hard",
      topic: "Calculus",
    },
    {
      id: 34,
      question: "What is the value of cos(0°)?",
      options: ["0", "1", "-1", "0.5"],
      correctAnswer: 1,
      explanation: "cos(0°) = 1. At zero degrees the point on the unit circle is (1, 0), whose x-coordinate is 1.",
      difficulty: "medium",
      topic: "Trigonometry",
    },
    {
      id: 35,
      question: "What is the volume of a cube with side length 4?",
      options: ["16", "32", "64", "128"],
      correctAnswer: 2,
      explanation: "Volume of a cube = s³. With s = 4: 4³ = 4 × 4 × 4 = 64.",
      difficulty: "medium",
      topic: "Geometry",
    },
  ],
  programming: [
    {
      id: 11,
      question: "What does 'DOM' stand for in web development?",
      options: [
        "Document Object Model",
        "Data Object Management",
        "Dynamic Object Method",
        "Document Oriented Model",
      ],
      correctAnswer: 0,
      explanation:
        "DOM stands for Document Object Model, which represents the structure of HTML documents as objects",
      difficulty: "easy",
      topic: "Web Development",
    },
    {
      id: 12,
      question: "Which of these is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Symbol"],
      correctAnswer: 2,
      explanation: "JavaScript doesn't have a 'Float' data type. Numbers in JavaScript are all of type 'Number'",
      difficulty: "medium",
      topic: "JavaScript",
    },
    {
      id: 13,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      explanation:
        "Binary search has O(log n) time complexity because it eliminates half of the search space in each iteration",
      difficulty: "medium",
      topic: "Algorithms",
    },
    {
      id: 14,
      question: "Which HTTP method is used to update existing data?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correctAnswer: 2,
      explanation: "PUT is typically used to update existing resources, while POST creates new resources",
      difficulty: "easy",
      topic: "Web Development",
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
      difficulty: "easy",
      topic: "Databases",
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
      difficulty: "medium",
      topic: "Object-Oriented Programming",
    },
    {
      id: 17,
      question: "What is the output of console.log(typeof null) in JavaScript?",
      options: ["null", "undefined", "object", "boolean"],
      correctAnswer: 2,
      explanation:
        "This is a known JavaScript quirk: typeof null returns 'object', though null is not actually an object",
      difficulty: "medium",
      topic: "JavaScript",
    },
    {
      id: 18,
      question: "Which data structure follows LIFO (Last In, First Out)?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      explanation: "Stack follows LIFO principle - the last element added is the first one to be removed",
      difficulty: "easy",
      topic: "Data Structures",
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
      difficulty: "easy",
      topic: "Web Development",
    },
    {
      id: 20,
      question: "Which of these is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
      correctAnswer: 2,
      explanation: "MongoDB is a NoSQL (document-based) database, while the others are relational (SQL) databases",
      difficulty: "easy",
      topic: "Databases",
    },
    {
      id: 36,
      question: "Which JavaScript keyword declares a block-scoped variable that can be reassigned?",
      options: ["var", "let", "const", "static"],
      correctAnswer: 1,
      explanation:
        "'let' is block-scoped and reassignable. 'const' is block-scoped but cannot be reassigned, and 'var' is function-scoped.",
      difficulty: "medium",
      topic: "JavaScript",
    },
    {
      id: 37,
      question: "What is the average-case time complexity of a lookup in a hash table?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correctAnswer: 2,
      explanation:
        "Hash tables provide O(1) average-case lookup because the hash function computes the storage index directly. Worst case degrades to O(n) with many collisions.",
      difficulty: "medium",
      topic: "Data Structures",
    },
    {
      id: 38,
      question: "What does 'CSS' stand for?",
      options: [
        "Cascading Style Sheets",
        "Creative Style System",
        "Computed Style Sheets",
        "Cascading System Styles",
      ],
      correctAnswer: 0,
      explanation: "CSS stands for Cascading Style Sheets, the language used to style and lay out web documents.",
      difficulty: "easy",
      topic: "Web Development",
    },
    {
      id: 39,
      question:
        "Which algorithm finds the shortest path between nodes in a weighted graph with non-negative edge weights?",
      options: [
        "Dijkstra's algorithm",
        "Depth-first search",
        "Binary search",
        "Kruskal's algorithm",
      ],
      correctAnswer: 0,
      explanation:
        "Dijkstra's algorithm computes shortest paths in graphs with non-negative weights. DFS does not guarantee shortest paths, and Kruskal's builds a minimum spanning tree instead.",
      difficulty: "hard",
      topic: "Algorithms",
    },
    {
      id: 40,
      question: "In SQL, which clause filters rows after aggregation has been applied?",
      options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"],
      correctAnswer: 2,
      explanation:
        "HAVING filters groups after GROUP BY aggregation, whereas WHERE filters individual rows before aggregation.",
      difficulty: "medium",
      topic: "Databases",
    },
  ],
  generalKnowledge: [
    {
      id: 21,
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctAnswer: 2,
      explanation: "Canberra is the capital of Australia, though Sydney and Melbourne are larger cities",
      difficulty: "medium",
      topic: "Geography",
    },
    {
      id: 22,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      correctAnswer: 1,
      explanation:
        "Leonardo da Vinci painted the Mona Lisa between 1503-1519, and it's housed in the Louvre Museum",
      difficulty: "easy",
      topic: "Arts and Culture",
    },
    {
      id: 23,
      question: "What is the largest planet in our solar system?",
      options: ["Saturn", "Jupiter", "Neptune", "Earth"],
      correctAnswer: 1,
      explanation:
        "Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined",
      difficulty: "easy",
      topic: "Science",
    },
    {
      id: 24,
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1,
      explanation: "World War II ended in 1945 with Japan's surrender on September 2, 1945",
      difficulty: "medium",
      topic: "History",
    },
    {
      id: 25,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2,
      explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'",
      difficulty: "easy",
      topic: "Science",
    },
    {
      id: 26,
      question: "Which ocean is the largest?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3,
      explanation: "The Pacific Ocean is the largest ocean, covering about 46% of the world's water surface",
      difficulty: "easy",
      topic: "Geography",
    },
    {
      id: 27,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: 1,
      explanation: "William Shakespeare wrote 'Romeo and Juliet' around 1594-1596",
      difficulty: "easy",
      topic: "Arts and Culture",
    },
    {
      id: 28,
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      correctAnswer: 2,
      explanation: "Diamond is the hardest natural substance on Earth, rating 10 on the Mohs hardness scale",
      difficulty: "easy",
      topic: "Science",
    },
    {
      id: 29,
      question: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      explanation:
        "There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia",
      difficulty: "easy",
      topic: "Geography",
    },
    {
      id: 30,
      question: "What is the smallest country in the world?",
      options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
      correctAnswer: 1,
      explanation: "Vatican City is the smallest country in the world, with an area of just 0.17 square miles",
      difficulty: "medium",
      topic: "Geography",
    },
    {
      id: 41,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Mercury"],
      correctAnswer: 1,
      explanation:
        "Mars is called the Red Planet because iron oxide (rust) on its surface gives it a reddish appearance.",
      difficulty: "easy",
      topic: "Science",
    },
    {
      id: 42,
      question: "Mount Everest is part of which mountain range?",
      options: ["Andes", "Himalayas", "Alps", "Rockies"],
      correctAnswer: 1,
      explanation:
        "Mount Everest, the world's highest peak above sea level, lies in the Himalayas on the border of Nepal and Tibet.",
      difficulty: "medium",
      topic: "Geography",
    },
    {
      id: 43,
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
      correctAnswer: 2,
      explanation: "George Washington served as the first U.S. President from 1789 to 1797.",
      difficulty: "medium",
      topic: "History",
    },
    {
      id: 44,
      question: "How many strings does a standard violin have?",
      options: ["4", "5", "6", "3"],
      correctAnswer: 0,
      explanation: "A standard violin has four strings, tuned to G, D, A, and E.",
      difficulty: "easy",
      topic: "Arts and Culture",
    },
    {
      id: 45,
      question: "What is the most abundant gas in Earth's atmosphere?",
      options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
      correctAnswer: 2,
      explanation:
        "Nitrogen makes up about 78% of Earth's atmosphere, ahead of oxygen at roughly 21%.",
      difficulty: "hard",
      topic: "Science",
    },
  ],
}

export interface SectionMeta {
  id: SectionId
  title: string
  description: string
  /** Default interaction mode. Both modes are available for every section. */
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
    modeLabel: "Batch submission · question navigator",
  },
  generalKnowledge: {
    id: "generalKnowledge",
    title: "General Knowledge",
    description: "Geography, history, science, and culture.",
    mode: "batch",
    modeLabel: "Batch submission · question navigator",
  },
}

export const SECTION_ORDER: SectionId[] = ["mathematics", "programming", "generalKnowledge"]

/** Default quick-start count per section; preserves the original 10-question experience. */
export const QUESTIONS_PER_SECTION = 10

export const DEFAULT_COUNT: QuestionCountChoice = 10

/** Total questions across all sections (45). */
export const TOTAL_QUESTIONS = SECTION_ORDER.reduce((sum, s) => sum + QUESTIONS[s].length, 0)

export function sectionQuestionCount(section: SectionId): number {
  return QUESTIONS[section].length
}
