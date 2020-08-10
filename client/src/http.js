import axios from 'axios'
import { Message, Loading } from 'element-ui';
import router from './router'

let loading        //定義loading

function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加載中...', //顯示
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}

// 請求攔截  設置统一header
axios.interceptors.request.use(config => {
    // 加載
    startLoading()
    if (localStorage.eleToken)
        config.headers.Authorization = localStorage.eleToken
    return config
}, error => {
    return Promise.reject(error)
})

// 響應攔截  401 token過期處理
axios.interceptors.response.use(response => {
    //結束加載動畫
    endLoading()
    return response
}, error => {
    // 錯誤提醒
    endLoading()
    Message.error(error.response.data)

    // const { status } = error.response
    // if (status == 401) {
    //     Message.error('token值無效，请重新登錄 ')
    //     // 清除token
    //     localStorage.removeItem('eleToken')

    //     // 頁面跳轉
    //     router.push('/login')
    // }

    return Promise.reject(error)
})

export default axios