import { showModal } from './common';
//..handle click for all imgs
//..img click -> find img same
//..determined index of img
//..show modal
//..handle click next - prev

export function registerLightBox({ modalID, imageSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalID);
  if (!modalElement) return;

  const imageElement = modalElement.querySelector(imageSelector);
  const prevBtn = modalElement.querySelector(prevSelector);
  const nextBtn = modalElement.querySelector(nextSelector);
  if (!imageElement || !prevBtn || !nextBtn) return;

  // check modal registered or not
  if (modalElement.dataset.registered) return;

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

  prevBtn.addEventListener('click', () => {
    // get currentIndex and ImgList
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    /*
      giả sử currenIndex đang là 1 , nút prev thì mình sẽ giảm đi 1 tức là currenIndex - 1 bằng 0 sau đó mình đi chia dư cho độ dài mảng chứa hình 0 % 3 , vì khi mình chia dư thì chắc chắn kết quả có được điều sẽ nhỏ hơn hoặc bằng độ dài của mảng đó (0 % 3 = 0) => với nút prev thì mình sẽ + thêm độ dài của mảng để trang trường hợp nó về số âm.
     */

    showImageAtIndex(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;

    showImageAtIndex(currentIndex);
  });
  // ngăn chặn việc gọi hàm register lightbox quá nhiều lần
  modalElement.dataset.registered = 'true';
}
