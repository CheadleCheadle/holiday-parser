const fs = require("fs");

class Parser {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {};
  }

  log() {
      console.log(this.data);
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
      this.data[variable] = dataRange;
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
      const [variable, dataRange] = line
        .substring(1)
        .split("=")
        .map((item) => item.trim());

      if (dataRange.startsWith("(")) {
        const ordinalDate = dataRange.substring(4).split("").pop().join("");
        this.data[variable] = ordinalDate;
      } else {
        this.data[variable] = dataRange;
      }
    }
  }
}

  getImageFilename(date) {
    for (const key of Object.keys(this.data)) {
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
