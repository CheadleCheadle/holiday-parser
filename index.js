const Parser = require("./parser.js");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const path = "parthenonsoftware.com_test_holidays.txt";

const parser = new Parser(path);

parser.parseFile();

parser.log();

function main() {
    console.log("Type 'exit' to exit");
  rl.question("Enter a date (e.g., MM/DD/2021): ", (dateInput) => {
    if (dateInput=== "exit") {
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
