const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(() => alert('Vielen Dank! Wir melden uns in Kürze.'))
      .catch(() => alert('Fehler beim Versenden. Bitte später erneut versuchen.'))
      .finally(() => contactForm.reset());
  });
}
