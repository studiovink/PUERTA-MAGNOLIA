/** Cinta de texto en movimiento continuo; su velocidad e inclinación responden al scroll. */
export default function Marquee({ items }: { items: string[] }) {
  const run = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((half) => (
          <div className="marquee__half" key={half}>
            {run.map((item, i) => (
              <span className="marquee__item" key={i}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
