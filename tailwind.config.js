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
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
        md: ["1.0625rem", { lineHeight: "1.5rem" }], // 17px - ChatGPT's common text size
        lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
        "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px - ChatGPT's heading size
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
        itemHeader: ["0.8125rem", { lineHeight: "1.25rem" }],
      },
      // Rest of your existing configuration
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        chat: "1.5rem", // ChatGPT's rounded corners
        full: "9999px", // For circular buttons
      },
      colors: {
        "custom-color": "rgb(2, 8, 23)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "chat-bg": "#f4f4f4", // ChatGPT's input background
        "chat-border": "#e5e5e5",
        "chat-text": "#343541",
        "chat-placeholder": "#8e8ea0",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ... rest of your colors
      },
      // Add specific heights for the chat interface
      height: {
        "chat-input": "44px",
        "chat-min": "24px",
      },
      maxHeight: {
        "chat-max": "200px",
      },
      // ... rest of your existing config
    },
  },
  plugins: [tailwindcssanimate],
};
