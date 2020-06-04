import Vue              from "vue";
import store            from "@store/index";
import App              from "@/app.vue";
import HttpClientPlugin from "@svc/httpclient-plugin";
import Logger           from "@svc/logger";
//-----------------------------------------------------------------------------
Vue.config.productionTip = false;
Vue.use(HttpClientPlugin);
Logger.init();
//-----------------------------------------------------------------------------
const app = new Vue({
    el    : "app",
    store,
    render: r => r(App)
});
