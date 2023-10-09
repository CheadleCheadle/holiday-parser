const Parser = require("../parser");

const path = "parthenonsoftware.com_test_holidays.txt";

const parser = new Parser(path);

parser.parseFile();

describe("Parser", () => {
  test("should return christmas without year e.g. '12/25' filepath", () => {
    const christmasResult = parser.getDayNameFromDate("12/25");

    expect(christmasResult).toContain(
      "/Holidays/Christmas/Candle+SparklesAni.gif",
    );
  });
  test("should return christmas with year e.g. '12/25/2021' filepath", () => {
    const christmasResult = parser.getDayNameFromDate("12/25/2021");

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
  test("should return WNYMapleFestival1 filepath for dates 03/20/2021 : 03/26/2021", () => {
    const WNYM1StartResult = parser.getDayNameFromDate("03/20/2021");
    const WNYM1EndResult = parser.getDayNameFromDate("03/26/2021");

    expect(WNYM1StartResult).toContain("/Holidays/Minor/wny1.png");
    expect(WNYM1EndResult).toContain("/Holidays/Minor/wny1.png");
  });

  test("should return WNYMapleFestival2 filepath for dates 03/27/2021 : 03/28/2021", () => {
    const WNYM2StartResult = parser.getDayNameFromDate("03/27/2021");
    const WNYM2EndResult = parser.getDayNameFromDate("03/28/2021");

    expect(WNYM2StartResult).toContain("/Holidays/Minor/wny2.png");
    expect(WNYM2EndResult).toContain("/Holidays/Minor/wny2.png");
  });
});
