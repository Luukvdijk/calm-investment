import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { validateContact } from "@/lib/contact-validation";

// Simple in-memory rate limiter (per serverless instance)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    const t = getDictionary(defaultLocale).contact.form.errors;
    return NextResponse.json({ error: t.generic, code: "invalid" }, { status: 400 });
  }

  const lang: Locale =
    typeof body.lang === "string" && isLocale(body.lang) ? body.lang : defaultLocale;
  const t = getDictionary(lang).contact.form.errors;

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: t.rateLimited, code: "rate_limited" },
        { status: 429 }
      );
    }
    entry.count++;
  } else {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  // Field validation (same rules as the client)
  const validationError = validateContact(body);
  if (validationError) {
    return NextResponse.json(
      { error: t[validationError], code: validationError },
      { status: 400 }
    );
  }

  const name = String(body.name).trim();
  const email = String(body.email).trim();
  const message = String(body.message).trim();

  // Cloudflare Turnstile verification
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (secretKey) {
    const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    if (!token) {
      return NextResponse.json(
        { error: t.captchaRequired, code: "captcha_required" },
        { status: 400 }
      );
    }
    try {
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: secretKey, response: token }),
        }
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json(
          { error: t.captchaRequired, code: "captcha_failed" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: t.generic, code: "captcha_error" },
        { status: 502 }
      );
    }
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "j.vanderhelm@calminvestments.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Calm Investments <onboarding@resend.dev>";

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: resendError } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Nieuw bericht van ${name}`,
      html: `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F4EF;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4EF;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="padding-bottom:28px;">
          <p style="margin:0;font-size:22px;color:#20261F;">Calm Investments</p>
          <p style="margin:6px 0 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#145029;">Nieuw contactverzoek</p>
        </td></tr>
        <tr><td style="padding-bottom:24px;"><div style="height:1px;background:#D8D6CA;"></div></td></tr>
        <tr><td style="background:#FAF9F5;border:1px solid #D8D6CA;padding:28px;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#145029;">Naam</p>
          <p style="margin:0 0 18px;font-size:15px;color:#20261F;">${safeName}</p>
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#145029;">E-mail</p>
          <p style="margin:0 0 18px;font-size:15px;color:#20261F;">${safeEmail}</p>
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#145029;">Bericht</p>
          <p style="margin:0;font-size:15px;color:#20261F;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
        </td></tr>
        <tr><td style="padding-top:24px;">
          <a href="mailto:${safeEmail}" style="display:inline-block;background:#145029;color:#FAF9F5;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:12px 26px;text-decoration:none;">Beantwoord bericht</a>
        </td></tr>
        <tr><td style="padding-top:28px;">
          <p style="margin:0;font-size:11px;color:#4C544B;">Verstuurd via calminvestments.com op ${new Date().toLocaleString("nl-NL")}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    if (resendError) {
      console.error("Resend error:", resendError);
      return NextResponse.json(
        { error: t.generic, code: "send_failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: t.generic, code: "send_failed" },
      { status: 500 }
    );
  }
}
