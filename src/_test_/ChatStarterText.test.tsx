import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ChatStarterText from "@/components/layout/ChatSection/ChatStarterText";
import { describe, it, expect,vi } from "vitest";
import "@testing-library/jest-dom"; 
vi.mock("@/assets/Logo/LogoIcon",()=>({
 default: () => <svg data-testid="logo-icon" />,
}))
describe("ChatStarterText", () => {
  it("renders the starter text after animation", async () => {
    render(<ChatStarterText />);
    
    // Wait for the text to appear
    await waitFor(() =>
      expect(
        screen.getByText("What do you want to analyze today?")
      ).toBeInTheDocument()
    );
  });
});
describe("LogoIcon",()=>{
    it("LogoIcon to be rendered",async()=>{
      render(<ChatStarterText/>)
      await waitFor(()=>
        expect(screen.getByTestId("logo-icon")).toBeInTheDocument()
    )
    })
})
