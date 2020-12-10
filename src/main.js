import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app');

//使用 WebSocket 的網址向 Server 開啟連結
let ws = new WebSocket('ws://localhost:3000')

//開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
ws.onopen = (ws) => {
    console.log(ws)
}

//關閉後執行的動作，指定一個 function 會在連結中斷後執行
ws.onclose = () => {
    console.log('close connection')
}