/**
 * Logo de uma tecnologia (via Simple Icons), em tom neutro por padrão e
 * colorido no hover. Coloque este componente dentro de um elemento com a
 * classe `group` para o hover funcionar.
 */

const MUTED_HEX = "a1a1aa";
const ACCENT_HEX = "22d3ee";

type TechIconProps = {
  slug: string;
  label: string;
  size?: number;
  className?: string;
};

export function TechIcon({ slug, label, size = 24, className = "" }: TechIconProps) {
  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ícone externo pequeno, next/image não traz ganho aqui */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/${MUTED_HEX}`}
        alt={label}
        width={size}
        height={size}
        loading="lazy"
        className="absolute inset-0 h-full w-full transition-opacity duration-300 group-hover:opacity-0"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${slug}/${ACCENT_HEX}`}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        loading="lazy"
        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </span>
  );
}
