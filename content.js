const style = document.createElement('style');
style.textContent = `
  .a11y-contrast {
    background-color: black !important;
    color: yellow !important;
  }

  .a11y-contrast * {
    background-color: transparent !important;
    color: yellow !important;
  }
`;
document.head.appendChild(style);
