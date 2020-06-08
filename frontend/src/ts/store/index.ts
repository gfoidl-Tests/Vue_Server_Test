import Vue  from "vue";
import Vuex from "vuex";
//-----------------------------------------------------------------------------
// Fabalouse hack for testing with jest, otherwise there are some
// failures which seem strange to me...
if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
    Vue.use(Vuex);
    //-------------------------------------------------------------------------
    // Empty store, modules will be added dynamically.
    // Thus keeping the initial bundle small.
    const store = new Vuex.Store({
        strict: __DEBUG__       // only enable in development
    });
} else {
    const store = {};
}

export default store;
