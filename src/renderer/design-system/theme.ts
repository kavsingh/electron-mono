export type Theme = Immutable<{
  name: "light" | "dark";
  fonts: {
    bodyText: string;
  };
  colors: {
    bodyText: string;
    background: string;
    keyline: string;
  };
}>;

export const lightTheme: Theme = {
  name: "light",
  fonts: {
    bodyText: "system-ui, sans-serif",
  },
  colors: {
    bodyText: "#222",
    background: "#fefefe",
    keyline: "#dedede",
  },
};

export const darkTheme: Theme = {
  name: "dark",
  fonts: {
    bodyText: "system-ui, sans-serif",
  },
  colors: {
    bodyText: "#fefefe",
    background: "#222",
    keyline: "#434343",
  },
};

export const defaultTheme = darkTheme;
