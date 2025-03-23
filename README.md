# 🎨 find-hardcoded-colors

> A CLI tool to detect hardcoded color values in React Native, JavaScript, and CSS codebases.

## 📦 Install

```bash
npm install -g find-hardcoded-colors

🚀 Usage

find-hardcoded-colors ./app

Scans your codebase for:
	•	✅ Hex values (#fff, #ffffff, #ffccaa99)
	•	✅ rgb(), rgba()
	•	✅ hsl(), hsla()
	•	✅ Named colors ("white", "black", "dodgerblue")
	•	✅ Suspicious quoted values that may be hardcoded

Ignores:
	•	node_modules, android, ios, build, assets
	•	Your theme files (like colors.ts or colorsDark.ts)

📄 Output
	•	Logs results to the terminal
	•	Saves a full report to color-report.txt

👤 Author

Made with care by Jeff James

```
