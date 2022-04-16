/*
name MAIN_WINDOW_xxx matches renderer entry points in package.json config/forge:
{
  plugins: [
    [@electron-forge/plugin-webpack, {
      renderer: {
        entryPoints: [
          {
            name: "main_window", <-- Here
            ...
          }
        ]
      }
    }]
  ]
}
*/
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
