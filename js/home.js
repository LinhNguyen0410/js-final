import postApi from './api/postApi';
import { setTextContent, textTruncate, getULPagination } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import debounce from 'lodash.debounce';

// extend relativeTime to use dayjs library
dayjs.extend(relativeTime);

function createPostElement(postItem) {
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

  return liElement;
}
// -------

function renderPostList(postList) {
  if (!Array.isArray(postList)) return;

  const ulElementWrapPost = document.getElementById('postsList');

  if (!ulElementWrapPost) return;

  // clear curren postList, taị vì ở cái hàm handleFilterChange mình có fetch laị API và re-render lại cái ul-list khi mà query params trên url thay đổi, do đó để tránh nó bị cộng dồn những cái hiện tại đang có thì mình cần set ulElement về rỗng trước khi re-render cái mới

  ulElementWrapPost.textContent = '';

  postList.forEach((post) => {
    const liPostElement = createPostElement(post);
    ulElementWrapPost.appendChild(liPostElement);
  });
}
// -------

function renderPagination(pagination) {
  const ulPanigation = getULPagination();
  if (!ulPanigation || !pagination) return;

  //calculate total page
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // set data for ulPagination element with value currentPage and total page
  ulPanigation.dataset.page = _page;
  ulPanigation.dataset.totalPages = totalPages;

  // disable btn :  when prev fist page and next last page

  // case 1 : if page <= 1 can't click prev
  if (_page <= 1) ulPanigation.firstElementChild?.classList.add('disabled');
  else ulPanigation.firstElementChild?.classList.remove('disabled');
  // case 2 : if page => totalPage can't click next
  if (_page >= totalPages) ulPanigation.lastElementChild?.classList.add('disabled');
  else ulPanigation.lastElementChild?.classList.remove('disabled');
}
// -------

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params up to url
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    // reset back page 1 when needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    // after you update params like above up to a URL, you need fetch API again to re-render the post list
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('failed', error);
  }
}
// ------- title_like = aut

function initSearchPost() {
  let inputElement = document.querySelector('.search-post');
  if (!inputElement) return;

  // get current query params
  const queryParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(queryParams.entries()); // get object contain all params
  const valueParams = params.title_like;
  inputElement.value = valueParams;

  // assign function debounce for variable
  const debounceSearch = debounce(
    (event) => handleFilterChange('title_like', event.target.value),
    500
  );
  inputElement.addEventListener('input', debounceSearch); //debounceSearch at here get one event
}

// -------
function handlePrevBtn(e) {
  e.preventDefault();
  const ulPagination = getULPagination();
  if (!ulPagination) return;

  const currentPage = Number(ulPagination.dataset.page) || 1;
  if (currentPage <= 1) return; // current page is first page => cannot prev
  const pagePrev = currentPage - 1;

  handleFilterChange('_page', pagePrev);
}

function handleNextBtn(e) {
  e.preventDefault();
  const ulPagination = getULPagination();
  if (!ulPagination) return;

  const totalPages = ulPagination.dataset.totalPages;
  const currentPage = Number(ulPagination.dataset.page) || 1;
  if (currentPage >= totalPages) return; // can not next

  const nextPage = currentPage + 1;

  handleFilterChange('_page', nextPage);
}

// -------

function initPagination() {
  /*
  - get ul element
  - get prev link - 'a' tag and attach event
  - get next link - 'a' tag and attach event
*/

  const ulPanigation = getULPagination();
  if (!ulPanigation) return;

  const prevBtn = ulPanigation.firstElementChild?.firstElementChild; // ul > li > a
  if (prevBtn)
    prevBtn.addEventListener('click', (event) => {
      handlePrevBtn(event);
    });

  const nextBtn = ulPanigation.lastElementChild?.lastElementChild; // ul > li > a
  if (nextBtn)
    nextBtn.addEventListener('click', (event) => {
      handleNextBtn(event);
    });
}

// -------

function initUrl() {
  const url = new URL(window.location);

  // initial params url -  you must set default query params
  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

  history.pushState({}, '', url);
}

(async () => {
  //attach event for pagination
  initPagination();

  initSearchPost();
  // initial params (_page, _limit )default for url
  initUrl();

  try {
    // get query params from url
    const queryParams = new URLSearchParams(window.location.search); // http://localhost:3000/?gender=nam
    // console.log(queryParams.toString()); gender=nam

    // respons return obj with 2 keys is data and panigation => using desctructuring
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
