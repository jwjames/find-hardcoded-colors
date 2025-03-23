const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('CLI Integration Tests', () => {
  const fixturesDir = path.join(__dirname, '../fixtures');
  const tempOutputFile = path.join(__dirname, '../temp-output.json');

  // Clean up any previous test output
  beforeEach(() => {
    if (fs.existsSync(tempOutputFile)) {
      fs.unlinkSync(tempOutputFile);
    }
  });

  // Clean up after tests
  afterEach(() => {
    if (fs.existsSync(tempOutputFile)) {
      fs.unlinkSync(tempOutputFile);
    }
  });

  test('should run without errors', () => {
    const result = execSync(
      `node ${path.join(__dirname, '../../index.js')} ${fixturesDir}`,
      {
        encoding: 'utf-8',
        stdio: 'pipe',
      }
    );

    expect(result).toContain('Searching for hardcoded colors');
    expect(result).toContain('Found');
    expect(result).toContain('hardcoded colors in');
    expect(result).toContain('files');
    expect(result).toContain('Report saved to');

    // Check that the default output file was created
    expect(fs.existsSync('color-report.txt')).toBe(true);
  });

  test('should output JSON when --format=json is specified', () => {
    execSync(
      `node ${path.join(
        __dirname,
        '../../index.js'
      )} ${fixturesDir} --format=json --output=${tempOutputFile}`,
      {
        encoding: 'utf-8',
      }
    );

    // Check that the JSON file was created
    expect(fs.existsSync(tempOutputFile)).toBe(true);

    // Verify JSON content structure
    const jsonContent = JSON.parse(fs.readFileSync(tempOutputFile, 'utf-8'));
    expect(jsonContent).toHaveProperty('summary');
    expect(jsonContent).toHaveProperty('files');
    expect(jsonContent.summary).toHaveProperty('totalColors');
    expect(jsonContent.summary).toHaveProperty('totalFiles');
    expect(jsonContent.summary).toHaveProperty('colorTypes');
    expect(Array.isArray(jsonContent.files)).toBe(true);

    // Should have found colors in our fixture files
    expect(jsonContent.summary.totalColors).toBeGreaterThan(0);
    expect(jsonContent.summary.totalFiles).toBeGreaterThan(0);
  });

  test('should respect --exclude option', () => {
    // First run without exclude to get baseline
    execSync(
      `node ${path.join(
        __dirname,
        '../../index.js'
      )} ${fixturesDir} --format=json --output=${tempOutputFile}`,
      {
        encoding: 'utf-8',
      }
    );
    const baselineJson = JSON.parse(fs.readFileSync(tempOutputFile, 'utf-8'));

    // Now run with exclude for .js files (explicitly excluding 'sample.js')
    execSync(
      `node ${path.join(
        __dirname,
        '../../index.js'
      )} ${fixturesDir} --format=json --output=${tempOutputFile} --exclude=sample.js`,
      {
        encoding: 'utf-8',
      }
    );
    const excludedJson = JSON.parse(fs.readFileSync(tempOutputFile, 'utf-8'));

    // The most reliable test - checking that excluding a file actually removed it from results
    const sampleJsInBaseline = baselineJson.files.some((f) =>
      f.file.includes('sample.js')
    );
    const sampleJsInExcluded = excludedJson.files.some((f) =>
      f.file.includes('sample.js')
    );

    // First confirm our sample.js file was in the baseline
    expect(sampleJsInBaseline).toBe(true);

    // Then verify it's not in the results after excluding it
    expect(sampleJsInExcluded).toBe(false);
  });
});
