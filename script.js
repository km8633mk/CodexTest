const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    alert('Vielen Dank! Wir melden uns in Kürze.');
    contactForm.reset();
  });
}
