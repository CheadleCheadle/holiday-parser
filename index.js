const fs = require("fs");

class Parser {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {};
    this.holidayNames = {};
  }

  log() {
      console.log(this.data);
      console.log(this.holidayNames);
  }

  parseFile() {
    const fileContent = fs.readFileSync(this.filePath, "utf8");
    const lines = fileContent.split("\n");
    for (const line of lines) {
      if (line.trim() === "" || line.startsWith("//")) {
        continue;
      }


    if (line.startsWith("$")) {
      const [variable, dataRange] = line
        .substring(1)
        .split("=")
        .map((item) => item.trim());
      this.holidayNames[variable] = dataRange;
    } else if (line.startsWith("#V#")) {
      const [preDefinedVar, imagePath] = line
        .substring(3)
        .split("=")
        .map((item) => item.trim());
      this.data[preDefinedVar] = imagePath;
    } else if (line.startsWith("&")) {
      const [dataRange, imagePath] = line
        .substring(1)
        .split("=")
        .map((item) => item.trim());
      this.data[dataRange] = imagePath;
    } else if (line.startsWith("#O#")) {
        const [ordinalDate, imagePath] = line.substring(3).split("=").map((item) => {
            item.trim()
        });

        this.data[ordinalDate] = imagePath;


      
    }
  }
}

// Need a method that takes in a date and returns the name of the day that corresponds

getDayNameFromDate(date) {

    for (const key in this.holidayNames) {
        const holidayDate= this.holidayNames[key];
        if (holidayDate=== date) {
            console.log(key);
            console.log("Image filepath",this.data[key]);
            return key;
        }
    }
    return null;
}

  getImageFilename(date) {
    for (const key of Object.keys(this.data)) {
        console.log(key)
      if (key.includes("/") && this.isDateInRange(date, key)) {
        return this.data[key];
      }
    }
    // may need to return default image path;
    return null;
  }

  isDateInRange(date, dateRange) {
    const [start, end] = dateRange
      .split(":")
      .map((item) => new Date(item.trim()));
    return date >= start && date <= end;
  }


}
module.exports = Parser;
