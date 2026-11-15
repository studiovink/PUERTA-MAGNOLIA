import { useState } from 'react';
import { faq } from '../content';
import Words from './Words';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section section--paper faq" aria-labelledby="faq-title">
      <div className="container grid">
        <div className="faq__head" data-reveal>
          <p className="label">{faq.label}</p>
          <h2 className="section-title" id="faq-title" aria-label={faq.title}><Words text={faq.title} /></h2>
        </div>
        <div className="faq__list" data-reveal>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div className="faq__item" key={item.q}>
                <h3 className="faq__question">
                  <button
                    type="button"
                    id={`faq-boton-${i}`}
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="faq__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className="faq__panel"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-boton-${i}`}
                  hidden={!expanded}
                >
                  <p className="body">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
