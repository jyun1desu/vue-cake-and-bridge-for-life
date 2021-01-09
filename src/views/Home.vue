<template>
  <div class="home">
    <Logo />
    <ChooseRoom
      v-if="showGameRoomList"
      :userName="userName"
      @close-dialog="showGameRoomList = false"
    />
    <form id="name" class="user_input">
      <p>請輸入名字</p>
      <input type="text" v-model="userName" />
      <button type="submit" @click.prevent="joinGameRoom" class="enter_button">
        {{ message }}
      </button>
    </form>
  </div>
</template>

<script>
import db from "../db.js";
import Logo from "@/components/Home/Logo.vue";
import ChooseRoom from "@/components/Home/intoRoomDialog.vue";
export default {
  name: "Home",
  mounted() {
    if (this.roomName) {
      this.clearGameData();
    }
  },
  data() {
    return {
      userName: "",
      showGameRoomList: false,
    };
  },
  components: {
    Logo,
    ChooseRoom,
  },
  computed: {
    message() {
      if (this.userName.length > 7) return "請輸入六個字内";
      else if (!this.userName.length) return "請至少輸入一個字";
      else return "加入遊戲";
    },
    roomName() {
      return this.$store.state.roomName;
    },
  },
  methods: {
    clearGameData() {
      const Firebase = db.database().ref(`/${this.roomName}/`);
      Firebase.onDisconnect().cancel();
      Firebase.remove();
      this.$store.commit("leaveGameInit");
    },
    joinGameRoom() {
      if (!this.userName.length || this.userName.length > 7) return;
      this.showGameRoomList = true;
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
