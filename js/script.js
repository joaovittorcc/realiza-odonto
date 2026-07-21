// Mobile menu toggle
const menuButton = document.getElementById('mobile-menu-button');
const menuIcon = document.getElementById('mobile-menu-icon');
const mobileMenu = document.getElementById('mobile-menu');

menuButton.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuIcon.textContent = isOpen ? 'close' : 'menu';
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuIcon.textContent = 'menu';
  });
});

// Multi-step scheduling form
const steps = [document.getElementById('step-1'), document.getElementById('step-2'), document.getElementById('step-3')];
const progressBar = document.getElementById('form-progress');
const progressLabels = [
  document.getElementById('progress-label-1'),
  document.getElementById('progress-label-2'),
  document.getElementById('progress-label-3'),
];

function goToStep(step) {
  steps.forEach((s, index) => {
    if (index + 1 === step) {
      s.style.transform = 'translateX(0%)';
      s.style.opacity = '1';
      s.style.pointerEvents = 'auto';
    } else if (index + 1 < step) {
      s.style.transform = 'translateX(-100%)';
      s.style.opacity = '0';
      s.style.pointerEvents = 'none';
    } else {
      s.style.transform = 'translateX(100%)';
      s.style.opacity = '0';
      s.style.pointerEvents = 'none';
    }
  });

  progressBar.style.width = `${(step / 3) * 100}%`;
  progressLabels.forEach((label, index) => {
    label.classList.toggle('text-secondary', index + 1 <= step);
    label.classList.toggle('text-on-surface-variant', index + 1 > step);
  });
}

const formFeedback = document.getElementById('form-feedback');

function showFeedback(message) {
  formFeedback.textContent = message;
  formFeedback.classList.remove('hidden');
}

function hideFeedback() {
  formFeedback.classList.add('hidden');
}

document.getElementById('step1-next-btn').addEventListener('click', () => {
  const nome = document.getElementById('input-nome').value.trim();
  const whatsapp = document.getElementById('input-whatsapp').value.trim();

  if (!nome || !whatsapp) {
    showFeedback('Preencha nome e WhatsApp antes de continuar.');
    return;
  }

  hideFeedback();
  goToStep(2);
});

document.querySelectorAll('[data-next]').forEach((button) => {
  if (button.id === 'step1-next-btn') return;
  button.addEventListener('click', () => goToStep(Number(button.dataset.next)));
});

// Period selection (step 3)
let selectedPeriod = '';
document.querySelectorAll('.period-option').forEach((option) => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.period-option').forEach((o) => o.classList.remove('is-selected'));
    option.classList.add('is-selected');
    selectedPeriod = option.dataset.period;
  });
});

// Micro-interactions for text inputs
document.querySelectorAll('#step-1 input').forEach((input) => {
  input.addEventListener('focus', () => {
    input.parentElement.querySelector('label').classList.add('text-secondary');
  });
  input.addEventListener('blur', () => {
    if (!input.value) {
      input.parentElement.querySelector('label').classList.remove('text-secondary');
    }
  });
});

// Horizontal scroll buttons for procedures
const proceduresContainer = document.getElementById('procedures-container');
document.getElementById('scroll-next').addEventListener('click', () => {
  proceduresContainer.scrollBy({ left: 400, behavior: 'smooth' });
});
document.getElementById('scroll-prev').addEventListener('click', () => {
  proceduresContainer.scrollBy({ left: -400, behavior: 'smooth' });
});

// Submit: build WhatsApp message with the collected data (no backend on this static site)
document.getElementById('scheduling-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const nome = document.getElementById('input-nome').value.trim();
  const whatsapp = document.getElementById('input-whatsapp').value.trim();
  const procedimentoInput = document.querySelector('input[name="proc"]:checked');
  const procedimento = procedimentoInput ? procedimentoInput.value : 'não informado';
  const periodo = selectedPeriod || 'não informado';

  if (!nome || !whatsapp) {
    showFeedback('Preencha nome e WhatsApp antes de finalizar.');
    goToStep(1);
    return;
  }

  const mensagem =
    `Olá! Gostaria de agendar uma avaliação na Realize Centro Clínico.\n` +
    `Nome: ${nome}\n` +
    `WhatsApp: ${whatsapp}\n` +
    `Procedimento: ${procedimento}\n` +
    `Período preferido: ${periodo}`;

  const link = `https://wa.me/5562998172097?text=${encodeURIComponent(mensagem)}`;
  window.open(link, '_blank', 'noopener');

  showFeedback('Abrindo o WhatsApp para confirmar seu agendamento...');
});
