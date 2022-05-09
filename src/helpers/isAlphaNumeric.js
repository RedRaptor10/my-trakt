const isAlphaNumeric = code => {
    if ((code > 47 && code < 58) || // (0-9)
        (code > 64 && code < 91) || // (A-Z)
        (code > 96 && code < 123)|| // (a-z)
        (code === 8)) // Backspace
    {
        return true;
    }
    return false;
};

export { isAlphaNumeric };