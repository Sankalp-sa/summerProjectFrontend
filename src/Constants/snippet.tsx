export const CODE_SNIPPETS = {
    "javascript": `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    "typescript": `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
    "python": `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    "java": `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    "csharp":
      'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
    "php": "<?php\n\n$name = 'Alex';\necho $name;\n",
    "cpp": `\n// C++ program to display "Hello World"\n\n// Header file for input output functions\n#include <iostream>\nusing namespace std;\n\n// Main() function: where the execution of\n// program begins\nint main()\n{\n\t// Prints hello world\n\tcout << "Hello World";\n\n\treturn 0;\n}\n`
};
