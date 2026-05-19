const SHORTCODE_TOKEN_PATTERN = /(\[\/?[A-Za-z0-9_-]+(?:\s[^\]]*)?\/?\])/g;

function isClosingShortcode(token) {
    return /^\[\/[A-Za-z0-9_-]+\]$/.test(token);
}

function isOpeningShortcode(token) {
    return /^\[[A-Za-z0-9_-]+(?:\s[^\]]*)?\/?\]$/.test(token) && !isClosingShortcode(token);
}

function isSelfClosingShortcode(token) {
    return /\/\]$/.test(token);
}

function formatWPBakeryShortcodes(text, indentSize = 2) {
    const tokens = text
        .replace(SHORTCODE_TOKEN_PATTERN, "\n$1\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    let indent = 0;
    const formatted = [];

    tokens.forEach((token) => {
        const isClosing = isClosingShortcode(token);
        const isOpening = isOpeningShortcode(token);
        const isSelfClosing = isSelfClosingShortcode(token);

        if (isClosing) {
            indent = Math.max(indent - 1, 0);
        }

        formatted.push(`${" ".repeat(indent * indentSize)}${token}`);

        if (isOpening && !isSelfClosing) {
            indent++;
        }
    });

    return formatted.join("\n");
}

function activate(context) {
    const vscode = require("vscode");
    const formatter = vscode.languages.registerDocumentFormattingEditProvider("wpbakery", {
        provideDocumentFormattingEdits(document) {
            const config = vscode.workspace.getConfiguration("wpbakeryFormatter");
            const indentSize = config.get("indentSize", 2);

            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));

            const formatted = formatWPBakeryShortcodes(document.getText(), indentSize);

            return [vscode.TextEdit.replace(fullRange, formatted)];
        },
    });

    context.subscriptions.push(formatter);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
    formatWPBakeryShortcodes,
};
