const gameLevels = [
    {
        id: 1,
        title: "Hello Python",
        concepts: "print, variables",
        scene: "scene_level_1",
        dialogue: "Welcome to Python! Let's start with a simple greeting.",
        instructions: "Write a Python program that prints 'Hello, World!' to the console.",
        startingCode: "# Write your code here\n",
        hints: [
            "Use the print() function to display text",
            "Put your text in quotes: print('Hello, World!')",
            "Make sure the text matches exactly: 'Hello, World!'"
        ],
        solution: "print('Hello, World!')",
        expectedOutput: "Hello, World!",
        successCondition: (output) => {
            const cleanOutput = output.trim().replace(/\r\n/g, '\n');
            return cleanOutput === "Hello, World!";
        }
    },
    {
        id: 2,
        title: "Variables & Math",
        concepts: "variables, arithmetic",
        scene: "scene_level_2",
        dialogue: "Great job! Now let's learn about variables and math.",
        instructions: "Create two variables 'a' and 'b' with values 5 and 3, then print their sum.",
        startingCode: "# Create variables and calculate\n",
        hints: [
            "Create variables: a = 5 and b = 3",
            "Add them together: a + b",
            "Print the result: print(a + b)"
        ],
        solution: "a = 5\nb = 3\nprint(a + b)",
        expectedOutput: "8",
        successCondition: (output) => {
            const cleanOutput = output.trim().replace(/\r\n/g, '\n');
            return cleanOutput === "8";
        }
    },
    {
        id: 3,
        title: "User Input",
        concepts: "input, strings",
        scene: "scene_level_3",
        dialogue: "Now let's make our programs interactive!",
        instructions: "Ask the user for their name and greet them personally. The greeting should start with 'Hello,'",
        startingCode: "# Get user input and greet them\n",
        hints: [
            "Use input() to get user input",
            "Store the result in a variable: name = input('What is your name? ')",
            "Use f-strings or concatenation to create the greeting: print(f'Hello, {name}!')"
        ],
        solution: "name = input('What is your name? ')\nprint(f'Hello, {name}!')",
        expectedOutput: null, // Variable output based on input
        successCondition: (output) => {
            const cleanOutput = output.trim().replace(/\r\n/g, '\n');
            return cleanOutput.includes("Hello,") && cleanOutput.length > 6;
        }
    },
    {
        id: 4,
        title: "Conditions",
        concepts: "if statements, comparison",
        scene: "scene_level_4",
        dialogue: "Time to make decisions in your code!",
        instructions: "Write a program that checks if a number is positive, negative, or zero. Use the variable 'number = 5' and print 'positive', 'negative', or 'zero'.",
        startingCode: "number = 5\n# Write your if-elif-else logic here\n",
        hints: [
            "Use if, elif, and else statements",
            "Compare with 0: if number > 0:",
            "Don't forget the colons and indentation"
        ],
        solution: "number = 5\nif number > 0:\n    print('positive')\nelif number < 0:\n    print('negative')\nelse:\n    print('zero')",
        expectedOutput: "positive",
        successCondition: (output) => {
            const cleanOutput = output.trim().replace(/\r\n/g, '\n');
            return cleanOutput === "positive";
        }
    },
    {
        id: 5,
        title: "Loops",
        concepts: "for loops, range",
        scene: "scene_level_5",
        dialogue: "Let's learn about repetition with loops!",
        instructions: "Use a for loop to print numbers from 1 to 5, each on a new line.",
        startingCode: "# Write a for loop here\n",
        hints: [
            "Use range(1, 6) to get numbers 1 to 5",
            "for i in range(1, 6):",
            "Print each number: print(i)"
        ],
        solution: "for i in range(1, 6):\n    print(i)",
        expectedOutput: "1\n2\n3\n4\n5",
        successCondition: (output) => {
            const cleanOutput = output.trim().replace(/\r\n/g, '\n');
            return cleanOutput === "1\n2\n3\n4\n5";
        }
    }
];