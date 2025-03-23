#!/usr/bin/env node

/**
 * Script to find hardcoded colors in the codebase
 *
 * This script searches for:
 * - Hex colors (#FFF, #FFFFFF, etc.)
 * - RGB/RGBA color formats
 * - Named CSS colors like 'white', 'black', etc.
 *
 * Usage: node app/scripts/find-hardcoded-colors.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns to match different color formats
const HEX_COLOR_PATTERN =
  /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/g;
const RGB_COLOR_PATTERN = /\brgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g;
const RGBA_COLOR_PATTERN =
  /\brgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[0-9.]+\s*\)/g;
const HSL_COLOR_PATTERN = /\bhsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)/g;
const HSLA_COLOR_PATTERN =
  /\bhsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[0-9.]+\s*\)/g;

// Common CSS color names to look for
const COLOR_NAMES = [
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'rebeccapurple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
];

// Create a named color pattern - making sure it matches only property: 'color' pairs
// and not inside strings or other contexts
const NAMED_COLOR_PATTERN = new RegExp(
  `\\b(color|backgroundColor|borderColor|shadowColor|tintColor)\\s*:\\s*['"](${COLOR_NAMES.join(
    '|'
  )})['"\\s]`,
  'g'
);
const QUOTED_COLOR_PATTERN = new RegExp(
  `\\b(color|backgroundColor|borderColor|shadowColor|tintColor)\\s*:\\s*['"](.+?)['"]`,
  'g'
);

// Directories to exclude
const EXCLUDE_DIRS = [
  'node_modules',
  '.git',
  'build',
  'ios',
  'android',
  'assets',
];

// Exclude theme colors directory since that's where we define colors
const THEME_COLOR_DIRS = ['app/theme/colors.ts', 'app/theme/colorsDark.ts'];

// Keep track of found colors
const colorMatches = [];

/**
 * Check if a file is a text file we should process
 */
function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const textExtensions = [
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.css',
    '.scss',
    '.json',
    '.md',
    '.html',
  ];
  return textExtensions.includes(ext);
}

/**
 * Check if we should skip this file
 */
function shouldSkipFile(filePath) {
  // Skip theme color files
  if (THEME_COLOR_DIRS.some((dir) => filePath.includes(dir))) {
    return true;
  }

  // Skip directories we don't want to search
  if (EXCLUDE_DIRS.some((dir) => filePath.includes(`/${dir}/`))) {
    return true;
  }

  return false;
}

/**
 * Process a file to find color usages
 */
function processFile(filePath) {
  if (shouldSkipFile(filePath) || !isTextFile(filePath)) {
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, lineNumber) => {
      // Find hex colors
      const hexMatches = [...line.matchAll(HEX_COLOR_PATTERN)];
      hexMatches.forEach((match) => {
        colorMatches.push({
          file: filePath,
          line: lineNumber + 1,
          color: match[0],
          context: line.trim(),
          type: 'hex',
        });
      });

      // Find rgb colors
      const rgbMatches = [...(line.matchAll(RGB_COLOR_PATTERN) || [])];
      rgbMatches.forEach((match) => {
        colorMatches.push({
          file: filePath,
          line: lineNumber + 1,
          color: match[0],
          context: line.trim(),
          type: 'rgb',
        });
      });

      // Find rgba colors
      const rgbaMatches = [...(line.matchAll(RGBA_COLOR_PATTERN) || [])];
      rgbaMatches.forEach((match) => {
        colorMatches.push({
          file: filePath,
          line: lineNumber + 1,
          color: match[0],
          context: line.trim(),
          type: 'rgba',
        });
      });

      // Find HSL colors
      const hslMatches = [...(line.matchAll(HSL_COLOR_PATTERN) || [])];
      hslMatches.forEach((match) => {
        colorMatches.push({
          file: filePath,
          line: lineNumber + 1,
          color: match[0],
          context: line.trim(),
          type: 'hsl',
        });
      });

      // Find HSLA colors
      const hslaMatches = [...(line.matchAll(HSLA_COLOR_PATTERN) || [])];
      hslaMatches.forEach((match) => {
        colorMatches.push({
          file: filePath,
          line: lineNumber + 1,
          color: match[0],
          context: line.trim(),
          type: 'hsla',
        });
      });

      // Find named colors
      const namedMatches = [...(line.matchAll(NAMED_COLOR_PATTERN) || [])];
      namedMatches.forEach((match) => {
        colorMatches.push({
          file: filePath,
          line: lineNumber + 1,
          color: match[2],
          context: line.trim(),
          type: 'named',
        });
      });

      // Find quoted colors that don't match known names but might be literals
      const quotedMatches = [...(line.matchAll(QUOTED_COLOR_PATTERN) || [])];
      quotedMatches.forEach((match) => {
        // Skip if this was already matched as a named color
        if (
          !COLOR_NAMES.includes(match[2]) &&
          !match[2].startsWith('#') &&
          !match[2].startsWith('rgb') &&
          !match[2].startsWith('hsl') &&
          // Skip references to theme colors
          !match[2].includes('colors.') &&
          !match[2].includes('theme.')
        ) {
          colorMatches.push({
            file: filePath,
            line: lineNumber + 1,
            color: match[2],
            context: line.trim(),
            type: 'unknown',
          });
        }
      });
    });
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

/**
 * Walk through a directory recursively
 */
function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory() && !EXCLUDE_DIRS.includes(file)) {
      walkDirectory(filePath);
    } else if (stats.isFile()) {
      processFile(filePath);
    }
  });
}

/**
 * Format the output for better readability
 */
function formatOutput() {
  // Group by file
  const byFile = {};
  colorMatches.forEach((match) => {
    if (!byFile[match.file]) {
      byFile[match.file] = [];
    }
    byFile[match.file].push(match);
  });

  let output = '\nHardcoded Color Report\n=====================\n\n';

  // Sort files by number of color usages (most problematic first)
  const sortedFiles = Object.keys(byFile).sort(
    (a, b) => byFile[b].length - byFile[a].length
  );

  sortedFiles.forEach((file) => {
    const matches = byFile[file];
    output += `${file} (${matches.length} colors):\n`;
    output += '-'.repeat(file.length + 10) + '\n';

    // Sort matches by line number
    matches.sort((a, b) => a.line - b.line);

    matches.forEach((match) => {
      output += `  Line ${match.line}: ${match.color} (${match.type})\n`;
      output += `    ${match.context}\n\n`;
    });

    output += '\n';
  });

  // Summary
  output += 'Summary\n-------\n';
  output += `Total hardcoded colors found: ${colorMatches.length}\n`;
  output += `Files with hardcoded colors: ${sortedFiles.length}\n\n`;

  // Group by color type
  const colorTypes = {};
  colorMatches.forEach((match) => {
    if (!colorTypes[match.type]) {
      colorTypes[match.type] = 0;
    }
    colorTypes[match.type]++;
  });

  output += 'Color types:\n';
  Object.keys(colorTypes).forEach((type) => {
    output += `  ${type}: ${colorTypes[type]}\n`;
  });

  return output;
}

/**
 * Main function
 */
function main() {
  console.log('Searching for hardcoded colors...');

  // Start at the app directory to avoid scanning unnecessary files
  walkDirectory('app');

  const output = formatOutput();

  // Write to file
  const reportFile = 'color-report.txt';
  fs.writeFileSync(reportFile, output);

  console.log(
    `Found ${colorMatches.length} hardcoded colors in ${
      Object.keys(
        colorMatches.reduce((acc, match) => {
          acc[match.file] = true;
          return acc;
        }, {})
      ).length
    } files.`
  );
  console.log(`Report saved to ${reportFile}`);
}

main();
