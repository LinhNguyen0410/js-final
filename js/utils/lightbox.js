//..handle click for all imgs
//..img click -> find img same
//..determined index of img
//..show modal
//..handle click next - prev

function showModal(modalElement) {
  //.. using bootstrap
  if (!window.bootstrap) return;

  const modal = new bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightBox({ modalID, imageSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalID);
  if (!modalElement) return;

  const imageElement = modalElement.querySelector(imageSelector);
  const prevBtn = modalElement.querySelector(prevSelector);
  const nextBtn = modalElement.querySelector(nextSelector);
  if (!imageElement || !prevBtn || !nextBtn) return;

  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src;
  }

  document.addEventListener('click', (event) => {
    // you must determine element click sure be IMG Tag
    const { target } = event;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    // get img has dataset is data-album
    imgList = document.querySelectorAll(`img[data-album = "${target.dataset.album}"]`);

    // convert imgList to array => get index with  condition : x = current element => return itself index
    currentIndex = [...imgList].findIndex((x) => x === target);

    // show image for index above
    showImageAtIndex(currentIndex);
    // when click IMG TAG as above show modal album
    showModal(modalElement);
  });

  prevBtn.addEventListener('click', () => {});

  nextBtn.addEventListener('click', () => {});
}
