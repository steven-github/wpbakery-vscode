const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const workspaceRoot = path.resolve(__dirname, "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(workspaceRoot, "package.json"), "utf8"));
const { formatWPBakeryShortcodes } = require(path.join(workspaceRoot, "extension", "extension.js"));

function readJson(relativePath) {
    return JSON.parse(fs.readFileSync(path.join(workspaceRoot, relativePath), "utf8"));
}

function validateFormatter() {
    const cases = [
        {
            name: "custom nested shortcodes",
            input: "[my_section][my_item]Hello[/my_item][/my_section]",
            expected: ["[my_section]", "  [my_item]", "    Hello", "  [/my_item]", "[/my_section]"].join("\n"),
        },
        {
            name: "wpbakery vc shortcodes",
            input: "[vc_row][vc_column width=\"1/2\"]Text[/vc_column][/vc_row]",
            expected: ["[vc_row]", "  [vc_column width=\"1/2\"]", "    Text", "  [/vc_column]", "[/vc_row]"].join("\n"),
        },
        {
            name: "self closing shortcode",
            input: "[wrapper][gallery ids=\"1,2\" /][/wrapper]",
            expected: ["[wrapper]", "  [gallery ids=\"1,2\" /]", "[/wrapper]"].join("\n"),
        },
    ];

    cases.forEach(({ name, input, expected }) => {
        assert.equal(formatWPBakeryShortcodes(input, 2), expected, `Formatter failed for ${name}`);
    });
}

function validateSnippets() {
    const snippetContributions = packageJson.contributes?.snippets ?? [];

    assert.ok(snippetContributions.length > 0, "No snippet contributions were declared in package.json");

    snippetContributions.forEach(({ path: snippetPath, language }) => {
        assert.equal(language, "wpbakery", `Unexpected snippet language contribution: ${language}`);
        assert.ok(fs.existsSync(path.join(workspaceRoot, snippetPath)), `Missing snippet file: ${snippetPath}`);

        const snippets = readJson(snippetPath);
        const prefixes = Object.values(snippets).map((snippet) => snippet.prefix).filter(Boolean);

        assert.ok(prefixes.length > 0, `No snippet prefixes found in ${snippetPath}`);
        assert.ok(prefixes.includes("vc_row"), `Expected vc_row prefix in ${snippetPath}`);
        assert.ok(prefixes.includes("vc_column_text"), `Expected vc_column_text prefix in ${snippetPath}`);
    });
}

validateFormatter();
validateSnippets();

console.log("Validation passed: formatter behavior and snippet contributions are ready for publish.");