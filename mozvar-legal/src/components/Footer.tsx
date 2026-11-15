import { footer, hero, nav, site } from '../content';

export default function Footer() {
  const { contact } = site;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top grid">
          <p className="site-footer__phrase">{hero.titleLines.join(' ')}</p>
          <nav className="site-footer__nav" aria-label="Pie de página">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="site-footer__contact">
            {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
            {contact.phone && <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>}
            {contact.address && <p>{contact.address}</p>}
            <a className="button button--light" href={hero.cta.href}>{hero.cta.label}</a>
          </div>
        </div>
        <img className="site-footer__wordmark" src="/brand/mozvar-blanco.svg" alt={site.name} width={439} height={102} loading="lazy" />
        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} {site.name} {site.descriptor}</p>
          <p>{footer.note}</p>
          {site.privacyUrl && <a href={site.privacyUrl}>Aviso de privacidad</a>}
        </div>
      </div>
    </footer>
  );
}
