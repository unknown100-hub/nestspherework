tailwind.config = {
  theme: { extend: {
    fontFamily: { sans: ['"Plus Jakarta Sans"','sans-serif'], display: ['"Space Grotesk"','sans-serif'] },
    colors: {
      primary: '#002218', 'primary-container': '#0f382c', 'on-primary': '#ffffff',
      secondary: '#904d00', 'secondary-container': '#fe932c', 'secondary-fixed': '#ffdcc3',
      surface: '#f9f9ff', 'surface-low': '#f0f3ff', 'surface-container': '#e7eeff',
      'on-surface': '#111c2d', 'on-surface-variant': '#414845', outline: '#717975',
      'outline-variant': '#c1c8c3', error: '#ba1a1a'
    },
    borderRadius: { '4xl': '2rem', '5xl': '2.5rem' }
  } }
};
