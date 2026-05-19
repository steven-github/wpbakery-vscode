const SHORTCODE_TOKEN_PATTERN = /(\[\/?[A-Za-z0-9_-]+(?:\s[^\]]*)?\/?\])/g;

function getShortcodeName(token) {
    const match = token.match(/^\[\/?([A-Za-z0-9_-]+)/);
    return match ? match[1] : null;
}

function isClosingShortcode(token) {
    return /^\[\/[A-Za-z0-9_-]+\]$/.test(token);
}

function isOpeningShortcode(token) {
    return /^\[[A-Za-z0-9_-]+(?:\s[^\]]*)?\/?\]$/.test(token) && !isClosingShortcode(token);
}

function isSelfClosingShortcode(token) {
    return /\/\]$/.test(token);
}

function getContainerOpenings(tokens) {
    const closingCounts = new Map();
    const containerOpenings = new Set();

    for (let index = tokens.length - 1; index >= 0; index -= 1) {
        const token = tokens[index];
        const shortcodeName = getShortcodeName(token);

        if (!shortcodeName) {
            continue;
        }

        if (isClosingShortcode(token)) {
            closingCounts.set(shortcodeName, (closingCounts.get(shortcodeName) ?? 0) + 1);
            continue;
        }

        if (isOpeningShortcode(token) && !isSelfClosingShortcode(token)) {
            const availableClosings = closingCounts.get(shortcodeName) ?? 0;

            if (availableClosings > 0) {
                containerOpenings.add(index);
                closingCounts.set(shortcodeName, availableClosings - 1);
            }
        }
    }

    return containerOpenings;
}

function formatWPBakeryShortcodes(text, indentSize = 2) {
    const tokens = text
        .replace(SHORTCODE_TOKEN_PATTERN, "\n$1\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const containerOpenings = getContainerOpenings(tokens);

    let indent = 0;
    const formatted = [];

    tokens.forEach((token, index) => {
        const isClosing = isClosingShortcode(token);
        const isSelfClosing = isSelfClosingShortcode(token);
        const isContainerOpening = containerOpenings.has(index);

        if (isClosing) {
            indent = Math.max(indent - 1, 0);
        }

        formatted.push(`${" ".repeat(indent * indentSize)}${token}`);

        if (!isSelfClosing && isContainerOpening) {
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
