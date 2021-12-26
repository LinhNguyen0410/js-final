export function renderPagination(elementID, pagination) {
  const ulPagination = document.getElementById(elementID);
  if (!ulPagination || !pagination) return;

  //calculate total page
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // set data for ulPagination element with value currentPage and total page
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // disable btn :  when prev fist page and next last page

  // case 1 : if page <= 1 can't click prev
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  // case 2 : if page => totalPage can't click next
  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

export function initPagination({ elementId, defaultParams, onChange }) {
  // - get ul element  - get prev link - 'a' tag and attach event  - get next link - 'a' tag and attach event

  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  // add event previous
  const prevBtn = ulPagination.firstElementChild?.firstElementChild; // ul > li > a
  if (prevBtn)
    prevBtn.addEventListener('click', (event) => {
      event.preventDefault();

      const currentPage = Number(ulPagination.dataset.page) || 1;
      if (currentPage >= 2) onChange?.(currentPage - 1);
    });

  // add event next
  const nextBtn = ulPagination.lastElementChild?.lastElementChild;
  if (nextBtn)
    nextBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const totalPages = ulPagination.dataset.totalPages;
      const currentPage = Number(ulPagination.dataset.page) || 1;
      if (currentPage < totalPages) onChange?.(currentPage + 1);
    });
}
