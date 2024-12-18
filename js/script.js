const uniqueDice = [...new Set(dice)].sort((a, b) => a - b);
const smallStraights = ["1234", "2345", "3456"];
const largeStraights = ["12345", "23456"];

const diceStr = uniqueDice.join("");
if (smallStraights.some(straight => diceStr.includes(straight))) scores["Small Straight"] = 30;
if (largeStraights.some(straight => diceStr.includes(straight))) scores["Large Straight"] = 40;
