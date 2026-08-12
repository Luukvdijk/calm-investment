"use client";

import { useRef, useState, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { CircleCheck } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";
import { validateContact } from "@/lib/contact-validation";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const t = dict.contact.form;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const validationError = validateContact(payload);
    if (validationError) {
      setError(t.errors[validationError]);
      return;
    }
    if (siteKey && !turnstileToken) {
      setError(t.errors.captchaRequired);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, lang, turnstileToken }),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      const body = await res.json().catch(() => null);
      setStatus("error");
      setError(
        body?.error ?? (res.status === 429 ? t.errors.rateLimited : t.errors.generic)
      );
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } catch {
      setStatus("error");
      setError(t.errors.generic);
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="border border-pine/30 bg-pine/5 p-8 text-center"
      >
        <CircleCheck aria-hidden className="mx-auto h-8 w-8 text-pine" strokeWidth={1.5} />
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.success}</p>
      </div>
    );
  }

  const inputClasses =
    "w-full border-b border-line bg-transparent py-3 text-[15px] text-ink placeholder:text-ink-soft/50 outline-none transition-colors focus:border-pine";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
      <div>
        <label htmlFor="contact-name" className="label block text-ink">
          {t.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t.namePlaceholder}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="label block text-ink">
          {t.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t.emailPlaceholder}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="label block text-ink">
          {t.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder={t.messagePlaceholder}
          className={`${inputClasses} resize-none`}
        />
      </div>

      {siteKey && (
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          options={{ theme: "light", language: lang }}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
        />
      )}

      {error && (
        <p role="alert" className="text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="label mt-2 bg-pine px-7 py-4 text-cream transition-colors hover:bg-pine-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? t.sending : t.submit}
      </button>
    </form>
  );
}
