import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    gameInfo: {
      trump: null,
      team: [{
          nowWin: 0,
          shouldWin: 7,
        },
        {
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
    thisRoundSuit: '',
    wonTricks: [],
    userCalledBinds:[],
    nowPlayingPlayer: '',
    players: [],
    userName: '',
    userIndex: '',
  },
  getters: {
    nextPlayer(state) {
      const user = state.players.find(player => player.name === state.userName)
      const userIndex = state.players.indexOf(user)
      let nextPlayerIndex = userIndex + 1
      if (nextPlayerIndex > 3) {
        nextPlayerIndex = nextPlayerIndex - 4
      }
      return state.players[nextPlayerIndex].name
    },
    isUsersTurn(state) {
      return state.nowPlayingPlayer === state.userName;
    }
  },
  mutations: {
    setUserIndex(state, index) {
      state.userIndex = index;
    },
    trumpDecide(state, numberAndndSuit) {
      state.gameInfo.trump = numberAndndSuit;
      state.nowPassedPlayer = 0
    },
    playerPass(state,amount) {
      state.nowPassedPlayer = amount
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
    },
    updateUserCalledBinds(state,bind){
      state.userCalledBinds.push(bind)
    },
    switchToNextPlayer(state,player) {
      state.nowPlayingPlayer = player
    },
    addTeamScore(state,teamIndex){
      const winTeam = state.gameInfo.team[teamIndex];
      winTeam.nowWin++
    },
    updateWonTricks(state,cards){
      state.wonTricks.push(cards)
    },
    restartGameInit(state){
      state.gameInfo =  {
        trump: null,
        team: [{
            nowWin: 0,
            shouldWin: 7,
          },
          {
            nowWin: 0,
            shouldWin: 7,
          }
        ],
      };
      state.nowBinding =  {
        whoCalled: '',
        bind: {
          number: 0,
          suit: "♣"
        }
      };
      state.nowPassedPlayer = 0;
      state.thisRoundSuit =  '';
      state.wonTricks =  [];
      state.userCalledBinds = [];
    },
    leaveGameInit(state){
      state.players =  [];
      state.userName=  '';
      state.userIndex= '';
    }
  },
  actions: {},
  modules: {}
})