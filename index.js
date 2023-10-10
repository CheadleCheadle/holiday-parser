const readline = require("readline");

// This is the library object for parsing and working with holiday data.
const Parser = require("./parser.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const path = "parthenonsoftware.com_test_holidays.txt";
const parser = new Parser(path);
parser.parseFile();

console.log("Type 'exit' to exit");

/**
 * Entry point for processing date inputs.
 * This function prompts the user to enter a date, validates the input,
 * and logs the corresponding image filename if the input is a valid date.
 */
function main() {
  rl.question("Enter a date (e.g., MM/DD/YYYY): ", (dateInput) => {
    if (dateInput === "exit") {
      rl.close();
    } else {
      try {
        const date = new Date(dateInput);
        if (!isNaN(date.getTime())) {
          // Checking if the input is a valid date
          const imageFilename = parser.getDayNameFromDate(dateInput);
          console.log("Imagefile name: ", imageFilename);
        } else {
          console.log("Invalid date format.");
        }
      } catch (error) {
        console.log("Invalid date format.");
      }
      main();
    }
  });
}
main();
