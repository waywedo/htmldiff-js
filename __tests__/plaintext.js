/* eslint-env jest */
import HtmlDiff from "../src/Diff";


test("Handles new plain test", () => {

    const result = HtmlDiff.execute("", "new text");

    expect(result).toBe("<ins class=\"diffins\">new text</ins>");
});