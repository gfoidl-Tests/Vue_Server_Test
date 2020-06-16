import Vue    from "vue";
import App    from "@/app.vue";
import Logger from "@svc/logger";
//-----------------------------------------------------------------------------
Vue.config.productionTip = false;
Logger.init();
//-----------------------------------------------------------------------------
const app = new Vue({
    el    : "app",
    render: r => r(App)
});
