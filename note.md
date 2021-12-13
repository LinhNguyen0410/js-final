    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"

dev : dùng dưới local , mỗi lần thay đổi mình gọi dev thì n rebuild lại => như live serve
build : build production mode => sinh ra folder _dist_
serve : review kết quả build đươc từ folder _dist_

# bài 228 - structure folder

> sử dụng vite để khi mình goi lệnh build thì n sẽ auto sinh ra các file đã optimize code lại cho n ngắn gọn, nâng cao perfomance cho app.

# minify

> optimize code lại để n chỉ nằm trên 1 dòng,bỏ qua spacing

# uglify

> biến những tên biến thành 1 kí tự abcdef gì đó

# muon lam nhieu trang hay them file config vite

> tim hieu Config multi-page for ViteJS

## public folder

> ngoài các file nằm ngoài global đc hiểu, thì các file nằm trong thư mục public cũng sẽ dc thằng build nó hiểu và xách n bỏ vào dist

## CDN

> content delivery network

## bài 232, 233 chỉ xài git

## bài 235 ,236 chi làm api vs axios

---

### muốn config lại cái baseURL trong axiosClient trong trường hợp m muốn dùng API khác với API mặc định thì m có thể config lại trong tham số config, n sẽ overwrite lại cái baseURL ban đầu

> return axiosClient.get(url, { params: params, baseURL : 'https//apinew.com' });

### tương tự khi mình muốn config lại header thì mình cũng truyền header vào tham số config, và phải truyền dưới dạng object

## { headers : {..formdata gì đó cần overwrite..} }

---

## Interceptor

> Interceptor có thể hiểu như một bước tường lưới chặn các request, response của ứng dụng để cho phép kiểm tra, thêm vào header hoặc thay đổi các param của request, response. Nó cho phép chúng ta kiểm tra các token ứng dụng, Content-Type hoặc tự thêm các header vào request. Điều này cho phép chúng ta tận dụng tối đa thao tác chỉnh sửa header, body, param request gửi lên server sao cho hợp lý nhất, bảo mật nhất.

## chỗ nào gọi api thì điều phải dùng try catch để xử lý error cho từng resquest riêng biệt , còn lỗi nào mà phổ biến quá thì dùng hàm ném lỗi error trong function _interceptors_

## handle error trong interceptors 239

_thứ tự n như sau : main.js <- postApi.js <- axiosClient_

> thằng cha đi xuống thằng con , thằng con có lỗi thì nó throw error lên cho thằng cha , thằng cha mà nó dùng try catch catch lại thì n dừng ở đó , còn thằng cha mà tiếp tục throw error nữa thì n tiếp tục bay lên thằng ông nội , thằng ông nội catch thì duwfg, còn ong nọi throw tiếp thì lại đi tiếp lên ông cố cứ như v .....

## TREE SHAKING

### Import and Export

> cả import và export đều có 2 dạng đó là _named_ và _default_

- NAME : là mình **export function abc** riêng từng hàm các kiểu , rồi mình import thì **import {} from 'abc.js'**
  => tương tự như 2 cái game

- DEFAULT : là tương tự như cái postApi , mình truyền các cái hàm mình cần export vào 1 cái object bao hết, sau đó mình export default cái tên object đó ra. Import thì k cần dùng dấu ngoặc {} nữa.

### Kĩ thuật Tree shaking - remove những đoạn code ko sử dụng

> nếu bạn dùng export defaul thì cái nơi mà nó nhận end code , nơi mà nó import cái code đó vào sẽ ngầm nhận luôn tất cả đống code mà bạn đã viết trong file export default mặc dù bạn ko có sử dụng hết nó

> đối với _name export_ - export từng hàm n sẽ giúp mình trong việc tree shaking - loại bỏ những đoạn code ko sử dụng.
> Mình lấy , import hàm nào , n sẽ đưa hàm đó cho mình dùng mà thôi
