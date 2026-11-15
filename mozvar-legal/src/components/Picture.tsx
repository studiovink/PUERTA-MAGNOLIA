import type { SiteImage } from '../content';

interface Props {
  image: SiteImage;
  /** Ancho que ocupa la imagen en pantalla, para que el navegador elija la variante. */
  sizes: string;
  className?: string;
}

/** Fotografía interior: variantes reales de 1280 y 3840 px, carga diferida y dimensiones explícitas. */
export default function Picture({ image, sizes, className }: Props) {
  const base = `/images/${image.id}`;
  return (
    <img
      className={className}
      src={`${base}-1280.webp`}
      srcSet={`${base}-1280.webp 1280w, ${base}-3840.webp 3840w`}
      sizes={sizes}
      width={3840}
      height={2160}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      style={{ objectPosition: image.position }}
    />
  );
}
