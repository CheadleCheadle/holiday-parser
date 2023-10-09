const Parser = require("./index.js");

const path = "parthenonsoftware.com_test_holidays.txt";

const parser = new Parser(path);

parser.parseFile();

const currentDate = new Date('01/18');
const holidayName = parser.getDayNameFromDate('02/05/21');

// const imageFilename = parser.getImageFilename(holidayName)

parser.log();


/*
if (imageFilename) {
     console.log(`Image filename for ${currentDate.toDateString()}: ${imageFilename}`);
} else {
    console.log(`No matching image found for ${currentDate.toDateString()}`);
}

*/

