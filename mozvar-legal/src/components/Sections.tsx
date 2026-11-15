import { approach, intro, matters, method, services } from '../content';
import Picture from './Picture';
import Words from './Words';

export function Intro() {
  return (
    <section className="section intro" id="despacho" aria-labelledby="intro-label">
      <div className="container grid">
        <h2 className="label intro__label" id="intro-label">{intro.label}</h2>
        <div className="intro__text">
          {intro.paragraphs.map((p) => (
            <p key={p} aria-label={p} data-fill><Words text={p} /></p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section className="section section--paper services" id="servicios" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <p className="label">{services.label}</p>
            <h2 className="section-title" id="services-title" aria-label={services.title}><Words text={services.title} /></h2>
          </div>
          <a className="text-link" href={services.link.href}>{services.link.label}</a>
        </div>
        <ul className="services__list" data-reveal>
          {services.items.map((item) => (
            <li className="service-row grid" key={item.title}>
              <Picture tilt className="service-row__image" image={item.image} sizes="(max-width: 767px) 100vw, 25vw" />
              <div className="service-row__body">
                <h3 className="service-row__title">{item.title}</h3>
                <p className="body">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Approach() {
  return (
    <section className="section approach" aria-labelledby="approach-title">
      <div className="container grid">
        <div className="approach__text" data-reveal>
          <p className="label">{approach.label}</p>
          <h2 className="section-title" id="approach-title" aria-label={approach.title}><Words text={approach.title} /></h2>
          <ul className="rule-list">
            {approach.ideas.map((idea) => (
              <li key={idea.title}>
                <h3 className="rule-list__title">{idea.title}</h3>
                <p className="body">{idea.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <Picture tilt className="approach__image" image={approach.image} sizes="(max-width: 767px) 100vw, 58vw" />
      </div>
    </section>
  );
}

export function Method() {
  return (
    <section className="section section--paper method" id="metodo" aria-labelledby="method-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <p className="label">{method.label}</p>
            <h2 className="section-title" id="method-title" aria-label={method.title}><Words text={method.title} /></h2>
          </div>
        </div>
        <div className="grid method__grid">
          <Picture tilt className="method__image" image={method.image} sizes="(max-width: 767px) 100vw, 42vw" />
          <ol className="steps" data-reveal>
            {method.steps.map((step, i) => (
              <li className="steps__item" key={step.title}>
                <span className="steps__number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="steps__title">{step.title}</h3>
                  <p className="body">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Matters() {
  return (
    <section className="section matters" aria-labelledby="matters-title">
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <p className="label">{matters.label}</p>
            <h2 className="section-title" id="matters-title" aria-label={matters.title}><Words text={matters.title} /></h2>
          </div>
        </div>
        <Picture className="matters__image" image={matters.image} sizes="100vw" />
        <ul className="matters__list" data-reveal>
          {matters.categories.map((c) => (
            <li key={c.title}>
              <h3 className="rule-list__title">{c.title}</h3>
              <p className="body">{c.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
