import Vue              from "vue";
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
    render: r => r(App)
});
