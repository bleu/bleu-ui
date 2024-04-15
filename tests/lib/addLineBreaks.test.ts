import { describe, expect, test } from "vitest";
import { addLineBreaks } from "../../src/lib/addLineBreaks";

describe("addLineBreaks", () => {
  test("should insert <br> tags correctly as HTML elements", () => {
    const htmlInput = `<p>One two three four five six seven eight nine ten eleven twelve</p>`;
    const expectedOutput = `<p>One two three four five <br> six seven eight nine ten <br> eleven twelve </p>`;
    expect(addLineBreaks(htmlInput, 5)).toBe(expectedOutput);
  });
});
