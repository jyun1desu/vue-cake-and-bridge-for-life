<template>
  <LoadingDialog type="waiting" v-if="showWaitingDialog === true" />
  <div class="page">
    <div class="wait_room">
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
      <button
        @click="enterGame"
        :class="{ warn: buttonWarn }"
        class="start_game"
      >
        {{ buttonMessage }}
      </button>
    </div>
  </div>
</template>

<script>
import db from "../db.js";
import LoadingDialog from "../components/loadingDialog.vue";
export default {
  name: "WaitingRoom",
  components: {
    LoadingDialog,
  },
  created() {
    //隊伍
    const nowPlayers = db.database().ref("/playersInfo/");
    nowPlayers.once("value", (data) => {
      const playersArray = data.val();
      const user = playersArray[this.userIndex];
      this.chosenTeam = user.team;
    });

    nowPlayers.on("value", (data) => {
      const nowPlayers = data.val();
      this.players = data.val();
      this.team = nowPlayers.map((player) => player.team);
      this.playerOrder = nowPlayers.map((player) => player.name);

      const OKAmount = nowPlayers.filter((player) => player.OKtoPlay === true)
        .length;
      if (OKAmount === 4) {
        this.showWaitingDialog = false;
        this.$router.push({
          name: "GameRoom",
          params: { userName: this.userName },
        });
      }
    });
    const userRef = "/playersInfo/" + this.userIndex;
    const userInfo = db.database().ref(userRef);
    userInfo.update({ OKtoPlay: false })
  },
  data() {
    return {
      players: [],
      playerOrder: [],
      chosenTeam: "",
      team: [],
      showWaitingDialog: false,
    };
  },
  methods: {
    chooseTeam(team) {
      this.chosenTeam = team;
      const user = "/playersInfo/" + this.userIndex;
      const userTeamInfo = db.database().ref(user);
      userTeamInfo.update({ team: this.chosenTeam });
    },
    enterGame() {
      if (this.buttonWarn) return;
      const userRef = "/playersInfo/" + this.userIndex;
      const userInfo = db.database().ref(userRef);
      userInfo.update({ OKtoPlay: true });
      this.showWaitingDialog = true;

      const team1 = this.players.filter((player) => player.team === "team1");
      const team2 = this.players.filter((player) => player.team === "team2");
      const orderArray = [team1[0], team2[0], team1[1], team2[1]];
      this.$store.commit("setPlayersInfo", orderArray);
      //
      const nowPlayers = db.database().ref("/playersInfo");
      nowPlayers.once("value", (data) => {
        const nowPlayers = data.val();
        const OKAmount = nowPlayers.filter((player) => player.OKtoPlay === true)
        .length;
        //最後一個點擊進入遊戲的玩家為第一輪第一個玩家，進入同時洗牌、發牌
        if (OKAmount === 4) {
          this.$store.commit("assignFirstPlayer", this.userName);
          db.database().ref("/nowPlayer/").set(this.userName);
          const shuffledDeck = this.shuffle(this.buildNewDeck());
          const deal = this.dealCards(4, shuffledDeck);
          db.database().ref("/deck/").set(deal);
        }
      });
    },
    ////建立新牌組
    buildNewDeck() {
      const suit = ["spades", "heart", "diamond", "club"];
      const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      const deck = [];
      for (let i = 0; i < suit.length; i++) {
        let card = {};
        for (let j = 0; j < number.length; j++) {
          card = {
            suit: suit[i],
            number: number[j],
          };
          deck.push(card);
        }
      }
      return deck;
    },
    ////洗牌
    shuffle(deck) {
      let i = deck.length;
      while (i > 1) {
        let index = Math.floor(Math.random() * i--);
        [deck[i], deck[index]] = [deck[index], deck[i]];
      }
      return deck;
    },
    ////發牌(給四個玩家)
    dealCards(playerAmount, deck) {
      const players = [];
      for (let i = 0; i < playerAmount; i++) {
        const eachPlayer = [];
        players.push(eachPlayer);
      }
      for (let i = 0; i < deck.length; i++) {
        const playerIndex = i % playerAmount;
        players[playerIndex].push(deck[i]);
      }
      const sorted = players.map((cards) => this.sortCards(cards));
      return sorted;
    },
    //排序牌
    sortCards(cards) {
      const sorted = cards.sort((cardA, cardB) => {
        const order = ["spades", "heart", "club", "diamond"];
        cardA = 100 * (4 - order.indexOf(cardA.suit)) + 13 - cardA.number;
        cardB = 100 * (4 - order.indexOf(cardB.suit)) + 13 - cardB.number;
        return cardB - cardA;
      });
      return sorted;
    },
  },
  computed: {
    userIndex() {
      return this.$store.state.userIndex;
    },
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
};
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  display: flex;
}
.wait_room {
  box-sizing: border-box;
  padding: 5vw;
  align-self: center;
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
    margin-top: 30px;
    margin-bottom: auto;

    &.warn {
      font-size: 20px;
      background-color: $button_warn_color;
    }
  }
}
</style>