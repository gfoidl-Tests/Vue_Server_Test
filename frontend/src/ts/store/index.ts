import Vue  from "vue";
import Vuex from "vuex";
//-----------------------------------------------------------------------------
Vue.use(Vuex);
//-----------------------------------------------------------------------------
// Empty store, modules will be added dynamically.
// Thus keeping the initial bundle small.
const store = new Vuex.Store({
    strict: __DEBUG__       // only enable in development
});
//-----------------------------------------------------------------------------
export default store;
