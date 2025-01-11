/** @type {import('tailwindcss').Config} */
import tailwindcssanimate from "tailwindcss-animate";
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"], // Set as default sans font
        inter: ["Inter", "sans-serif"], // Keep this for explicit usage
      },
      fontSize: {
        //existing...
        // xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
        // sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        // md: ["1.0625rem", { lineHeight: "1.5rem" }], // 17px - ChatGPT's common text size
        // lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        // xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
        // "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px - ChatGPT's heading size
        // "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
        // itemHeader: ["0.8125rem", { lineHeight: "1.25rem" }],

        // new....
        h1: ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["1.75rem", { lineHeight: "1.4", fontWeight: "600" }],
        h4: ["1.5rem", { lineHeight: "1.4", fontWeight: "500" }],
        h5: ["1.25rem", { lineHeight: "1.5", fontWeight: "500" }],
        h6: ["1.125rem", { lineHeight: "1.5", fontWeight: "500" }],
        // Body text sizes
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      // Rest of your existing configuration
      spacing: {
        //old
        // xs: "var(--spacing-xs)",
        // sm: "var(--spacing-sm)",
        // md: "var(--spacing-md)",
        // lg: "var(--spacing-lg)",
        // xl: "var(--spacing-xl)",

        //new
        "layout-sm": "0.75rem", // 12px
        layout: "1rem", // 16px
        "layout-lg": "1.5rem", // 24px
        "layout-xl": "2rem", // 32px
        section: "4rem", // 64px
        "section-lg": "6rem", // 96px
      },
      borderRadius: {
        //old...
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        chat: "1.5rem", // ChatGPT's rounded corners
        full: "9999px", // For circular buttons
      },
      colors: {
        //old..
        "custom-color": "rgb(2, 8, 23)",
        // background: "hsl(var(--background))",
        // foreground: "hsl(var(--foreground))",
        // "chat-bg": "#f4f4f4", // ChatGPT's input background
        // "chat-border": "#e5e5e5",
        // "chat-text": "#343541",
        // "chat-placeholder": "#8e8ea0",
        // card: {
        //   DEFAULT: "hsl(var(--card))",
        //   foreground: "hsl(var(--card-foreground))",
        // },

        //new..
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          // Add your secondary color scale
        },
        // ... rest of your colors
      },

      //old...
      // height: {
      //   "chat-input": "44px",
      //   "chat-min": "24px",
      // },
      // maxHeight: {
      //   "chat-max": "200px",
      // },
      //new...
      maxWidth: {
        "container-sm": "640px",
        container: "1024px",
        "container-lg": "1280px",
      },
    },
  },
  plugins: [tailwindcssanimate],
};
