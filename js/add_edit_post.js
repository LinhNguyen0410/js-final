import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

// remove data unsused before sent to data
function removeUnusedFields(formValues) {
  //.. payload is data will send to server
  const payload = { ...formValues };

  //..  imageSource is (picsum ) -> remove image
  //..  imageSource is (upload ) -> remove imageUrl
  //..  finally remove imageSource
  const checkUnsused =
    payload.imageSource === 'picsum' ? delete payload.image : delete payload.imageUrl;

  delete payload.imageSource;

  // remove ID if it's add mode
  if (!payload.id) delete payload.id; // ID in payload = undefined => remove it -- from that can create new ID for it and redirect page details

  return payload;
}

// convert to form-data to upload image
function jsonToFormData(jsonObject) {
  const formData = new FormData();
  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }
  return formData;
}

async function handlePostFormSubmit(formValues) {
  // check add or edit mode ( based on id params on url / based on formValue has contain id or no
  const payload = removeUnusedFields(formValues);
  const formData = jsonToFormData(payload);

  try {
    //.. edit mode => value receive must be contain ID post
    /*
    const savePost = formValues.id //.. this is ID post
      ? await postApi.update(formValues)
      : await postApi.add(formValues); 
      //.. add sẽ nhận dc ID mới và redirect tới ID mới đó
    */
    // call api with image upload
    const savePost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    //.. show success msg
    toast.success('Save post succesfully...');

    //.. wait show msg and redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-details.html?id=${savePost.id}`);
    }, 600);
  } catch (error) {
    console.log('failed save post', error);
    toast.error('Save post failed . Please try again !');
  }
}

//.. MAIN
(async () => {
  try {
    //.. get post id from url params
    const searchParams = new URLSearchParams(window.location.search);
    const postID = searchParams.get('id');

    //..call API
    //.. has postId => That is edit page - fetch API ,  has not postID => that is add page - assign defaul value empty

    const defaultValues = postID
      ? await postApi.getByID(postID)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('api failed', error);
  }
})();
