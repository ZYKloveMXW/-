import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        msg: '汕头市潮阳区'
    },
    mutations: {
        getMsg: (state, obj) => {
            state.msg = obj.msg
        }
    },
    actions: {
        sendMsg: ({ commit }) => {
            console.log("666");
            axios.get('http://localhost:3000/picture')
                .then(res => {
                    commit({
                        type: 'getMsg',
                        msg: res.data[2].url
                    })
                })
            // console.log(tempMsg);
            // commit({
            //     type: 'getMsg',
            //     msg: tempMsg
            // })
        }
    }

})

export default store