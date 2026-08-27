/**
 * Calm Investments wordmark: script "Calm" over letterspaced "INVESTMENTS".
 * Approximation of the brand logo with the Pacifico script face; swap for the
 * real vector by replacing this component's markup with an inline SVG or
 * <img src="/images/logo.svg"> once the original file is available.
 */
export default function Logo({
  tone = "dark",
  size = "md",
}: {
  /** dark = pine on light backgrounds, light = cream on green backgrounds */
  tone?: "dark" | "light";
  size?: "md" | "lg";
}) {
  const color = tone === "dark" ? "text-pine" : "text-cream";
  const script = size === "lg" ? "text-4xl" : "text-[27px]";
  const sub =
    size === "lg"
      ? "text-[11px] tracking-[0.34em]"
      : "text-[8px] tracking-[0.3em]";

  return (
    <span className={`inline-flex flex-col items-center leading-none ${color}`}>
      <span className={`font-logo ${script}`}>Calm</span>
      <span className={`${sub} -mt-0.5 font-sans font-semibold uppercase`}>
        Investments
      </span>
    </span>
  );
}
