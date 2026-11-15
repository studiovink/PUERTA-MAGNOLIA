import type { SiteImage } from '../content';

interface Props {
  image: SiteImage;
  /** Ancho que ocupa la imagen en pantalla, para que el navegador elija la variante. */
  sizes: string;
  className?: string;
  /** Inclinación 3D al pasar el cursor. */
  tilt?: boolean;
}

/**
 * Fotografía interior: variantes reales de 1280 y 3840 px, carga diferida y dimensiones explícitas.
 * El marco recorta la foto para poder moverla dentro (parallax) y descubrirla al entrar.
 */
export default function Picture({ image, sizes, className, tilt }: Props) {
  const base = `/images/${image.id}`;
  return (
    <span className={`media ${className ?? ''}`} data-media data-reveal="media" {...(tilt ? { 'data-tilt': '' } : {})}>
      <span className="media__clip">
        <img
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
      </span>
    </span>
  );
}
