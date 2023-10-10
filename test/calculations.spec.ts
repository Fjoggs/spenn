import { expect, test } from "bun:test";
import { calculateDayIncome } from "../src/calculations";

test("calculateDayIncom correctly calculates income", () => {
  document.body.innerHTML = '<input id="test-input">test input</input>';
  const testInput = document.getElementById("test-input") as HTMLInputElement;
  const expected = 300;
  const actual = calculateDayIncome(testInput, 0);
  expect(actual).toBe(expected);
});
