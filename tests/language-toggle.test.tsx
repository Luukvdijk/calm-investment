import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import LanguageToggle from "../src/components/LanguageToggle";

const { pathnameMock } = vi.hoisted(() => ({ pathnameMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname: pathnameMock,
}));

afterEach(cleanup);

describe("LanguageToggle", () => {
  it("links from nl to the same page in en", () => {
    pathnameMock.mockReturnValue("/nl/portfolio");
    render(<LanguageToggle lang="nl" />);
    const link = screen.getByRole("link", { name: /switch to english/i });
    expect(link).toHaveAttribute("href", "/en/portfolio");
    expect(link).toHaveTextContent("EN");
  });

  it("links from en back to nl", () => {
    pathnameMock.mockReturnValue("/en");
    render(<LanguageToggle lang="en" />);
    const link = screen.getByRole("link", { name: /wissel naar nederlands/i });
    expect(link).toHaveAttribute("href", "/nl");
    expect(link).toHaveTextContent("NL");
  });
});
