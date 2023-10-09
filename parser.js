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
        if (dataRange.startsWith("(#O")) {
          // Need to set the variable to equal the date extracted from the dataRange. I.E. "FirstFriday"/febuaray => 02/05/2021

          const ordinal = dataRange.substring(4).slice(0, -1);
          const date = this.calculateOrdinalDate(ordinal);

          this.holidayNames[variable] = date;
        } else if (dataRange.startsWith("(#V")) {
          // Need to recalculate Palm Sunday and Good Friday!
          console.log(variable);
          if (variable.includes("Palm")) {
            const date = this.calculatePalmDate(this.holidayNames["Easter"]);
            console.log("date", date);
            this.holidayNames[variable] = date;
          } else if (variable.includes("Good")) {
            const date = this.calculateGoodFridayDate(
              this.holidayNames["Easter"],
            );
            console.log("date", date);
            this.holidayNames[variable] = date;
          }
        } else if (dataRange.includes(":")) {
            const dateRange= this.parseDateRange(dataRange);
            this.holidayNames[variable] = dateRange;
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
  // Method used when given a range of dates: i.e. 12/25/2021 : 12/26/2021
  parseDateRange(dateRange) {
    const [startDateStr, endDateStr] = dateRange
      .split(" : ")
      .map((str) => str.trim());
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const datesWithinRange = [];

    while (startDate <= endDate) {
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const day = String(startDate.getDate()).padStart(2, "0");
      const year = startDate.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      datesWithinRange.push(formattedDate);
      // Move to next day within range!
      startDate.setDate(startDate.getDate() + 1);
    }
    return datesWithinRange;
  }
  calculatePalmDate(easterDate) {
    const easter = new Date(easterDate);

    const palmSunday = new Date(easter);
    palmSunday.setDate(easter.getDate() - 7);

    const formattedPalmSunday = `${String(palmSunday.getMonth() + 1).padStart(
      2,
      "0",
    )}/${String(palmSunday.getDate()).padStart(
      2,
      "0",
    )}/${palmSunday.getFullYear()}`;
    return formattedPalmSunday;
  }

  calculateGoodFridayDate(easterDate) {
    const easter = new Date(easterDate);

    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);

    const formattedGoodFriday = `${String(goodFriday.getMonth() + 1).padStart(
      2,
      "0",
    )}/${String(goodFriday.getDate()).padStart(
      2,
      "0",
    )}/${goodFriday.getFullYear()}`;
    return formattedGoodFriday;
  }

  calculateOrdinalDate(ordinalDate) {
    const [ordinal, month] = ordinalDate.split("/").map((item) => item.trim());

    const monthNumber = this.getMonthNumber(month);

    const targetDate = new Date(2021, monthNumber, 1);

    const dayOfWeek = this.getOrdinalDayOfWeek(ordinal);

    let occurence = this.extractOccurrenceWord(ordinal);

    while (occurence > 0) {
      if (targetDate.getDay() === dayOfWeek) {
        occurence--;
      }
      if (occurence > 0) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
    }

    const formattedDate = `${String(targetDate.getMonth() + 1).padStart(
      2,
      "0",
    )}/${String(targetDate.getDate()).padStart(
      2,
      "0",
    )}/${targetDate.getFullYear()}`;

    return formattedDate;
  }

  extractOccurrenceWord(ordinal) {
    if (ordinal.includes("First")) {
      return 1;
    } else if (ordinal.includes("Second")) {
      return 2;
    } else if (ordinal.includes("Third")) {
      return 3;
    } else if (ordinal.includes("Fourth")) {
      return 4;
    } else if (ordinal.includes("Last")) {
      return 5;
    }
  }

  getOrdinalDayOfWeek(ordinal) {
    const validDays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const daysToNums = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const normalizedOrdinal = ordinal.toLowerCase().replace(/[^a-z]/g, "");

    const dayOfWeek = validDays.find((day) => normalizedOrdinal.includes(day));

    if (dayOfWeek) {
      return daysToNums[dayOfWeek]; // Return the found day of the week
    } else {
      throw new Error(`Invalid ordinal date: ${ordinal}`);
    }
  }
  // Need a method that takes in a date and returns the name of the day that corresponds

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

  getDayNameFromDate(date) {
    //Need to handle ranges! will probably be an object or an array
    for (const key in this.holidayNames) {
      const holidayDate = this.holidayNames[key];
      if (holidayDate === date) {
        return this.data[key];
      }
    }
    return "default/filepath";
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
