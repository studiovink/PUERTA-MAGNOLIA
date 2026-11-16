import { initMotion } from '../native/vink-motion.mjs';
import { initControls } from '../native/vink-controls.mjs';

const root = document.querySelector('#motion-root');
const select = document.querySelector('#profile');
const description = document.querySelector('#profile-description');
const descriptions = {
  inmobiliaria: 'Recorridos amplios y transiciones que dejan respirar la fotografía.',
  salud: 'Entradas serenas, desplazamientos breves y atención en la claridad.',
  gastronomia: 'Un ritmo cálido para descubrir textura, platos y ambiente.',
  tecnologia: 'Respuestas precisas y detalles que acompañan la exploración del producto.',
  deporte: 'Entradas más cortas y enérgicas, con pausas para leer y elegir.',
  estudio: 'Composición editorial y respuesta del cursor al servicio del proyecto.',
  editorial: 'Movimiento discreto para acompañar la lectura y la navegación.',
};
let motion;
let controls;
function init() {
  motion = initMotion(root, { profile: select.value });
  controls = initControls(root);
}
function replay() {
  motion?.destroy();
  motion = initMotion(root, { profile: select.value });
}
select.addEventListener('change', () => {
  root.dataset.vinkProfile = select.value;
  description.textContent = descriptions[select.value];
  replay();
});
document.querySelector('#replay').addEventListener('click', replay);
init();
// Expose only in this local demo for lifecycle checks; omit in a production page.
window.vinkDemo = {
  init,
  destroy() { motion?.destroy(); controls?.destroy(); },
};
