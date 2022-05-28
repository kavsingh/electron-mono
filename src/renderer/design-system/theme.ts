const font: Theme["font"] = {
  body: "system-ui, sans-serif",
};

const spacing: Theme["spacing"] = {
  fixed: { 0: "0.4rem", 1: "1rem" },
  relative: { 0: "0.4em", 1: "1em" },
};

const radius: Theme["radius"] = {
  fixed: { 0: "0.12rem", 1: "0.24rem" },
  relative: { 0: "0.12em", 1: "0.24em" },
};

export const lightTheme: Theme = {
  font,
  spacing,
  radius,
  name: "light",
  color: {
    surface: { 0: "#fefefe" },
    text: { 100: "#dedede", 400: "#222" },
  },
};

export const darkTheme: Theme = {
  font,
  spacing,
  radius,
  name: "dark",
  color: {
    surface: { 0: "#222" },
    text: { 100: "#434343", 400: "#fefefe" },
  },
};

export const defaultTheme = darkTheme;

export type Theme = Immutable<{
  name: "light" | "dark";
  font: {
    body: string;
  };
  color: {
    surface: { 0: string };
    text: { 100: string; 400: string };
  };
  spacing: {
    fixed: { 0: string; 1: string };
    relative: { 0: string; 1: string };
  };
  radius: {
    fixed: { 0: string; 1: string };
    relative: { 0: string; 1: string };
  };
}>;
