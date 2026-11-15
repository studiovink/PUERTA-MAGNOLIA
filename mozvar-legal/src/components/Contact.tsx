import { useRef, useState, type FormEvent } from 'react';
import { contactSection, site } from '../content';
import Picture from './Picture';

type Field = 'nombre' | 'correo' | 'telefono' | 'area' | 'mensaje';
type Status = 'idle' | 'sending' | 'success' | 'error' | 'unconfigured';

const empty: Record<Field, string> = { nombre: '', correo: '', telefono: '', area: '', mensaje: '' };

function validate(values: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.nombre.trim()) errors.nombre = 'Escribe tu nombre.';
  if (!values.correo.trim()) errors.correo = 'Escribe tu correo.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo.trim())) errors.correo = 'Revisa el correo: parece incompleto.';
  if (values.telefono.trim() && values.telefono.replace(/\D/g, '').length < 10) errors.telefono = 'Si incluyes teléfono, usa al menos 10 dígitos.';
  if (!values.area) errors.area = 'Elige un área de interés.';
  if (!values.mensaje.trim()) errors.mensaje = 'Cuéntanos brevemente qué necesitas.';
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const { contact } = site;

  const set = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      setStatus('idle');
      formRef.current?.querySelector<HTMLElement>(`#campo-${firstInvalid}`)?.focus();
      return;
    }
    // Sin servicio configurado no se simula un envío.
    if (!site.formEndpoint) {
      setStatus('unconfigured');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      setValues(empty);
    } catch {
      setStatus('error');
    }
  };

  const fieldProps = (field: Field) => ({
    id: `campo-${field}`,
    name: field,
    value: values[field],
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `error-${field}` : undefined,
  });
  const error = (field: Field) =>
    errors[field] ? <p className="field__error" id={`error-${field}`}>{errors[field]}</p> : null;

  const details = [
    contact.email && { label: 'Correo', value: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { label: 'Teléfono', value: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}` },
    contact.whatsapp && { label: 'WhatsApp', value: contact.whatsapp, href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` },
    contact.address && { label: 'Dirección', value: contact.address },
    contact.hours && { label: 'Horario', value: contact.hours },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <section className="section contact" id="contacto" aria-labelledby="contact-title">
      <div className="container grid">
        <div className="contact__intro" data-reveal>
          <p className="label">{contactSection.label}</p>
          <h2 className="section-title" id="contact-title">{contactSection.title}</h2>
          <p className="body contact__support">{contactSection.support}</p>
          {details.length > 0 && (
            <dl className="contact__details">
              {details.map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.href ? <a href={d.href}>{d.value}</a> : d.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <Picture className="contact__image" image={contactSection.image} sizes="(max-width: 767px) 100vw, 40vw" />
        </div>

        <form className="form" ref={formRef} onSubmit={onSubmit} noValidate data-reveal>
          <div className="field">
            <label htmlFor="campo-nombre">Nombre</label>
            <input type="text" autoComplete="name" required {...fieldProps('nombre')} onChange={(e) => set('nombre', e.target.value)} />
            {error('nombre')}
          </div>
          <div className="field">
            <label htmlFor="campo-correo">Correo</label>
            <input type="email" autoComplete="email" required {...fieldProps('correo')} onChange={(e) => set('correo', e.target.value)} />
            {error('correo')}
          </div>
          <div className="field">
            <label htmlFor="campo-telefono">Teléfono <span className="field__optional">(opcional)</span></label>
            <input type="tel" autoComplete="tel" inputMode="tel" {...fieldProps('telefono')} onChange={(e) => set('telefono', e.target.value)} />
            {error('telefono')}
          </div>
          <div className="field">
            <label htmlFor="campo-area">Área de interés</label>
            <select required {...fieldProps('area')} onChange={(e) => set('area', e.target.value)}>
              <option value="">Selecciona una opción</option>
              {contactSection.areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            {error('area')}
          </div>
          <div className="field field--wide">
            <label htmlFor="campo-mensaje">Mensaje</label>
            <textarea rows={4} required {...fieldProps('mensaje')} onChange={(e) => set('mensaje', e.target.value)} />
            {error('mensaje')}
          </div>

          <div className="form__footer field--wide">
            <button className="button" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando…' : contactSection.submitLabel}
            </button>
            {site.privacyUrl && (
              <a className="form__privacy" href={site.privacyUrl}>Aviso de privacidad</a>
            )}
          </div>

          <p className={`form__status form__status--${status} field--wide`} role="status" aria-live="polite">
            {status === 'success' && 'Recibimos tu mensaje. Te responderemos pronto.'}
            {status === 'error' && 'No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos.'}
            {status === 'unconfigured' && 'Tu mensaje no se envió: este formulario aún no está conectado a un servicio de envío.'}
          </p>
        </form>
      </div>
    </section>
  );
}
