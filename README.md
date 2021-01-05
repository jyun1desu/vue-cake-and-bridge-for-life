# cake-and-bridge-for-life
### demo
https://jyun1desu.github.io/cake-and-bridge-for-life/#/

![demo圖](https://imgur.com/7dqT6pZ.jpg)
--
### 使用技術
- Vue CLI
- Vuex
- Vue Router
- Sass
- Firebase realtime data

---

### 實現功能
- 可以同時四人連線遊玩，適合在手機上遊玩
#### 首頁
* 輸入管理員密碼(jyunyi)可以重設Firebase Data
* 超過四人進入遊戲間時，需等候才能進入
#### 等待室
* 可以選擇隊伍
* 點擊開始遊戲後，會出現等待其他玩家開始的動畫
* 四位玩家皆點擊開始後、即會進入遊戲間
#### 遊戲間
* 手牌達到倒牌標準會出現倒牌提示
* 四個玩家的遊戲畫面不同
* 洗牌(Fisher–Yates shuffle)、發牌
* 喊王過程會跳過已經PASS的玩家
* 喊王結束後畫面上會有該局王牌、兩隊需吃到的墩數提示
* 每一輪出牌後比大小，下一輪第一個玩家為上局贏家
* 自己贏到的墩可以在左側橘色icon點開查看
* 自己或其他玩家出牌後，畫面上對應的牌組張數會減少
* 撲克牌花色在手機上不渲染成emoji
---
### 學習記錄
* 使用firebase達到資料即時更新效果
* vue router 生命週期
* Fisher-Yates Shuffle
---
### 待更新功能
* 重新牌局(再來一局)（目前要大家都出去再重新進入）
* 更換隊友
---
