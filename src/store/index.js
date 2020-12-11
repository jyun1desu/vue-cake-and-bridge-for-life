import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    gameInfo: {
      trump: null,
      team: [{
          members: [],
          nowWin: 0,
          shouldWin: 7,
        },
        {
          members: [],
          nowWin: 0,
          shouldWin: 7,
        }
      ],
    },
    nowBinding: {
      whoCalled: '',
      bind: {
        number: 0,
        suit: "♣"
      }
    },
    nowPassedPlayer: 0,
    nowPlayingPlayer: '',
    thisRoundOpeningLead: null,
    thisRoundSuit: '',
    userName: '',
    players: [],
    wonTricks: [],
  },
  mutations: {
    trumpDecide(state, numberAndndSuit) {
      state.gameInfo.trump = numberAndndSuit;
      state.nowPassedPlayer = 0
    },
    playerPass(state) {
      state.nowPassedPlayer++
    },
    updateNowBinding(state, {
      who,
      numberAndSuit
    }) {
      state.nowBinding = {
        whoCalled: who,
        bind: numberAndSuit
      }
    },
    decideWinTricks(state) {
      const number = state.nowBinding.bind.number;
      const whoCalled = state.nowBinding.whoCalled;
      const calledTeam = state.players.find(player => player.name === whoCalled).team
      if (calledTeam === 'team1') {
        state.gameInfo.team[0].shouldWin = 6 + number;
        state.gameInfo.team[1].shouldWin = 14 - 6 - number;
      } else {
        state.gameInfo.team[1].shouldWin = 6 + number;
        state.gameInfo.team[0].shouldWin = 14 - 6 - number;
      }
    },
    assignThisRoundSuit(state, suit) {
      state.thisRoundSuit = suit;
    },
    setUserName(state, userInput) {
      state.userName = userInput;
    },
    setPlayersInfo(state, info) {
      state.players = info;
    },
    assignFirstPlayer(state, player) {
      state.nowPlayingPlayer = player;
    }
  },
  actions: {},
  modules: {}
})