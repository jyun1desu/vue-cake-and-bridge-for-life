"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vuex = require("vuex");

var _default = (0, _vuex.createStore)({
  state: {
    gameInfo: {
      trump: null,
      team: [{
        nowWin: 0,
        shouldWin: 7
      }, {
        nowWin: 0,
        shouldWin: 7
      }]
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
    userCalledBinds: [],
    nowPlayingPlayer: '',
    players: [],
    userName: '',
    userIndex: ''
  },
  getters: {
    nextPlayer: function nextPlayer(state) {
      var user = state.players.find(function (player) {
        return player.name === state.userName;
      });
      var userIndex = state.players.indexOf(user);
      var nextPlayerIndex = userIndex + 1;

      if (nextPlayerIndex > 3) {
        nextPlayerIndex = nextPlayerIndex - 4;
      }

      return state.players[nextPlayerIndex].name;
    },
    isUsersTurn: function isUsersTurn(state) {
      return state.nowPlayingPlayer === state.userName;
    }
  },
  mutations: {
    setUserIndex: function setUserIndex(state, index) {
      state.userIndex = index;
    },
    trumpDecide: function trumpDecide(state, numberAndndSuit) {
      state.gameInfo.trump = numberAndndSuit;
      state.nowPassedPlayer = 0;
    },
    playerPass: function playerPass(state, amount) {
      state.nowPassedPlayer = amount;
    },
    updateNowBinding: function updateNowBinding(state, _ref) {
      var who = _ref.who,
          numberAndSuit = _ref.numberAndSuit;
      state.nowBinding = {
        whoCalled: who,
        bind: numberAndSuit
      };
    },
    decideWinTricks: function decideWinTricks(state) {
      var number = state.nowBinding.bind.number;
      var whoCalled = state.nowBinding.whoCalled;
      var calledTeam = state.players.find(function (player) {
        return player.name === whoCalled;
      }).team;

      if (calledTeam === 'team1') {
        state.gameInfo.team[0].shouldWin = 6 + number;
        state.gameInfo.team[1].shouldWin = 14 - 6 - number;
      } else {
        state.gameInfo.team[1].shouldWin = 6 + number;
        state.gameInfo.team[0].shouldWin = 14 - 6 - number;
      }
    },
    assignThisRoundSuit: function assignThisRoundSuit(state, suit) {
      state.thisRoundSuit = suit;
    },
    setUserName: function setUserName(state, userInput) {
      state.userName = userInput;
    },
    setPlayersInfo: function setPlayersInfo(state, info) {
      state.players = info;
    },
    assignFirstPlayer: function assignFirstPlayer(state, player) {
      state.nowPlayingPlayer = player;
    },
    updateUserCalledBinds: function updateUserCalledBinds(state, bind) {
      state.userCalledBinds.push(bind);
    },
    switchToNextPlayer: function switchToNextPlayer(state, player) {
      state.nowPlayingPlayer = player;
    },
    addTeamScore: function addTeamScore(state, teamIndex) {
      var winTeam = state.gameInfo.team[teamIndex];
      winTeam.nowWin++;
    },
    updateWonTricks: function updateWonTricks(state, cards) {
      state.wonTricks.push(cards);
    },
    restartGameInit: function restartGameInit(state) {
      state.gameInfo = {
        trump: null,
        team: [{
          nowWin: 0,
          shouldWin: 7
        }, {
          nowWin: 0,
          shouldWin: 7
        }]
      };
      state.nowBinding = {
        whoCalled: '',
        bind: {
          number: 0,
          suit: "♣"
        }
      };
      state.nowPassedPlayer = 0;
      state.thisRoundSuit = '';
      state.wonTricks = [];
      state.userCalledBinds = [];
    },
    leaveGameInit: function leaveGameInit(state) {
      state.players = [];
      state.userName = '';
      state.userIndex = '';
    }
  },
  actions: {},
  modules: {}
});

exports["default"] = _default;