def sanitize(input_str):
    return input_str.replace("<", "&lt;").replace(">", "&gt;")