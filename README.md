# 🎨 find-hardcoded-colors

[![npm version](https://img.shields.io/npm/v/find-hardcoded-colors.svg)](https://www.npmjs.com/package/find-hardcoded-colors)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/jwjames/find-hardcoded-colors)](https://github.com/jwjames/find-hardcoded-colors/stargazers)

> A CLI tool to detect hardcoded color values in React Native, JavaScript, and CSS codebases.

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

## 🆘 Help

```bash
find-hardcoded-colors --help
find-hardcoded-colors --version
```

---

## 👤 Author

Made with care by Jeff James

---

Want to contribute or suggest a feature? Open an issue or submit a PR — let's make frontend codebases more maintainable together!
