const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const backgrounds = $$('.background');

const removeSelectedBackground = () => {
  const selectedBackground = $('.background.selected');

  selectedBackground && selectedBackground.classList.remove('selected');
};

backgrounds.forEach((background) => {
  background.addEventListener('click', () => {
    removeSelectedBackground();

    background.classList.add('selected');
  });
});

const modalBtns = $$('.btn-modal');

modalBtns.forEach((modalBtn) => {
  modalBtn.addEventListener('click', () => {
    removeSelectedBackground();
  });
});
