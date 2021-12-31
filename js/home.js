import postApi from './api/postApi';
import { renderPostList, renderPagination, initPagination, initSearchPost, toast } from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    // update query params up to url
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);

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

function registerPostDeleteEvent() {
  const myModal = document.querySelector('#myModal');
  const agreeButton = myModal.querySelector('#agree-delete');
  document.addEventListener('post-delete', (event) => {
    try {
      agreeButton.addEventListener('click', async () => {
        const dataPost = event.detail;
        await postApi.remove(dataPost.id);
        await handleFilterChange();
        toast.success('Post deleted...');
      });
    } catch (error) {
      console.log('failed when remove post...');
      toast.error('Can not delete post.Please try again.');
    }
  });
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
    registerPostDeleteEvent();

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
    /*
     const { data, pagination } = await postApi.getAll(queryParams);
     renderPostList('postList', data);
     renderPagination('pagination', pagination);
    */
    handleFilterChange();
    // trong ham nay co goi doan code tren roi , neu co truyen filterName vao thi no se set lai url , ko truyen thi no goi api render
  } catch (error) {
    console.log('get all failed', error);
  }
})();
