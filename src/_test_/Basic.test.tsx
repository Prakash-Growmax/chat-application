import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, test, expect } from "vitest";
import AppContext from "@/components/context/AppContext";
import NewChatButton from "@/components/layout/SideBar/NewChatButton";

// Mock the navigate function
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the LucideIcon component
vi.mock("@/components/Custom-UI/LucideIcon", () => ({
  default: ({ name, size }: { name: string; size: number }) => (
    <svg data-testid="lucide-icon" data-name={name} data-size={size} />
  ),
}));

describe("NewChatButton", () => {
  test("renders the button with correct text", () => {
    render(
      <MemoryRouter>
        <AppContext.Provider value={{ setSideDrawerOpen: vi.fn() }}>
          <NewChatButton isMobile={false} isTab={false} />
        </AppContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("New Thread")).toBeInTheDocument();
    expect(screen.getByTestId("lucide-icon")).toBeInTheDocument();
  });

  test("navigates to /chat/new when clicked", () => {
    render(
      <MemoryRouter>
        <AppContext.Provider value={{ setSideDrawerOpen: vi.fn() }}>
          <NewChatButton isMobile={false} isTab={false} />
        </AppContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/chat/new");
  });

  test("closes the side drawer when clicked on mobile or tablet", () => {
    const mockSetSideDrawerOpen = vi.fn();
    render(
      <MemoryRouter>
        <AppContext.Provider value={{ setSideDrawerOpen: mockSetSideDrawerOpen }}>
          <NewChatButton isMobile={true} isTab={false} />
        </AppContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/chat/new");
    expect(mockSetSideDrawerOpen).toHaveBeenCalledWith(false);
  });
});
