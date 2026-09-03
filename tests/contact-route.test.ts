// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import nl from "../content/nl.json";
import en from "../content/en.json";

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { POST } from "../src/app/api/contact/route";

let ipCounter = 0;
function makeRequest(body: unknown, ip?: string): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip ?? `10.0.0.${++ipCounter}`,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid = {
  name: "Jan Jansen",
  email: "jan@voorbeeld.nl",
  message: "Ik wil graag in gesprek.",
  lang: "nl",
};

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ error: null });
  delete process.env.TURNSTILE_SECRET_KEY;
  process.env.RESEND_API_KEY = "re_test_key";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/contact", () => {
  it("sends an email for a valid submission", async () => {
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(sendMock).toHaveBeenCalledOnce();
    const arg = sendMock.mock.calls[0][0];
    expect(arg.replyTo).toBe(valid.email);
    expect(arg.html).toContain("Jan Jansen");
  });

  it("escapes HTML in the email body", async () => {
    const res = await POST(
      makeRequest({ ...valid, message: '<script>alert("x")</script>' })
    );
    expect(res.status).toBe(200);
    const arg = sendMock.mock.calls[0][0];
    expect(arg.html).not.toContain("<script>");
    expect(arg.html).toContain("&lt;script&gt;");
  });

  it("rejects invalid JSON", async () => {
    const res = await POST(makeRequest("{not json"));
    expect(res.status).toBe(400);
  });

  it("returns a Dutch error for missing fields when lang=nl", async () => {
    const res = await POST(makeRequest({ ...valid, name: "" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(nl.contact.form.errors.nameRequired);
    expect(body.code).toBe("nameRequired");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns an English error for missing fields when lang=en", async () => {
    const res = await POST(makeRequest({ ...valid, lang: "en", email: "nope" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(en.contact.form.errors.emailInvalid);
  });

  it("falls back to Dutch for an unknown lang", async () => {
    const res = await POST(makeRequest({ ...valid, lang: "de", message: "" }));
    const body = await res.json();
    expect(body.error).toBe(nl.contact.form.errors.messageRequired);
  });

  it("requires a turnstile token when the secret is configured", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("captcha_required");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a failed turnstile verification with a localized error", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false }), { status: 200 })
      )
    );
    const res = await POST(
      makeRequest({ ...valid, lang: "en", turnstileToken: "tok" })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe(en.contact.form.errors.captchaRequired);
  });

  it("accepts a passing turnstile verification", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      )
    );
    const res = await POST(makeRequest({ ...valid, turnstileToken: "tok" }));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();
  });

  it("returns a clear 500 when RESEND_API_KEY is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.code).toBe("not_configured");
    expect(body.error).toBe(nl.contact.form.errors.generic);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized message with a localized error", async () => {
    const res = await POST(
      makeRequest({ ...valid, lang: "en", message: "x".repeat(5001) })
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("tooLong");
    expect(body.error).toBe(en.contact.form.errors.tooLong);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns a localized 500 when Resend fails", async () => {
    sendMock.mockResolvedValue({ error: { message: "boom" } });
    const res = await POST(makeRequest(valid));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe(nl.contact.form.errors.generic);
  });

  it("rate limits after 5 requests from the same IP", async () => {
    const ip = "203.0.113.99";
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(valid, ip));
      expect(res.status).toBe(200);
    }
    const res = await POST(makeRequest(valid, ip));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe(nl.contact.form.errors.rateLimited);
  });
});
