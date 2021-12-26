import { setTextContent, textTruncate } from './common';
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
  const timeHandlePost = dayjs(postItem.updateAt).fromNow();
  setTextContent(liElement, '[data-id = "timeSpan"]', `- ${timeHandlePost}`);
  //https://day.js.org/docs/en/installation/node-js

  const thumbnailElement = liElement.querySelector('[data-id = "thumbnail"]');
  if (thumbnailElement) {
    thumbnailElement.src = postItem.imageUrl;
    // if url of image when load appear error , change image to default ( placeholder image )
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text= Image load failed';
    });
  }

  // - go to post detail

  //.. get div element inside LI post -> first element of LI post
  const divPostItem = liElement.firstElementChild;
  //.. attach click event for div element and redirect go to post detail : window.location.assign(`url + id post`)
  if (!divPostItem) return;
  divPostItem.addEventListener('click', () => {
    window.location.assign(`/post-details.html?id=${postItem.id}`);
  });

  return liElement;
}
// -------

export function renderPostList(elementID, postList) {
  if (!Array.isArray(postList)) return;

  const ulElementWrapPost = document.getElementById(elementID);

  if (!ulElementWrapPost) return;

  // clear curren postList, taị vì ở cái hàm handleFilterChange mình có fetch laị API và re-render lại cái ul-list khi mà query params trên url thay đổi, do đó để tránh nó bị cộng dồn những cái hiện tại đang có thì mình cần set ulElement về rỗng trước khi re-render cái mới

  ulElementWrapPost.textContent = '';

  postList.forEach((post) => {
    const liPostElement = createPostElement(post);
    ulElementWrapPost.appendChild(liPostElement);
  });
}
