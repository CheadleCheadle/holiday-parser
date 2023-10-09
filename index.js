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
          if (dataRange.startsWith("(")) {
                // Need to set the variable to equal the date extracted from the dataRange. I.E. "FirstFriday"/febuaray => 02/05/2021
              this.holidayNames[variable] = dataRange;
          } else {
              this.holidayNames[variable] = dataRange;
          }
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
        const [ordinalDate, imagePath] = line
          .substring(3)
          .split("=")
          .map((item) => {
            item.trim();
          });
        console.log("This is ordinal date", ordinalDate);
        this.data[ordinalDate] = imagePath;
      }
    }
  }

  matchesOrdinalDate(date, ordinalDate) {
    const [ordinal, month] = ordinalDate.split("/");
    const day = ordinal.toLowerCase().replace(/[^a-z]/g, "");
    const monthName =
      month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    const targetDate = new Date(
      date.getFullYear(),
      this.getMonthNumber(monthName),
      1,
    );
    while (targetDate.getDay() !== this.getDayNumber(day)) {
      targetDate.setdate(targetDate.getDate() + 1);
    }

    return date.getMonth() === targetDate.getMonth();
  }

  getMonthNumber(monthName) {
    const months = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };
    return months[monthName];
  }

  getDayNumber(dayOfWeek) {
    const days = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    return days[dayOfWeek.toLowerCase()];
  }

  // Need a method that takes in a date and returns the name of the day that corresponds

  getDayNameFromDate(date) {
    for (const key in this.holidayNames) {
      const holidayDate = this.holidayNames[key];
      if (holidayDate === date) {
        console.log(key);
        console.log("Image filepath", this.data[key]);
        return key;
      }
    }
    console.log("No holiday on this day", date);
    return null;
  }

  getImageFilename(date) {
    for (const key of Object.keys(this.data)) {
      console.log(key);
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
