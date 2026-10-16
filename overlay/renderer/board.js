const titleEl = document.querySelector('#board-title');
const tierEl = document.querySelector('#board-tier');
const unitsMount = document.querySelector('#units-mount');

window.mokaBoard.onData((data) => {
  titleEl.textContent = data.title || '';
  tierEl.textContent = data.tier || '';
  unitsMount.innerHTML = data.unitsHtml || '';
});

document.querySelector('#back-main').addEventListener('click', () => {
  window.mokaBoard.backToMain();
});
document.querySelector('#close-board').addEventListener('click', () => {
  window.mokaBoard.backToMain();
});
