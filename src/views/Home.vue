<template>
  <div class="home">
    <Admin
      @reset-game="resetGame"
      @close="showAdmin = false"
      v-show="showAdmin"
    />
    <ChooseRoom v-if="showGameRoomList" :userName="userName" />
    <Logo @click="showAdmin = true" />
    <form id="name" class="user_input">
      <p>請輸入名字</p>
      <input type="text" v-model="userName" />
      <button
        type="submit"
        @click.prevent="joinGameRoom"
        class="enter_button"
      >
        {{ message }}
      </button>
    </form>
  </div>
</template>

<script>
import db from "../db.js";
import Logo from "@/components/Home/Logo.vue";
import Admin from "@/components/Home/adminDialog.vue";
import ChooseRoom from "@/components/Home/intoRoomDialog.vue";
export default {
  name: "Home",
  beforeRouteEnter(to, from, next) {
    // if (from.path !== "/") {
    //   const Firebase = db.database().ref("/");
    //   Firebase.set({ nowPlayerAmount: 0 });
    // }
    next();
  },
  mounted() {
    const Firebase = db.database().ref("/");
    Firebase.onDisconnect().cancel();
    this.$store.commit("leaveGameInit");
  },
  data() {
    return {
      userName: "",
      showAdmin: false,
      showGameRoomList: false,
    };
  },
  components: {
    Logo,
    ChooseRoom,
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
    joinGameRoom(){
      if (!this.userName.length || this.userName.length > 7) return;
      this.showGameRoomList = true;
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
  @include RWD($laptop) {
    width: 50%;
    margin: 0 auto;
  }
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
    @include input_blank;
    margin: 0 0 20px 0;
    border-bottom: 2px solid $title_font_color;
    padding: 5px;
    font-size: 22px;
    line-height: 25px;
    letter-spacing: 2px;
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
