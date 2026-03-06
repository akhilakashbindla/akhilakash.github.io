// js/security-cards.js - Expandable OWASP cards

document.addEventListener('DOMContentLoaded', () => {
  const cardHeaders = document.querySelectorAll('.card-header');

  cardHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.toggle-icon');

      if (content.style.display === 'block') {
        content.style.display = 'none';
        icon.textContent = '▼';
      } else {
        content.style.display = 'block';
        icon.textContent = '▲';
      }
    });
  });
});
