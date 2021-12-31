import { setFieldValue, setBackgroundImage, setTextContent, randomIDImage } from './common';
import * as yup from 'yup';
// add event submit for form
// prevent defaul form behavior default
// set default values for form
// get and save form current values
// validation
// if valid => trigger submit <> show error
// prevent submission consecutive => disable button save or using flat true / false submitting

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}; // 281

function setFormValues(formElement, formValues) {
  setFieldValue(formElement, '[name="title"]', formValues?.title);
  setFieldValue(formElement, '[name="author"]', formValues?.author);
  setFieldValue(formElement, '[name="description"]', formValues?.description);

  //.. set value for input hidden to save it.
  setFieldValue(formElement, '[name="imageUrl"]', formValues?.imageUrl);

  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  let value = {};
  /* 
  //.. s1 : loop all name attr of input inside form element => get and query it => get value
  let inputName = ['title', 'author', 'description', 'imageUrl', 'image'];
  inputName.forEach((name) => {
    const inputField = form.querySelector(`[name= "${name}"]`);
    if (inputField) value[name] = inputField.value; // value[name] === object[key] === value[key]
  }); */

  // --- s2 : using form data
  const dataForm = new FormData(form);
  for (const field of form) {
    const nameInput = field.name;
    value[nameInput] = dataForm.get(`${nameInput}`);
  }

  return value;
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name = ${name}]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter post title.'),

    author: yup
      .string()
      .required('Please enter post author.')
      .test(
        'at-least-two-words',
        'Please enter at least two word for author name.',
        (data) => data.split(' ').filter((x) => !!x).length >= 2
        // CONDITION : data (author value) must have at least two or more words
      ),

    description: yup.string().required('Please enter description for new post.'),

    imageSource: yup
      .string()
      .required('Please select an image source.')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source.'),

    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please random a background image.')
        .url('Please enter a valid URL'),
    }),

    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test(
          'required',
          'Please select an image from your computer to upload.',
          (file) => Boolean(file?.name) // must return true === if(!file?.name)
        )
        .test('max-size-3mb', 'The image upload too large ( Max 3mb ).', (file) => {
          const fileSize = file?.size || 0;
          const MAX_SIZE = 3; // megabyte
          const calculateImageSize = (fileSize / 1024 / 1024).toFixed(1); // convert byte to megabyte
          return calculateImageSize <= MAX_SIZE;
        }),
    }),
  });
}

function showLoadingBtn(form) {
  if (!form) return;
  const btnSavePost = form.querySelector('[name = "submit"]');
  if (btnSavePost) {
    btnSavePost.disabled = true;
    btnSavePost.textContent = 'Saving...';
  }
}

function hideLoadingBtn(form) {
  if (!form) return;
  const btnSavePost = form.querySelector('[name = "submit"]');
  if (btnSavePost) {
    btnSavePost.disabled = false;
    btnSavePost.textContent = 'Save';
  }
}

function initRandomImage(form) {
  if (!form) return;
  const buttonChangeImage = form.querySelector('#postChangeImage');
  if (!buttonChangeImage) return;

  // .. attach event
  buttonChangeImage.addEventListener('click', () => {
    // .. random new ID => in common.js
    // .. build new image URLs with new ID above
    const newImageUrl = `https://picsum.photos/id/${randomIDImage(1000)}/1368/400`;

    // .. assign new image for input image hidden and background section
    setFieldValue(form, '[name="imageUrl"]', newImageUrl);

    setBackgroundImage(document, '#postHeroImage', newImageUrl);
  });
}

function renderControlByRadio(form, selectedValue) {
  // .. selectedValue is value of input radio
  const controlChange = form.querySelectorAll('[data-id = "control-change" ]');
  if (!controlChange) return;

  controlChange.forEach((control) => {
    const dataSourceControl = control.dataset.source;
    control.hidden = dataSourceControl !== selectedValue;
  });
}

function toggleControlImage(form) {
  /*
  const radioRandom = form.querySelector('#imageRandomPicsum');
  const radioUpload = form.querySelector('#imageSourceUpload');
  const randomControl = form.querySelector('.random-control');
  const uploadControl = form.querySelector('.upload-control');
  if (!radioRandom || !radioUpload || !randomControl || !uploadControl) return;
  // random
  radioRandom.addEventListener('change', () => {
    uploadControl.classList.add('d-none');
    randomControl.classList.remove('d-none');
  });
  // upload defaul will hidden
  radioUpload.addEventListener('change', () => {
    uploadControl.classList.remove('d-none');
    randomControl.classList.add('d-none');
  });
  */
  const radioList = form.querySelectorAll('[name = "imageSource"]');
  if (!radioList) return;

  radioList.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      renderControlByRadio(form, e.target.value);
    });
  });
}

// .. validation for only one field
async function validateFieldForm(form, formValues, nameField) {
  try {
    //..clear previous error
    setFieldError(form, nameField, '');

    //.. start validating
    const schema = getPostSchema();
    await schema.validateAt(nameField, formValues);
  } catch (error) {
    setFieldError(form, nameField, error.message);
  }

  const field = form.querySelector(`[name = "${nameField}"]`);
  if (field && !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function initUrlImage(fileData) {
  if (!fileData) return;
  const urlImageUploaded = URL.createObjectURL(fileData);

  if (urlImageUploaded) {
    // setFieldValue(formElement, '[name="imageUrl"]', formValues?.imageUrl);
    setBackgroundImage(document, '#postHeroImage', urlImageUploaded);
  }
}

function handlePreviewImage(form) {
  const inputUpload = form.querySelector('.form-control-file');
  if (!inputUpload) return;

  inputUpload.addEventListener('change', (e) => {
    // trigger validation - when appear file image show on input file

    const dataUpload = e.target.files[0];
    initUrlImage(dataUpload);
    validateFieldForm(form, {}, 'image');
  });
}

function initValidationOnChange(form) {
  // loop by all input with name
  // query it
  // attact event input
  // get new value of it
  // call func validate one field => formValues is obj contain name : 'new value'
  const nameList = ['title', 'author', 'description'];
  nameList.forEach((name) => {
    const field = form.querySelector(`[name = "${name}"]`);
    if (field) {
      field.addEventListener('input', (e) => {
        const newValues = e.target.value;
        validateFieldForm(form, { [name]: newValues }, name);
      });
    }
  });
}

async function validatePostForm(form, formValues) {
  try {
    // - init field reset needed
    //.. reset previous error to empty
    const field = ['title', 'author', 'imageUrl', 'image'];
    field.forEach((name) => setFieldError(form, name, ''));

    //.. start validating

    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    // console.log('Validation error :', error.name);
    // console.log('List info error :', error.inner);

    const errorLog = {};
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path; // get name input

        //..ignore logged if message error already (errorLog[name] = true)
        if (errorLog[name]) continue; //...272 lesson,11m11s

        setFieldError(form, name, validationError.message);
        //.. mark this error logged...
        errorLog[name] = true;
      }
    }
  }

  // add was-validate class
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;
  setFormValues(form, defaultValues); // set default on form

  // init event
  initRandomImage(form);
  toggleControlImage(form); // 279 lesson
  handlePreviewImage(form);
  initValidationOnChange(form); // when blur show validation

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitting) return;

    // start submit
    showLoadingBtn(form); // saving...
    submitting = true;

    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;
    // assign ID for formValue to check when update form - if has ID -> edit mode / not ID will be add mode

    // .. async func-> using await when call => wait validate func done then trigger onSubmit
    //.. if dont using await => function will return a promise => promise is truthy
    const isValid = await validatePostForm(form, formValues);

    //..after validation satisfy the condition => trigger submit
    if (isValid) await onSubmit?.(formValues);

    hideLoadingBtn(form); // save
    submitting = false;
  });
}
