/** Motion tokens only: colors, typography and brand remain owned by the site. */
export const PROFILES = Object.freeze({
  inmobiliaria: Object.freeze({ duration: 720, stagger: 85, distance: 22, parallax: 24, tilt: 2.5 }),
  salud: Object.freeze({ duration: 650, stagger: 75, distance: 12, parallax: 10, tilt: 1.5 }),
  gastronomia: Object.freeze({ duration: 600, stagger: 80, distance: 18, parallax: 20, tilt: 3 }),
  tecnologia: Object.freeze({ duration: 520, stagger: 60, distance: 16, parallax: 22, tilt: 4 }),
  deporte: Object.freeze({ duration: 400, stagger: 50, distance: 26, parallax: 18, tilt: 3 }),
  estudio: Object.freeze({ duration: 560, stagger: 65, distance: 20, parallax: 26, tilt: 4 }),
  editorial: Object.freeze({ duration: 500, stagger: 55, distance: 12, parallax: 10, tilt: 1.5 }),
});

export function getProfile(name = 'editorial') {
  return Object.hasOwn(PROFILES, name) ? PROFILES[name] : PROFILES.editorial;
}
