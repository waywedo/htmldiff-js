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

test("Handles new iframe", () => {
    const result = HtmlDiff.execute("<h2>title</h2><p>content</p>", "<h2>title</h2><p><iframe width=\"500\" height=\"281\" src=\"//www.loom.com/embed/b4481e32129e43f8a3868604e8dae1e9\" frameborder=\"0\" allowfullscreen=\"\"></iframe></p><p>content</p>");
    expect(result).toBe("<h2>title</h2><p><ins class=\"diffins\"><iframe width=\"500\" height=\"281\" src=\"//www.loom.com/embed/b4481e32129e43f8a3868604e8dae1e9\" frameborder=\"0\" allowfullscreen=\"\"></iframe></ins></p><p>content</p>");
});

test("Handles deleted iframe", () => {
    const result = HtmlDiff.execute("<h2>title</h2><p><iframe width=\"500\" height=\"281\" src=\"//www.loom.com/embed/b4481e32129e43f8a3868604e8dae1e9\" frameborder=\"0\" allowfullscreen=\"\"></iframe></p><p>content</p>", "<h2>title</h2><p>content</p>");
    expect(result).toBe("<h2>title</h2><p><del class=\"diffdel\"><iframe width=\"500\" height=\"281\" src=\"//www.loom.com/embed/b4481e32129e43f8a3868604e8dae1e9\" frameborder=\"0\" allowfullscreen=\"\"></iframe></del></p><p>content</p>");
});
