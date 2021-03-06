import { setTextContent, textTruncate, showModal } from './common';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// extend relativeTime to use dayjs library
dayjs.extend(relativeTime);

export function createPostElement(postItem) {
  if (!postItem) return;
  // find and clone template
  const templatePost = document.getElementById('postTemplate');
  if (!templatePost) return;

  // clone Li in template
  const liElement = templatePost.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // update info into Li , title , desc , author, thumbnail

  // const titleElement = liElement.querySelector('[data-id = "title"]');
  // if (titleElement) titleElement.textContent = postItem.title;

  setTextContent(liElement, '[data-id = "title"]', postItem.title);

  // set text and handle truncate
  setTextContent(liElement, '[data-id = "description"]', textTruncate(postItem.description, 100));

  setTextContent(liElement, '[data-id = "author"]', postItem.author);

  // calculating time  and set in span element - using dayjs library
  const timeHandlePost = dayjs(postItem.updatedAt).format('DD/MM/YYYY HH:mm');
  setTextContent(liElement, '[data-id = "timeSpan"]', `- ${timeHandlePost}`);
  //https://day.js.org/docs/en/installation/node-js

  const thumbnailElement = liElement.querySelector('[data-id = "thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = postItem.imageUrl;
    // if url of image when load appear error , change image to default ( placeholder image )
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src =
        'https://media.tadicdn.com/media/image/id/6008d95f3f2038db398b45ce.png';
    });
  }

  // - go to post detail

  //.. get div element inside LI post -> first element of LI post
  const divPostItem = liElement.firstElementChild;

  //.. attach click event for div element and redirect go to post detail : window.location.assign(`url + id post`)
  if (!divPostItem) return;
  divPostItem.addEventListener('click', (event) => {
    // will ignore when clicked into menu contain edit button
    // t???c l?? n???u m??nh click b???t c??? c??i g?? trong c??i ph???n menu tr??n card th?? ?????u b??? qua, k redirect sang detail.
    // way 2
    const menu = liElement.querySelector('[data-id="menu"]');
    if (menu && menu.contains(event.target)) return;

    window.location.assign(`/post-details.html?id=${postItem.id}`);
  });

  //... attact even for edit button in card item
  const editButton = liElement.querySelector('[data-id= "edit"]');
  if (editButton) {
    editButton.addEventListener('click', (event) => {
      // button ??ang b??? ???nh h?????ng b???i bubbling n??n click n?? v???n s??? redirect sang trang post-detail
      // - how to prevent ?
      // way 1 : event.stopPropagation();
      // way 2 : see above..
      window.location.assign(`/add-edit-post.html?id=${postItem.id}`);
    });
  }

  //... attact even for remove button and modal in card item
  const myModal = document.getElementById('myModal');
  const modal = new bootstrap.Modal(myModal);
  if (!myModal || !modal) return;
  const removeButton = liElement.querySelector('[data-id= "remove"]');
  if (removeButton) {
    removeButton.addEventListener('click', (event) => {
      // show modal
      modal.show();
      // create custom event and listen in parent file (home)
      const customEvent = new CustomEvent('post-delete', {
        bubbles: true, // allow bubbles to document
        detail: postItem, // data is postItem => will bubbles it to home.js
      });
      removeButton.dispatchEvent(customEvent);
    });

    // ...hide modal
    ['cancel-icon', 'close-delete', 'agree-delete'].forEach((elementID) => {
      const element = document.getElementById(elementID);
      element.addEventListener('click', () => {
        modal.hide();
      });
    });
  }
  return liElement;
}
// -------

export function renderPostList(elementID, postList) {
  if (!Array.isArray(postList)) return;

  const ulElementWrapPost = document.getElementById(elementID);

  if (!ulElementWrapPost) return;

  // clear curren postList, ta??? v?? ??? c??i h??m handleFilterChange m??nh c?? fetch la??? API v?? re-render l???i c??i ul-list khi m?? query params tr??n url thay ?????i, do ???? ????? tr??nh n?? b??? c???ng d???n nh???ng c??i hi???n t???i ??ang c?? th?? m??nh c???n set ulElement v??? r???ng tr?????c khi re-render c??i m???i

  ulElementWrapPost.textContent = '';

  postList.forEach((post) => {
    const liPostElement = createPostElement(post);
    ulElementWrapPost.appendChild(liPostElement);
  });
}
