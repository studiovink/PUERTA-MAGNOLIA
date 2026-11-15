import { hero } from '../content';

export default function Hero() {
  const d = `/images/${hero.desktop.id}`;
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <picture className="hero__picture">
        <source
          media="(max-width: 767px)"
          srcSet="/images/06-hero-movil-1080.webp 1080w, /images/06-hero-movil-2160.webp 2160w"
          sizes="100vw"
        />
        <img
          src={`${d}-1280.webp`}
          srcSet={`${d}-1280.webp 1280w, ${d}-3840.webp 3840w`}
          sizes="100vw"
          width={3840}
          height={2160}
          alt={hero.alt}
          fetchPriority="high"
          decoding="async"
          style={{ objectPosition: hero.desktop.position }}
        />
      </picture>

      <div className="container hero__inner">
        <div className="hero__aside">
          <p className="hero__support">{hero.support}</p>
          <a className="text-link text-link--light hero__link" href={hero.link.href}>{hero.link.label}</a>
        </div>
        <h1 className="hero__title" id="hero-title">
          {hero.titleLines.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </h1>
        <div className="hero__actions">
          <a className="button button--light" href={hero.cta.href}>{hero.cta.label}</a>
          <a className="text-link text-link--light" href={hero.link.href}>{hero.link.label}</a>
        </div>
      </div>
    </section>
  );
}
