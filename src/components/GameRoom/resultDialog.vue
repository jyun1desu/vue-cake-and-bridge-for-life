<template>
  <div class="result_page">
    <div
      :class="{
        strawberry: gameResult === '草莓糕',
        canele: gameResult === '可麗露',
      }"
      class="dialog"
    >
      <p class="title">贏家出來嚕</p>
      <p class="text">
        恭喜<span class="team_name">{{ gameResult }}</span
        >贏啦～
      </p>
      <div class="button_area">
        <button @click="changeMate" class="change_mate">更換隊友</button>
        <button @click="restartGame" class="play">再玩一局</button>
        <button @click="leaveGame" class="leave">翻桌不玩</button>
      </div>
    </div>
  </div>
</template>

<script>
import db from "../../db.js";
export default {
  props: ["game-result"],
  computed: {
    userName() {
      return this.$store.state.userName;
    },
    userIndex() {
      return this.$store.state.userIndex;
    },
  },
  methods: {
    listenToOtherPlayer(){
      const players = db.database().ref("/playersInfo/");
      players.on("value", (data) => {
        const nowPlayers = data.val();
        const OKAmount = nowPlayers.filter((player) => player.OKtoPlay === true)
          .length;
        //最後一個點擊進入遊戲的玩家為第一輪第一個玩家
        if (OKAmount === 4) {
          this.$emit("restart-game");
        }
      });
    },
    OKtoNextPlay() {
      const userRef = "/playersInfo/" + this.userIndex;
      const userInfo = db.database().ref(userRef);
      userInfo.update({ OKtoPlay: true });
    },
    restartGame() {
      this.$emit("pop-waiting");
      this.OKtoNextPlay();
      this.listenToOtherPlayer();
    },
    leaveGame() {
      this.$emit("want-to-leave");
    },
    changeMate() {
      this.$emit("team-mate-change");
      this.$router.push({
        name: "WaitingRoom",
        params: { userName: this.userName },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.result_page {
  @include translucent_mask;
  .dialog {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    &.strawberry {
      .title {
        background-color: $button_color;
      }
      .team_name {
        color: $button_color;
      }
    }
    &.canele {
      .title {
        background-color: $title_font_color;
      }
      .team_name {
        color: $title_font_color;
      }
    }
    p {
      width: 100%;
      letter-spacing: 2px;
      text-align: center;
      padding: 10px 20px;
      &.title {
        color: #fff;
        margin: 0;
        font-size: 24px;
      }
      &.text {
        padding: 10px 20px;
        font-size: 18px;
      }
    }
    .button_area {
      width: 70%;
      button {
        @include button_style;
        background-color: #fff;
        background-color: $button_warn_color;
        display: block;
        width: 100%;
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>