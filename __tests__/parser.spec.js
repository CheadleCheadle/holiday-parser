const Parser = require("../parser");

const path = "parthenonsoftware.com_test_holidays.txt";

const parser = new Parser(path);

parser.parseFile();

describe("Parser", () => {
  test("should return christmas filepath", () => {
    const christmasResult = parser.getDayNameFromDate("12/25");

    expect(christmasResult).toContain(
      "/Holidays/Christmas/Candle+SparklesAni.gif",
    );
  });
  test("should return dayLightSavingsOff filepath", () => {
    const dayLightSavingsResult = parser.getDayNameFromDate("11/07/2021");

    expect(dayLightSavingsResult).toContain(
      "/Holidays/11-3_DaylightSavingsAni.gif",
    );
  });
  test("should return dayLightSavingsOn filepath", () => {
    const dayLightSavingsResult = parser.getDayNameFromDate("03/14/2021");

    expect(dayLightSavingsResult).toContain(
      "/Holidays/3-10_logoDaylightSavings.png",
    );
  });
  test("should return presidents day filepath", () => {
    const presidentsDayResult = parser.getDayNameFromDate("02/15/2021");

    expect(presidentsDayResult).toContain(
      "/Holidays/Patriotic/2-17PresidentAni.gif",
    );
  });
  test("should return thanksgiving filepath", () => {
    const thanksGivingResult = parser.getDayNameFromDate("11/25/2021");

    expect(thanksGivingResult).toContain("/Holidays/11-28Thanksgiving.png");
  });
});
