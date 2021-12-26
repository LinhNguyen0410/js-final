import postApi from './api/postApi';
import { renderPostList, renderPagination, initPagination, initSearchPost } from './utils';

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
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('failed', error);
  }
}

(async () => {
  try {
    const url = new URL(window.location);
    // initial params url -  you must set default query params
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    //attach event
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });
    initSearchPost({
      selectors: '.search-post',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    // respons return obj with 2 keys is data and pagination => using desctructuring
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postList', data);
    renderPagination('pagination', pagination);
  } catch (error) {
    console.log('get all failed', error);
  }
})();
