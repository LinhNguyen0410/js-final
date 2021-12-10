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

## bài 233 chỉ xài git
