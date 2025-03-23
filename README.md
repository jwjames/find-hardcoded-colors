# 🎨 find-hardcoded-colors

[![npm version](https://img.shields.io/npm/v/find-hardcoded-colors.svg)](https://www.npmjs.com/package/find-hardcoded-colors)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/jwjames/find-hardcoded-colors)](https://github.com/jwjames/find-hardcoded-colors/stargazers)
[![npm downloads](https://img.shields.io/npm/dm/find-hardcoded-colors.svg)](https://www.npmjs.com/package/find-hardcoded-colors)

> A CLI tool to detect hardcoded color values in React Native, JavaScript, and CSS codebases.

```bash
# Quickly scan your codebase for hardcoded colors
npx find-hardcoded-colors ./app
```

---

## 📦 Install

```bash
npm install -g find-hardcoded-colors
```

---

## 🚀 Usage

```bash
# Basic usage
find-hardcoded-colors ./app

# With JSON output
find-hardcoded-colors ./src --format=json

# Custom output file
find-hardcoded-colors ./app --output=report.txt

# Exclude specific directories
find-hardcoded-colors ./src --exclude=assets,dist,tests

# Combined options
find-hardcoded-colors ./src --format=json --output=colors.json --exclude=tests,fixtures
```

---

## 🔍 Options

```
--help                 Show help message
--version              Show package version
--format=<format>      Output format (text or json)
--output=<file>        Custom output file path
--exclude=<dirs>       Comma-separated list of directories to exclude
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (during development)
npm run test:watch
```

---

## ✅ What It Finds

- ✅ Hex values (#fff, #ffffff, #ffccaa99)
- ✅ rgb(), rgba()
- ✅ hsl(), hsla()
- ✅ Named CSS colors ("white", "black", "dodgerblue")
- ✅ Colors embedded in strings like border: '1px solid red'
- ✅ Suspicious quoted values (e.g., "redish", "somethingBlue") not using your theme

---

## 🚫 What It Ignores

- node_modules, android, ios, build, assets (customizable with --exclude)
- Your theme files (e.g. colors.ts, colorsDark.ts)

---

## 📄 Output

- Logs results to the terminal
- Saves a full report in one of two formats:
  - Text report (default): color-report.txt, grouped by file and line number
  - JSON report (with --format=json): color-report.json, structured data ideal for tooling

---

## 🤖 CI Integration

The JSON output mode makes it easy to integrate with CI pipelines:

```yaml
# In your CI config (e.g. GitHub Actions):
- name: Check for hardcoded colors
  run: |
    npx find-hardcoded-colors ./src --format=json --output=colors.json
    # Optional: Fail the build if more than 10 hardcoded colors are found
    if [[ $(cat colors.json | jq '.summary.totalColors') -gt 10 ]]; then
      echo "Too many hardcoded colors found!"
      exit 1
    fi
```

---

## 🆘 Help

```bash
find-hardcoded-colors --help
find-hardcoded-colors --version
```

---

## 📸 Example Output

### Text Output Format

```
Hardcoded Color Report
=====================

src/components/UI/ColorPicker.js (25 colors):
------------------------------------------
  Line 80: #FFB75E (hex)
    return ["#FFB75E", "#ED8F03"]

  Line 80: #ED8F03 (hex)
    return ["#FFB75E", "#ED8F03"]

  Line 82: #606c88 (hex)
    return ["#606c88", "#3f4c6b"]

// ... additional colors ...

src/screens/Dashboard.js (24 colors):
---------------------------------
  Line 97: #FFFFFF (hex)
    color: isDark ? "#FFFFFF" : "#000000",

  Line 97: #000000 (hex)
    color: isDark ? "#FFFFFF" : "#000000",

  Line 843: white (named)
    borderColor: "white",

// ... more files ...

Summary
-------
Total hardcoded colors found: 162
Files with hardcoded colors: 34

Color types:
  hex: 117
  unknown: 35
  named: 6
  rgba: 4
```

### JSON Output Format

```json
{
  "summary": {
    "totalColors": 162,
    "totalFiles": 34,
    "colorTypes": {
      "hex": 117,
      "unknown": 35,
      "named": 6,
      "rgba": 4
    }
  },
  "files": [
    {
      "file": "src/features/theme/colors.js",
      "count": 34,
      "colors": [
        {
          "file": "src/features/theme/colors.js",
          "line": 11,
          "color": "#FFD700",
          "context": "color: [\"#FFD700\", \"#FFA500\"]",
          "type": "hex"
        }
        // ... more colors ...
      ]
    }
    // ... more files ...
  ]
}
```

---

## 🛣️ Roadmap

- [ ] VS Code extension integration
- [ ] Color visualization in reports
- [ ] Whitelist support for acceptable hardcoded colors
- [ ] Auto-fix suggestions to use theme variables
- [ ] Support for more color formats (hwb, lab, etc.)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report bugs**: Create an issue if you find something not working correctly
2. **Suggest features**: Have an idea? Open an issue to suggest it
3. **Submit PRs**: Want to add a feature or fix a bug? PRs are welcome

Please make sure your code follows the existing style and includes appropriate tests.

---

## 👤 Author

Made with care by Jeff James

---

## 📝 License

MIT © [Jeff James](https://github.com/jwjames)

See [LICENSE](LICENSE) for full details.
