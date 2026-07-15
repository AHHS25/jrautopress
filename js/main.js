const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const backToTop = document.querySelector('.back-to-top');
const form = document.querySelector('#quote-form');
const statusMessage = document.querySelector('#form-status');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

document.querySelector('#year').textContent = new Date().getFullYear();

form.addEventListener('submit', event => {
  event.preventDefault();
  const requiredFields = [...form.querySelectorAll('[required]')];
  let isValid = true;

  requiredFields.forEach(field => {
    const empty = !field.value.trim();
    field.classList.toggle('invalid', empty);
    if (empty) isValid = false;
  });

  if (!isValid) {
    statusMessage.textContent = 'Completa los campos obligatorios para continuar.';
    statusMessage.className = 'form-status error';
    return;
  }

  const data = new FormData(form);
  const summary = [
    `Nombre: ${data.get('nombre')}`,
    `Teléfono: ${data.get('telefono')}`,
    `Vehículo: ${data.get('vehiculo') || 'No especificado'}`,
    `Refacción: ${data.get('refaccion')}`,
    `Mensaje: ${data.get('mensaje') || 'Sin mensaje adicional'}`
  ].join('\n');

  navigator.clipboard?.writeText(summary).catch(() => {});
  statusMessage.textContent = 'Solicitud preparada. Los datos se copiaron para que puedas enviarlos por WhatsApp o correo.';
  statusMessage.className = 'form-status success';
});
