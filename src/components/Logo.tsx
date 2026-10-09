/* eslint-disable @next/next/no-img-element */
/**
 * Calm Investments wordmark: het oorspronkelijke logo, overgezet naar vector
 * zodat het op elk formaat en op retina scherp blijft.
 * logo.svg = groen voor lichte achtergronden, logo-cream.svg voor de groene vlakken.
 */
export default function Logo({
  tone = "dark",
  size = "md",
}: {
  /** dark = groen logo op lichte achtergrond, light = cream op groen */
  tone?: "dark" | "light";
  size?: "md" | "lg";
}) {
  const src = tone === "dark" ? "/images/logo.svg" : "/images/logo-cream.svg";
  const width = size === "lg" ? 150 : 104;
  const height = Math.round(width * (248 / 400));

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
