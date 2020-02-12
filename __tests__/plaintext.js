/* eslint-env jest */
import HtmlDiff from "../src/Diff";

test("Handles new plain test", () => {
    const result = HtmlDiff.execute("", "new text");
    expect(result).toBe("<ins class=\"diffins\">new text</ins>");
});

test("Handles undefined old text", () => {
    const result = HtmlDiff.execute(undefined, "new text");
    expect(result).toBe("new text");
});

test("Handles null old text", () => {
    const result = HtmlDiff.execute(null, "new text");
    expect(result).toBe("new text");
});

test("Handles undefined new text", () => {
    const result = HtmlDiff.execute("old text", undefined);
    expect(result).toBe("old text");
});

test("Handles null new text", () => {
    const result = HtmlDiff.execute("old text", null);
    expect(result).toBe("old text");
});

test("Breaking test", () => {
    const result = HtmlDiff.execute(
        "Some plain text",
        "Some <strong><i>plain</i></strong> text"
    );
    expect(result).toBe("Some <strong><i><ins class=\"mod\">plain</ins></i></strong> text");
});