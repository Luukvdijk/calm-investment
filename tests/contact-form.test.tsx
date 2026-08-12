import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContactForm from "../src/components/ContactForm";
import { getDictionary } from "../src/lib/i18n";

const nl = getDictionary("nl");
const en = getDictionary("en");

function fill(name: string, email: string, message: string) {
  fireEvent.change(screen.getByLabelText(/naam|name/i), {
    target: { value: name },
  });
  fireEvent.change(screen.getByLabelText(/e-mail/i), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText(/bericht|message/i), {
    target: { value: message },
  });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ContactForm", () => {
  it("shows a Dutch validation error for an empty name", async () => {
    render(<ContactForm lang="nl" dict={nl} />);
    fireEvent.click(screen.getByRole("button", { name: nl.contact.form.submit }));
    expect(
      await screen.findByText(nl.contact.form.errors.nameRequired)
    ).toBeInTheDocument();
  });

  it("shows an English validation error for an invalid email", async () => {
    render(<ContactForm lang="en" dict={en} />);
    fill("Jan", "not-an-email", "Hello");
    fireEvent.click(screen.getByRole("button", { name: en.contact.form.submit }));
    expect(
      await screen.findByText(en.contact.form.errors.emailInvalid)
    ).toBeInTheDocument();
  });

  it("does not call the API when validation fails", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm lang="nl" dict={nl} />);
    fireEvent.click(screen.getByRole("button", { name: nl.contact.form.submit }));
    await screen.findByText(nl.contact.form.errors.nameRequired);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("submits and shows the success message", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<ContactForm lang="nl" dict={nl} />);
    fill("Jan Jansen", "jan@voorbeeld.nl", "Graag een gesprek.");
    fireEvent.click(screen.getByRole("button", { name: nl.contact.form.submit }));

    expect(
      await screen.findByText(nl.contact.form.success)
    ).toBeInTheDocument();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    const payload = JSON.parse((init as RequestInit).body as string);
    expect(payload.lang).toBe("nl");
    expect(payload.email).toBe("jan@voorbeeld.nl");
  });

  it("shows the server's localized error message on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ error: nl.contact.form.errors.rateLimited }),
          { status: 429 }
        )
      )
    );

    render(<ContactForm lang="nl" dict={nl} />);
    fill("Jan", "jan@voorbeeld.nl", "Test");
    fireEvent.click(screen.getByRole("button", { name: nl.contact.form.submit }));

    expect(
      await screen.findByText(nl.contact.form.errors.rateLimited)
    ).toBeInTheDocument();
  });

  it("shows a generic error when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(<ContactForm lang="en" dict={en} />);
    fill("Jan", "jan@voorbeeld.nl", "Test");
    fireEvent.click(screen.getByRole("button", { name: en.contact.form.submit }));

    await waitFor(() =>
      expect(
        screen.getByText(en.contact.form.errors.generic)
      ).toBeInTheDocument()
    );
  });
});
