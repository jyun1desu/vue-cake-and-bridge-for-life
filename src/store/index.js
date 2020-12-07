import { createStore } from 'vuex'

export default createStore({
  state: {
    trump:null,
    thisRoundOpeningLead:null,
    thisRoundCards:[],
    players:[
      {name:'',cards:[],tricks:[],team:''},
      {name:'',cards:[],tricks:[],team:''},
      {name:'',cards:[],tricks:[],team:''},
      {name:'',cards:[],tricks:[],team:''},
    ],
    

  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
