<template>
  <LoadingDialog v-if="showWaitingDialog === true" />
  <div class="wait_room">
    <button @click="leaveGame" class="leave_button">不打了不打了</button>
    <div class="players">
      <div
        :class="{
          canele_team: team[0] === 'team2',
          default_strawberry_team: !team[0] || team[0] === 'team1',
        }"
        class="player player__first"
      >
        <p class="player__name">{{ playerOrder[0] || "" }}</p>
      </div>
      <div
        :class="{
          canele_team: !team[1] || team[1] === 'team2',
          default_strawberry_team: team[1] === 'team1',
        }"
        class="player player__second"
      >
        <p class="player__name">{{ playerOrder[1] || "" }}</p>
      </div>
      <div
        :class="{
          canele_team: !team[2] || team[2] === 'team2',
          default_strawberry_team: team[2] === 'team1',
        }"
        class="player player__third"
      >
        <p class="player__name">{{ playerOrder[2] || "" }}</p>
      </div>
      <div
        :class="{
          canele_team: team[3] === 'team2',
          default_strawberry_team: !team[3] || team[3] === 'team1',
        }"
        class="player player__fourth"
      >
        <p class="player__name">{{ playerOrder[3] || "" }}</p>
      </div>
    </div>
    <div class="choose_team">
      <div class="options">
        <div
          @click="chooseTeam('team1')"
          :class="{ chosen: chosenTeam === 'team1' }"
          class="option team1"
        >
          <span class="radio"></span>
          <span>草莓糕</span>
        </div>
        <div
          @click="chooseTeam('team2')"
          :class="{ chosen: chosenTeam === 'team2' }"
          class="option team2"
        >
          <span class="radio"></span>
          <span>可麗露</span>
        </div>
      </div>
    </div>
    <button @click="enterGame" :class="{ warn: buttonWarn }" class="start_game">
      {{ buttonMessage }}
    </button>
  </div>
</template>

<script>
import db from "../db.js";
import LoadingDialog from "../components/waitingRoom/loadingDialog.vue";
export default {
  name: "WaitingRoom",
  components: {
    LoadingDialog,
  },
  created() {
    const nowPlayers = db.database().ref("/playersInfo/");
    nowPlayers.once("value", (data) => {
      const nowPlayers = data.val();
      //所有玩家順序
      const nowPlayersArray = Object.entries(nowPlayers).map((a) => a[1].name);
      this.playerOrder = nowPlayersArray;
      //找到使用者是第幾個人
      this.userOrdrerIndex = nowPlayersArray.indexOf(this.userName);
      //找到使用者資料上的key
      const allUsersID = Object.entries(nowPlayers).map((a) => a[0]);
      this.userID = allUsersID[this.userOrdrerIndex];
      //預設隊伍
      if (this.userOrdrerIndex === 0 || this.userOrdrerIndex === 3) {
        this.chosenTeam = "team1";
      } else {
        this.chosenTeam = "team2";
      }
      const path = "/playersInfo/" + this.userID;
      const user = db.database().ref(path);
      user.once("value", (data) => {
        if (this.userID !== "") {
          user.update({ team: this.chosenTeam });
        }
      });
    });
  },
  data() {
    return {
      userID: "",
      playerOrder: [],
      userOrdrerIndex: "",
      chosenTeam: "",
      team: [],
      showWaitingDialog: false,
    };
  },
  methods: {
    chooseTeam(team) {
      this.chosenTeam = team;
      const user = "/playersInfo/" + this.userID;
      const userTeamInfo = db.database().ref(user);
      userTeamInfo.update({ team: this.chosenTeam });
    },
    leaveGame() {
      this.$router.push({
        name: "Home",
      });
    },
    enterGame() {
      if (this.buttonWarn) return;
      const user = "/playersInfo/" + this.userID;
      const userInfo = db.database().ref(user);
      userInfo.update({ OKtoPlay: true });
      this.showWaitingDialog = true;

      const playerInfo = Array.from(this.playerOrder).map((player, index) => {
        return {
          name: player,
          team: this.team[index],
        };
      });
      const team1 = playerInfo.filter((player) => player.team === "team1");
      const team2 = playerInfo.filter((player) => player.team === "team2");
      const orderArray = [team1[0], team2[0], team1[1], team2[1]];
      this.$store.commit('setPlayersInfo',orderArray)
      this.$store.commit('assignFirstPlayer',orderArray[0].name)
    },
  },
  computed: {
    buttonMessage() {
      const team1 = this.team.filter((team) => team === "team1").length;
      const team2 = this.team.filter((team) => team === "team2").length;
      if (team1 + team2 !== 4) return "人數不足⋯⋯";
      const msg = team1 === team2 ? "開打啦！" : "人數不一樣怎麼打！";
      return msg;
    },
    buttonWarn() {
      if (this.buttonMessage !== "開打啦！") {
        return true;
      } else {
        return false;
      }
    },
    userName() {
      return this.$store.state.userName;
    },
  },
  mounted() {
    const nowPlayers = db.database().ref("/playersInfo");
    nowPlayers.on("value", (data) => {
      const nowPlayers = data.val();
      const teamArray = Object.entries(nowPlayers).map((a) => a[1].team);
      const nowPlayersArray = Object.entries(nowPlayers).map((a) => a[1].name);
      this.team = teamArray;
      this.playerOrder = nowPlayersArray;

      const OKtoGo = Object.entries(nowPlayers).map((a) => a[1].OKtoPlay);
      const OKAmount = Array.from(OKtoGo).filter((answer) => answer === true)
        .length;
      if (OKAmount === 4) {
        this.showWaitingDialog = false;
        this.$router.push({
          name: "GameRoom",
          params: { userName: this.userName },
        });
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.wait_room {
  box-sizing: border-box;
  padding: 5vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.players {
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  width: 90vw;
  height: 90vw;
  margin-bottom: 30px;
  .player {
    flex-basis: 50%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    transition: all 0.2s;

    &.default_strawberry_team {
      background-color: rgb(241, 224, 224);
    }
    &.canele_team {
      background-color: rgb(206, 190, 180);
    }

    &__name {
      flex: 0 1 auto;
      max-width: 30vw;
      background-color: #fff;
      border-radius: 20px;
      font-size: 20px;
      color: $title_font_color;
      padding: 5px 15px;
      margin-bottom: 10px;
    }
  }
}

.choose_team {
  align-self: flex-start;
  width: 100%;
  .options {
    display: flex;
    width: 100%;
    justify-content: space-around;
    font-size: 0;
    .option {
      font-size: 20px;
      letter-spacing: 1px;
      color: rgb(167, 167, 167);

      .radio {
        @include radio_style(15px, 10px);
      }

      &.chosen {
        &.team1 {
          color: $button_color;
          .radio::after {
            background-color: $button_color;
          }
        }
        &.team2 {
          color: $title_font_color;
          .radio::after {
            background-color: $title_font_color;
          }
        }
      }
    }
  }
}

button {
  @include button_style;
  letter-spacing: 2px;
  &.leave_button {
    padding: 10px;
    font-size: 12px;
    background-color: #8b765f;
    margin-left: auto;
    margin-bottom: 50px;
  }
  &.start_game {
    font-size: 25px;
    background-color: $button_color;
    margin-top: auto;
    margin-bottom: 50px;

    &.warn {
      font-size: 20px;
      background-color: $button_warn_color;
    }
  }
}
</style>