// Connect plugins to the file
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export const plugins = [
  autoprefixer,
  cssnano({ preset: "default" }), // set default minification settings
];
