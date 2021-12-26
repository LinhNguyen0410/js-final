import debounce from 'lodash.debounce';

// ------- title_like = aut
export function initSearchPost({ selectors, defaultParams, onChange }) {
  let inputElement = document.querySelector(selectors);
  if (!inputElement) return;

  // get current query params
  const valueParams = defaultParams.get('title_like');
  if (defaultParams && valueParams) {
    inputElement.value = valueParams;
  }
  if (!defaultParams) inputElement.value = '';

  // assign function debounce for variable
  const debounceSearch = debounce((event) => onChange?.(event.target.value), 500);
  inputElement.addEventListener('input', debounceSearch); //debounceSearch at here get one event
}
