# WPBakery VSCode Support

Syntax highlighting, snippets, and shortcode support for WPBakery Page Builder inside Visual Studio Code.

## Features

- WPBakery shortcode syntax highlighting
- Shortcode formatting for nested `vc_*` and custom WordPress shortcodes
- Support for `[vc_row]`, `[vc_column]`, `[vc_column_text]`, all `vc_*` shortcodes, and custom shortcode blocks such as `[my_section]...[/my_section]`
- Attribute highlighting
- String highlighting
- Auto bracket closing
- WPBakery snippets

Included snippet prefixes:

- `vc_row`
- `vc_column`
- `vc_column_text`
- `vc_btn`
- `vc_single_image`

## Validation

- Run `npm run validate` to verify formatter behavior and snippet contributions before packaging or publishing.

---

## Supported Extensions

- `.wpbakery`
- `.vc`

---

## Example

```txt
[vc_row css=".vc_custom_1778564218806{background-color:#222222!important;}"]

  [vc_column width="1/3"]

    [vc_column_text]

      Contact & Business Hours

    [/vc_column_text]

  [/vc_column]

[/vc_row]
```
