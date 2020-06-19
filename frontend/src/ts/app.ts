import Vue            from "vue";
import CompositionApi from "@vue/composition-api"
import App            from "@/app.vue";
import Logger         from "@svc/logger";
//-----------------------------------------------------------------------------
Vue.config.productionTip = false;
Vue.use(CompositionApi);
Logger.init();
//-----------------------------------------------------------------------------
const app = new Vue({
    el    : "app",
    render: r => r(App)
});
