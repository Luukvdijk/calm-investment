import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import CookieConsent from "../src/components/CookieConsent";
import CookieSettingsLink from "../src/components/CookieSettingsLink";
import { CONSENT_COOKIE, GA_SCRIPT_ID } from "../src/lib/consent";
import { getDictionary } from "../src/lib/i18n";

const nl = getDictionary("nl");
const en = getDictionary("en");

function clearState() {
  document.cookie = `${CONSENT_COOKIE}=;path=/;max-age=0`;
  document.getElementById(GA_SCRIPT_ID)?.remove();
  delete window.dataLayer;
  delete window.gtag;
}

beforeEach(() => {
  clearState();
  vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST123");
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  clearState();
});

describe("CookieConsent", () => {
  it("renders nothing when no GA id is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    const { container } = render(<CookieConsent lang="nl" dict={nl} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the banner in Dutch when no choice was made yet", async () => {
    render(<CookieConsent lang="nl" dict={nl} />);
    expect(await screen.findByText(nl.cookieBanner.text, { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: nl.cookieBanner.accept })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: nl.cookieBanner.reject })).toBeInTheDocument();
    expect(document.getElementById(GA_SCRIPT_ID)).toBeNull();
  });

  it("shows the banner in English", async () => {
    render(<CookieConsent lang="en" dict={en} />);
    expect(await screen.findByRole("button", { name: en.cookieBanner.accept })).toBeInTheDocument();
  });

  it("accept stores consent and loads GA exactly once", async () => {
    render(<CookieConsent lang="nl" dict={nl} />);
    fireEvent.click(await screen.findByRole("button", { name: nl.cookieBanner.accept }));

    expect(document.cookie).toContain(`${CONSENT_COOKIE}=granted`);
    const script = document.getElementById(GA_SCRIPT_ID) as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(script.src).toContain("googletagmanager.com/gtag/js?id=G-TEST123");
    expect(window.dataLayer?.length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: nl.cookieBanner.accept })).toBeNull();
  });

  it("reject stores denial and never loads GA", async () => {
    render(<CookieConsent lang="nl" dict={nl} />);
    fireEvent.click(await screen.findByRole("button", { name: nl.cookieBanner.reject }));

    expect(document.cookie).toContain(`${CONSENT_COOKIE}=denied`);
    expect(document.getElementById(GA_SCRIPT_ID)).toBeNull();
    expect(window.dataLayer).toBeUndefined();
  });

  it("stays hidden when consent was already denied", async () => {
    document.cookie = `${CONSENT_COOKIE}=denied;path=/`;
    render(<CookieConsent lang="nl" dict={nl} />);
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByRole("button", { name: nl.cookieBanner.accept })).toBeNull();
    expect(document.getElementById(GA_SCRIPT_ID)).toBeNull();
  });

  it("loads GA silently when consent was already granted", async () => {
    document.cookie = `${CONSENT_COOKIE}=granted;path=/`;
    render(<CookieConsent lang="nl" dict={nl} />);
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByRole("button", { name: nl.cookieBanner.accept })).toBeNull();
    expect(document.getElementById(GA_SCRIPT_ID)).not.toBeNull();
  });

  it("reopens via the footer cookie settings link", async () => {
    document.cookie = `${CONSENT_COOKIE}=denied;path=/`;
    render(
      <>
        <CookieConsent lang="nl" dict={nl} />
        <CookieSettingsLink label={nl.cookieBanner.settings} />
      </>
    );
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByRole("button", { name: nl.cookieBanner.accept })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: nl.cookieBanner.settings }));
    expect(await screen.findByRole("button", { name: nl.cookieBanner.accept })).toBeInTheDocument();
  });

  it("hides the footer settings link without a GA id", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    const { container } = render(<CookieSettingsLink label={nl.cookieBanner.settings} />);
    expect(container).toBeEmptyDOMElement();
  });
});
