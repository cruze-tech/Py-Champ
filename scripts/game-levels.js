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
      "In Python, we use the print() function to display text on the screen.",
      "When printing text, you need to put it in quotes: print(\"text here\")",
      "Make sure to use the exact text with proper capitalization: Hello, Python World!",
      "The complete code should look like: print(\"Hello, Python World!\")",
      "Check for typos! Even small mistakes like missing quotes or spaces will cause errors."
    ],
    scene: "scene_level_1"
  },
  {
    id: 2,
    title: "Math Magic! 🧮",
    concepts: "arithmetic, expressions",
    dialogue: "Great job! Now let's do some math. Python is like a super calculator!",
    instructions: "Calculate and print the result of: 15 + 25 * 2",
    startingCode: "# Python follows math rules (PEMDAS)\n# Calculate: 15 + 25 * 2\n\n",
    expectedOutput: "65",
    hints: [
      "In Python, you can perform calculations directly inside print()",
      "Remember order of operations (PEMDAS): multiplication happens before addition",
      "First calculate 25 * 2 = 50, then add 15 to get 65",
      "Try writing: print(15 + 25 * 2)",
      "No quotes needed for numbers - just use print(15 + 25 * 2)"
    ],
    scene: "scene_math"
  },
  {
    id: 3,
    title: "Variable Adventure! 📦",
    concepts: "variables, assignment",
    dialogue: "Time to learn about variables - they're like labeled boxes that store information!",
    instructions: "Create a variable called 'age' with value 16, then print it.",
    startingCode: "# Variables store information\n# Create a variable and print it\n\n",
    expectedOutput: "16",
    hints: [
      "To create a variable, use: variable_name = value",
      "For this challenge, create a variable named 'age' and set it to 16",
      "After creating your variable, use print(age) to display it",
      "Remember, don't put quotes around the variable name when printing",
      "Your complete solution should be: age = 16 followed by print(age)"
    ],
    scene: "scene_variables"
  },
  {
    id: 4,
    title: "String Wizard! ✨",
    concepts: "strings, concatenation",
    dialogue: "Let's play with text! Strings are sequences of characters, and we can combine them!",
    instructions: "Create two variables: name = 'Alex' and greeting = 'Hello'. Print them together with a space between.",
    startingCode: "# String concatenation means joining text together\n# Try combining strings with +\n\n",
    expectedOutput: "Hello Alex",
    hints: [
      "First, create your two variables: greeting = \"Hello\" and name = \"Alex\"",
      "To join strings together, use the + operator between them",
      "Don't forget to add a space! You can use: greeting + \" \" + name",
      "To print the combined result, use: print(greeting + \" \" + name)",
      "Check your spacing and make sure there's exactly one space between the words"
    ],
    scene: "scene_strings"
  },
  {
    id: 5,
    title: "Input Master! 🎯",
    concepts: "input(), user interaction",
    dialogue: "Now let's make your program interactive! We'll ask the user for their name.",
    instructions: "Ask for the user's name using input() and print 'Welcome, [name]!'",
    startingCode: "# input() gets text from the user\n# Store it in a variable and use it\n\n",
    expectedOutput: "Welcome, Python!",
    hints: [
      "Use input() to get text from the user: name = input(\"What is your name? \")",
      "After getting the name, use print() to display the welcome message",
      "To create the message, combine \"Welcome, \" with the name variable using +",
      "Make sure to add an exclamation mark at the end: \"Welcome, \" + name + \"!\"",
      "Complete code: name = input(\"What is your name? \") followed by print(\"Welcome, \" + name + \"!\")"
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
    startingCode: "# if statements let your program make decisions\n# Format: if condition:\n#     do something\n\n",
    expectedOutput: "Great job!",
    hints: [
      "First, create your variable: score = 85",
      "Use an if statement to check if score > 80",
      "The format is: if condition:",
      "After the colon, indent the next line (use 4 spaces) and add your print statement",
      "Complete solution: score = 85, then if score > 80:, then indented print(\"Great job!\")"
    ],
    scene: "scene_decisions"
  }
];

window.gameLevels = gameLevels;