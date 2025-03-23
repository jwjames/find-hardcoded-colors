// This is a sample file with various color formats for testing

// Hex colors
const hexColor1 = '#FFF';
const hexColor2 = '#FFFFFF';
const hexColor3 = '#FF0000';
const hexColor4 = '#FF000080'; // With alpha

// RGB/RGBA colors
const rgbColor1 = 'rgb(255, 0, 0)';
const rgbColor2 = 'rgb(0, 255, 0)';
const rgbaColor1 = 'rgba(0, 0, 255, 0.5)';
const rgbaColor2 = 'rgba(255, 255, 255, 1)';

// HSL/HSLA colors
const hslColor1 = 'hsl(0, 100%, 50%)';
const hslColor2 = 'hsl(120, 100%, 50%)';
const hslaColor1 = 'hsla(240, 100%, 50%, 0.5)';
const hslaColor2 = 'hsla(180, 50%, 50%, 1)';

// Named colors
const namedColor1 = {
  color: 'red',
  backgroundColor: 'blue',
  borderColor: 'green',
};

// Colors inside strings (embedded)
const border = '1px solid black';
const boxShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
const gradient = 'linear-gradient(to right, red, blue)';

// Theme color references - should be ignored
const themeColor1 = colors.primary;
const themeColor2 = theme.secondary;

// Unknown potential colors
const suspiciousColor1 = {
  color: 'redish',
  backgroundColor: 'skyBlue',
};
