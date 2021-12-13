import postApi from './api/postApi';
import { setTextContent } from './utils';

function createPostElement(postItem) {
  if (!postItem) return;
  try {
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

    setTextContent(liElement, '[data-id = "desc"]', postItem.description);

    setTextContent(liElement, '[data-id = "author"]', postItem.author);

    const thumbnailElement = liElement.querySelector('[data-id = "thumbnail"]');
    if (thumbnailElement) thumbnailElement.src = postItem.imageUrl;

    return liElement;
  } catch (error) {
    console.log('render failed', error);
  }
}

// -------

function renderPostItem(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const ulElementWrapPost = document.getElementById('postsList');

  if (!ulElementWrapPost) return;
  postList.forEach((post) => {
    const liPostElement = createPostElement(post);
    ulElementWrapPost.appendChild(liPostElement);
  });
}

// -------

(async () => {
  //call api get data
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    };
    // respons return obj with 2 keys is data and panigation => using desctructuring
    const { data, panigation } = await postApi.getAll(queryParams);
    renderPostItem(data);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
