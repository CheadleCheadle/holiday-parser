const fs = require("fs");

const test_holidays_path = "parthenonsoftware.com_test_holidays.txt";

fs.readFile(test_holidays_path, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const lines = data.split("\n");

  lines.forEach((line, index) => {
    console.log(`Line ${index + 1}: ${line}`);
  });
});
