// Set up a listener to raise jsdomErrors as actual exceptions so they will cause tests to fail in VSCode.
window._virtualConsole.removeAllListeners("jsdomError");
window._virtualConsole.addListener("jsdomError", (error) => {
    const newError = new Error(error.message);

    // Remove the first stack entry so the error points to the real source instead of pointing to this function.
    const stack = newError.stack.split("\n");
    stack.splice(1, 1);
    newError.stack = stack.join("\n");

    throw newError;
});