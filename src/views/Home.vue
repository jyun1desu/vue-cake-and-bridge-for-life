<template>
  <div class="home">
    <Admin
      @reset-game="resetGame"
      @close="showAdmin = false"
      v-show="showAdmin"
    />
    <Logo @click="showAdmin = true" />
    <form id="name" class="user_input">
      <p>請輸入名字</p>
      <input type="text" v-model="userName" />
      <button
        type="submit"
        @click.prevent="enterGame"
        :class="{ novacancy: nowPlayersAmount === 4 }"
        class="enter_button"
      >
        {{ message }}
      </button>
      <p class="now_players">現在人數:{{ nowPlayersAmount }}人/上限4人</p>
    </form>
  </div>
</template>

<script>
import db from "../db.js";
import Logo from "@/components/Home/Logo.vue";
import Admin from "@/components/Home/adminDialog.vue";
export default {
  name: "Home",
  mounted() {
    const nowPlayerAmount = db.database().ref("nowPlayerAmount");
    nowPlayerAmount.on("value", (s) => {
      const data = s.val();
      this.nowPlayersAmount = data;
    });
  },
  data() {
    return {
      userName: "",
      nowPlayersAmount: 0,
      showAdmin: false,
    };
  },
  components: {
    Logo,
    Admin,
  },
  computed: {
    message() {
      if (this.nowPlayersAmount == 4) return "滿員中，請耐心等候";
      else if (this.userName.length > 7) return "請輸入六個字內";
      else if (!this.userName.length) return "請至少輸入一個字";
      else return "加入遊戲";
    },
  },
  methods: {
    enterGame() {
      if (this.nowPlayersAmount === 4) return;
      if (!this.userName.length || this.userName.length > 7) return;
      this.setUserData();
      this.$router.push({
        name: "WaitingRoom",
        params: { userName: this.userName },
      });
    },
    setUserData() {
      const nowPlayerAmount = db.database().ref("nowPlayerAmount");
      const playersInfo = db.database().ref("/playersInfo/");
      nowPlayerAmount.set(this.nowPlayersAmount + 1);
      playersInfo.child(`${this.nowPlayersAmount - 1}`).set({
        name: this.userName,
        team: `${
          this.nowPlayersAmount === 1 || this.nowPlayersAmount === 4
            ? "team1"
            : "team2"
        }`,
      });
      this.$store.commit("setUserName", this.userName);
    },
    resetGame() {
      const gameData = db.database().ref("/");
      gameData.set({ nowPlayerAmount: 0 });
      this.showAdmin = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$button-color: #f29c9b;
$button-no-vacany: #90bf81;
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.user_input {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  p {
    color: $title_font_color;
    font-size: 25px;
    letter-spacing: 2px;
    margin: 0 0 25px 0;

    &.now_players {
      font-size: 14px;
      letter-spacing: 1px;
      margin-top: 10px;
    }
  }
  input {
    user-select: auto;
    -webkit-user-select: auto;
    width: 50%;
    display: block;
    text-align: center;
    color: $title_font_color;
    font-size: 22px;
    line-height: 25px;
    letter-spacing: 2px;
    padding: 5px;
    margin: 0 0 20px 0;
    background-color: transparent;
    border: none;
    border-radius: 0;
    border-bottom: 2px solid $title_font_color;
    &:active,
    &:focus {
      outline: none;
    }
  }
  button {
    @include button_style;
    min-width: 50%;
    font-size: 20px;
    letter-spacing: 3px;
    &.novacancy {
      background-color: $button-no-vacany;
    }
  }
}
</style>
