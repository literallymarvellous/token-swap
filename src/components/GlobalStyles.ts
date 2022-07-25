import { createGlobalStyle } from "styled-components";
import { COLORS } from "../designTokens";

const GlobalStyles = createGlobalStyle`
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
  font-size: 100%;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}


/* GLOBAL STYLES */
*,
*:before,
*:after {
  box-sizing: border-box;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
}

#root {
  /*
    Create a stacking context, without a z-index.
    This ensures that all portal content (modals and tooltips) will
    float above the app.
  */
  isolation: isolate;
}

html {
  /* Colors */
  --color-white: hsl(${COLORS.white});
  --color-black: hsl(${COLORS.black});
  --color-primary: hsl(${COLORS.primary});
  --color-primary-dark: hsl(${COLORS.primaryDark});
  --color-primary-light: hsl(${COLORS.primaryLight});

  /* shadows */
  :root {
  --shadow-color: 51deg 6% 46%;
  --shadow-elevation-low:
    0px 0.2px 0.2px hsl(var(--shadow-color) / 0.38),
    0px 0.3px 0.3px -1.4px hsl(var(--shadow-color) / 0.36),
    -0.1px 0.8px 0.9px -2.7px hsl(var(--shadow-color) / 0.33);
  --shadow-elevation-medium:
    0px 0.2px 0.2px hsl(var(--shadow-color) / 0.32),
    0px 0.5px 0.5px -0.7px hsl(var(--shadow-color) / 0.31),
    -0.1px 1px 1.1px -1.4px hsl(var(--shadow-color) / 0.29),
    -0.2px 2px 2.2px -2.1px hsl(var(--shadow-color) / 0.28),
    -0.4px 3.9px 4.3px -2.7px hsl(var(--shadow-color) / 0.27);
  --shadow-elevation-high:
    0px 0.2px 0.2px hsl(var(--shadow-color) / 0.29),
    -0.1px 0.9px 1px -0.3px hsl(var(--shadow-color) / 0.29),
    -0.1px 1.5px 1.6px -0.6px hsl(var(--shadow-color) / 0.28),
    -0.2px 2.4px 2.6px -0.9px hsl(var(--shadow-color) / 0.28),
    -0.3px 3.5px 3.8px -1.2px hsl(var(--shadow-color) / 0.27),
    -0.5px 5.1px 5.6px -1.5px hsl(var(--shadow-color) / 0.27),
    -0.7px 7.4px 8.1px -1.8px hsl(var(--shadow-color) / 0.26),
    -1px 10.4px 11.4px -2.1px hsl(var(--shadow-color) / 0.26),
    -1.3px 14.4px 15.7px -2.4px hsl(var(--shadow-color) / 0.25),
    -1.8px 19.6px 21.4px -2.7px hsl(var(--shadow-color) / 0.25);
}

  /* Fonts */
  --font-family-nova: "Ibarra Real Nova", serif;
  --font-family-incon: 'Inconsolata', monospace;

  /* Spacing */
  --spacing-wrapper: 16px;

  --border-radius: 3px;
}

html, body, #root {
  height: 100%;
  background: var(--color-primary);
}
`;

export default GlobalStyles;
