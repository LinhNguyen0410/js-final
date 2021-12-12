import axios from 'axios'; //libary

// initialization a new instance , not using default instance is 'axios'
const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// assign *interceptors* for these resquest and response ,these resquest and response mush required pass this interceptors.

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // you can attach token to resquest by token save in localStorage
    const accessToken = localStorage.getItem('token');
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },

  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // mình chỉ cần lấy 1 thằng 'data' để handled dữ liệu thôi chứ k cần return nguyên cái response về.
    // response thì ngoài data nó còn có config, headers , resquest ,.v...v
    return response.data;
  },
  function (error) {
    // Do something with response error
    console.log('response error', error.response);
    if (!error.response) throw new Error(' Network Error. Please try again later.');

    // redirect to home page when resquest has error with status 401
    // tất cả resquest bị lỗi 401 thì điều bị auto chuyển về trang login
    if (error.response.status === 401) {
      //.... handle do something ... clear token , logout and last is redirect
      window.location.assign('/login.html');
      return;
    }
    return Promise.reject(error);
    // or throw new Error ( '...')
  }
);

export default axiosClient;
