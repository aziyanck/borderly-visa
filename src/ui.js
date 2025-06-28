function displayMessage(elementId, message, isError = false) {
  const messageElement = document.getElementById(elementId);
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.classList.remove('hidden', 'text-red-500', 'text-green-500');
    if (isError) {
      messageElement.classList.add('text-red-500');
    } else {
      messageElement.classList.add('text-green-500');
    }
    setTimeout(() => {
      if (messageElement) {
        messageElement.classList.add('hidden');
        messageElement.textContent = '';
      }
    }, 5000);
  }
}

function redirectTo(path) {
  window.location.href = path;
}

function handleMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = mobileMenu?.querySelectorAll('a');

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
    });
  }

  mobileMenuLinks?.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
    });
  });
}

export { displayMessage, redirectTo, handleMobileMenu };
