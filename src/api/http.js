import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: "/api",
});

// // 添加请求拦截器
// instance.interceptors.request.use(
//   (config) => {
//     // 在请求中添加 Token
//     // const token = localStorage.getItem('token');
//     const token = "ahsudijkcxnzkl";
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // 请求错误时的处理
//     console.log(error);
//     return Promise.reject(error);
//   }
// );

async function boothDataGet() {
  try {
    const res = await instance.get("/get_booths");
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

async function passwordLogin(password) {
  try {
    const res = await instance.post(`/login?passwd=${password}`);
    if (res.status === 200) {
      Cookies.set("token", password);
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
  }
}

function boothDataPost(boothPost) {
  instance
    .post("/data", boothPost, { withCredentials: true })
    .then(function(response) {
      if (response.status == 200) {
        alert("修改成功！");
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

export { boothDataGet, boothDataPost, passwordLogin };
