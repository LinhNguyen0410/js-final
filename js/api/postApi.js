import axiosClient from './axiosClient';

const postApi = {
  getAll(params) {
    // params is object value , params này là những thứ nằm sau dấu chấm hỏi trên url , và thằng AXIOS n auto covert sang dạng ?param =.... trên url nên việc của b khi gọi getAll thì chỉ cần truyền vào 1 object chứa các param này thôi

    const url = '/posts'; // base url api bên axiosClient đã khai báo rồi

    return axiosClient.get(url, { params: params });

    //  { params: params } : key là params và value là object params ở tham số đầu vào,key và value giống nhau nên mình có thể chỉ viết tắt 1 chữ params thôi cduoc
  },

  getByID(id) {
    const url = `/posts/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/posts';
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/posts/${data.id}`;
    return axiosClient.patch(url, data);
  },
  // using form data to upload image

  addFormData(data) {
    const url = '/with-thumbnail/posts';
    return axiosClient.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateFormData(data) {
    const url = `/with-thumbnail/posts/${data.get('id')}`;
    return axiosClient.patch(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  remove(id) {
    const url = `/posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
