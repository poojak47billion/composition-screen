import React from "react";

const ThemeContext = React.createContext({
  theme: "bg-light",
  setTheme: themeStylePath => {
    <link rel="stylesheet" type="text/css" href={this.state.stylePath} />;
  }
});

export default ThemeContext;

// Reveal Themes
// black (default)
// white
// league
// beige
// night
// serif
// simple
// solarized
// moon
// sky
