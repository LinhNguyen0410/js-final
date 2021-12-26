import postApi from './api/postApi';
import { setTextContent, registerLightBox } from './utils';
import dayjs from 'dayjs';

// render title, desc, author,updateAt, image, edit btn
function renderPostDetails(post) {
  if (!post) return;

  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format('- DD/MM/YYYY HH:mm')
  );

  const postHeroImage = document.getElementById('postHeroImage');
  if (postHeroImage) postHeroImage.style.backgroundImage = `url(${post.imageUrl})`;

  postHeroImage.addEventListener('error', () => {
    postHeroImage.style.backgroundImage = url(
      'https://via.placeholder.com/1368x400?text= Image load failed'
    );
  });

  const editBtn = document.getElementById('goToEditPageLink');
  if (!editBtn) return;
  editBtn.href = `/add-edit-post.html?id=${post.id}`;
  editBtn.innerHTML = '<i class="far fa-edit" style="color: red"></i> Edit Post';
}

(async () => {
  registerLightBox({
    modalID: 'lightbox',
    imageSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="previous"]',
    nextSelector: 'button[data-id="next"]',
  });
  //.. get post id from url params
  //.. call API fetch post detail API
  //.. render post detail
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postID = searchParams.get('id');
    if (!postID) {
      alert('Post not found !');
      return;
    }

    const post = await postApi.getByID(postID);
    renderPostDetails(post);
  } catch (error) {
    console.log('API Error', error);
  }
})();
