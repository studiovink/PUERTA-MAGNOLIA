import { Fragment } from 'react';

/** Parte un texto en palabras animables. El texto completo queda en aria-label del contenedor. */
export default function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true" style={{ ['--i' as string]: i }}>
            <span className="w__i">{word}</span>
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}
