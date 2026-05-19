# Changelog

## 0.0.5

- Fix shortcode indentation so WPBakery leaf shortcodes like `vc_single_image` do not shift closing tags out of alignment.

## 0.0.4

- Add the missing WPBakery snippets contribution file so the declared snippet support is functional.
- Reduce the extension icon asset footprint for leaner VSIX packaging.
- Add a reusable prepublish validation step for formatter behavior and snippet contributions.

## 0.0.3

- Add `.vscodeignore` to keep workspace artifacts and generated VSIX files out of the published package.
- Expand shortcode formatting to handle nested WordPress shortcodes beyond `vc_*` tags.

## 0.0.2

- Bump extension version after reviewing the formatter activation and shortcode indentation flow.
