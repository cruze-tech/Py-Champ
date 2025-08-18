const gameLevels = [
  {
    id: 1,
    title: "Welcome to Python! 🎉",
    concepts: "print(), strings",
    dialogue: "Hey there, future programmer! Let's start your Python journey by greeting the world!",
    instructions: "Use the print() function to display: Hello, Python World!",
    startingCode: "# Write your first line of Python code!\n# Use print() to display a message\n# Text must be inside quotes like: print(\"Hello\")\n\n",
    expectedOutput: "Hello, Python World!",
    hints: [
      "In Python, we use print() to show text on the screen",
      "Text must be surrounded by quotes: print(\"text\")",
      "The exact code should be: print(\"Hello, Python World!\")"
    ],
    scene: "scene_level_1"
  },
  {
    id: 2,
    title: "Math Magic! 🧮",
    concepts: "arithmetic, expressions",
    dialogue: "Great job! Now let's do some math. Python is like a super calculator!",
    instructions: "Calculate and print the result of: 15 + 25 * 2",
    startingCode: "# Python follows math rules (PEMDAS)\n# Calculate: 15 + 25 * 2\n",
    expectedOutput: "65",
    hints: [
      "Remember: multiplication happens before addition",
      "25 * 2 = 50, then 15 + 50 = 65",
      "Use print() to display your calculation"
    ],
    scene: "scene_math"
  },
  {
    id: 3,
    title: "Variable Adventure! 📦",
    concepts: "variables, assignment",
    dialogue: "Time to learn about variables - they're like labeled boxes that store information!",
    instructions: "Create a variable called 'age' with value 16, then print it.",
    startingCode: "# Variables store information\n# Create a variable and print it\n",
    expectedOutput: "16",
    hints: [
      "Use: variable_name = value",
      "Create: age = 16",
      "Then use print(age) to display it"
    ],
    scene: "scene_variables"
  },
  {
    id: 4,
    title: "String Wizard! ✨",
    concepts: "strings, concatenation",
    dialogue: "Let's play with text! Strings are sequences of characters, and we can combine them!",
    instructions: "Create two variables: name = 'Alex' and greeting = 'Hello'. Print them together with a space between.",
    startingCode: "# String concatenation means joining text together\n# Try combining strings with +\n",
    expectedOutput: "Hello Alex",
    hints: [
      "Create both variables first",
      "Use + to join strings: greeting + ' ' + name",
      "Don't forget the space: ' '"
    ],
    scene: "scene_strings"
  },
  {
    id: 5,
    title: "Input Master! 🎯",
    concepts: "input(), user interaction",
    dialogue: "Now let's make your program interactive! We'll ask the user for their name.",
    instructions: "Ask for the user's name using input() and print 'Welcome, [name]!'",
    startingCode: "# input() gets text from the user\n# Store it in a variable and use it\n",
    expectedOutput: "Welcome, Python!",
    hints: [
      "Use: name = input('What is your name? ')",
      "Then print: 'Welcome, ' + name + '!'",
      "For testing, just type 'Python' when asked"
    ],
    scene: "scene_input",
    hasUserInput: true,
    testInput: "Python"
  },
  {
    id: 6,
    title: "Decision Maker! 🤔",
    concepts: "if statements, conditions",
    dialogue: "Time to make decisions! Let's teach Python to think with if statements.",
    instructions: "Create a variable 'score' with value 85. If score is greater than 80, print 'Great job!'",
    startingCode: "# if statements let your program make decisions\n# Format: if condition:\n#     do something\n",
    expectedOutput: "Great job!",
    hints: [
      "Create: score = 85",
      "Use: if score > 80:",
      "Don't forget the colon and indentation!"
    ],
    scene: "scene_decisions"
  }
];

window.gameLevels = gameLevels;