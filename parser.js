const fs = require("fs");


/**
 * Parses a configuration file and stores holiday names and data mappings.
 */
class Parser {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {};
    this.holidayNames = {};
  }


  /**
   * Parses the configuration file and populates the data and holidayNames properties.
   */
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
          // Need to set the variable to equal the date extracted from the dataRange. I.E. "FirstFriday"/Febuaray => 02/05/2021

          const ordinal = dataRange.substring(4).slice(0, -1);
          const date = this.calculateOrdinalDate(ordinal);

          this.holidayNames[variable] = date;
        } else if (dataRange.startsWith("(#V")) {
          // Need to recalculate Palm Sunday and Good Friday!
          if (variable.includes("Palm")) {
            const date = this.calculatePalmDate(this.holidayNames["Easter"]);
            this.holidayNames[variable] = date;
          } else if (variable.includes("Good")) {
            const date = this.calculateGoodFridayDate(
              this.holidayNames["Easter"],
            );
            this.holidayNames[variable] = date;
          }
        } else if (dataRange.includes(":")) {
          const dateRange = this.parseDateRange(dataRange);
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
        this.data[ordinalDate] = imagePath;
      }
    }
  }

  /**
   * Parses a date range and returns an array of dates within that range.
   * @param {string} dateRange - The date range in the format "MM/DD/YYYY : MM/DD/YYYY".
   * @returns {string[]} An array of formatted dates within the range.
   */
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

  /**
   * Calculates Palm Sunday's date based on the provided Easter date.
   * @param {string} easterDate - The date of Easter in "MM/DD/YYYY" format.
   * @returns {string} The date of Palm Sunday in "MM/DD/YYYY" format.
   */
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

  /**
   * Calculates Good Friday's date based on the provided Easter date.
   * @param {string} easterDate - The date of Easter in "MM/DD/YYYY" format.
   * @returns {string} The date of Good Friday in "MM/DD/YYYY" format.
   */
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

  /**
   * Calculates an ordinal date based on the provided ordinal and month.
   * @param {string} ordinalDate - The ordinal date in the format "Ordinal/Month".
   * @returns {string} The calculated date in "MM/DD/YYYY" format.
   */
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

  /**
   * Extracts the occurrence number from the ordinal date string.
   * @param {string} ordinal - The ordinal date string.
   * @returns {number} The occurrence number (1 for First, 2 for Second, etc.).
   */
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

  /**
   * Returns the day of the week (0-6) based on the provided ordinal date string.
   * @param {string} ordinal - The ordinal date string (e.g., "FirstMonday").
   * @returns {number} The day of the week (0 for Sunday, 1 for Monday, etc.).
   * @throws {Error} Throws an error if the ordinal date is invalid.
   */
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

  /**
   * Returns the month number (0-11) based on the provided month name.
   * @param {string} monthName - The name of the month (e.g., "January").
   * @returns {number} The month number (0 for January, 1 for February, etc.).
   */
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

  /**
   * Returns the day of the week number (0-6) based on the provided day of the week name.
   * @param {string} dayOfWeek - The day of the week name (e.g., "Sunday").
   * @returns {number} The day of the week number (0 for Sunday, 1 for Monday, etc.).
   */
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

  /**
   * Retrieves the image file path based on the provided date.
   * @param {string} date - The date in "MM/DD/YYYY" format.
   * @returns {string} The image file path associated with the date.
   */
  getDayNameFromDate(date) {
    // If date is within a range we find the last occurence
    let rangeKey = this.isDateInRange(date);
    if (rangeKey) {
      return this.data[rangeKey];
    }
    const dateParts = date.split("/");
    const dateWithoutYear = `${dateParts[0]}/${dateParts[1]}`;
    for (const key in this.holidayNames) {
      const holidayDate = this.holidayNames[key];
      // For ranges of dates inside of a list
      if (holidayDate === date || holidayDate === dateWithoutYear) {
        return this.data[key];
      }
    }
    return "default/filepath";
  }

  /**
   * Checks if the provided date is within a date range and returns the associated image file path.
   * @param {string} date - The date in "MM/DD/YYYY" format.
   * @returns {string | null} The key that points to the image file path or null if the date is not within any date range.
   */
  isDateInRange(date) {
    const keys = Object.keys(this.holidayNames).reverse();
    for (const key of keys) {
      const holidayDate = this.holidayNames[key];
      if (Array.isArray(holidayDate) && holidayDate.includes(date)) {
        return key;
      }
    }
    return null;
  }
}

module.exports = Parser;
