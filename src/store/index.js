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
    nowPlayingPlayer: 'jyun1',
    thisRoundOpeningLead: null,
    thisRoundSuit: '',
    userName: 'jyun1',
    players: [{
        name: 'jyun1',
        cards: [],
        team: 'team1',
        badLuck: false,
        badLuckGiveUp: false
      },
      {
        name: 'nico',
        cards: [],
        team: 'team2',
        badLuck: false,
        badLuckGiveUp: false
      },
      {
        name: 'michael',
        cards: [],
        team: 'team1',
        badLuck: false,
        badLuckGiveUp: false
      },
      {
        name: '熊熊',
        cards: [],
        team: 'team2',
        badLuck: false,
        giveUp: false,
      },
    ],


  },
  getters: {
    someoneGiveUp(state) {
      const someone = state.players.some(player => player.giveUp === true)
      return someone
    },
    someonebadLuck(state) {
      const someone = state.players.some(player => player.badLuck === true)
      return someone
    },
    userInfo(state) {
      const userName = state.userName;
      return state.players.find(player => player.name === userName)
    }
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
      const calledTeam = state.players.find(player=>player.name===whoCalled).team
      if(calledTeam==='team1'){
        state.gameInfo.team[0].shouldWin = 6+number;
        state.gameInfo.team[1].shouldWin = 14-6-number;
      }else{
        state.gameInfo.team[1].shouldWin = 6+number;
        state.gameInfo.team[0].shouldWin = 14-6-number;
      }
    },
    assignThisRoundSuit(state,suit){
      state.thisRoundSuit = suit;
    }
    
  },
  actions: {},
  modules: {}
})