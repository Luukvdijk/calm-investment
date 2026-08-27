/* eslint-disable @next/next/no-img-element */
/**
 * Official Calm Investments wordmark (from the client's brand files).
 * logo.png = brand green for light backgrounds; logo-cream.png = cream
 * recolor for the green sections. Both 279x146 with transparency.
 */
export default function Logo({
  tone = "dark",
  size = "md",
}: {
  /** dark = green wordmark on light backgrounds, light = cream on green */
  tone?: "dark" | "light";
  size?: "md" | "lg";
}) {
  const src = tone === "dark" ? "/images/logo.png" : "/images/logo-cream.png";
  const width = size === "lg" ? 134 : 96;
  const height = Math.round(width * (146 / 279));

  return (
    <img
      src={src}
      alt="Calm Investments"
      width={width}
      height={height}
      className="block"
    />
  );
}
