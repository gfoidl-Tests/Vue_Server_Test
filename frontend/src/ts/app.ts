import Vue from "vue";
import App from "@/app.vue";
//-----------------------------------------------------------------------------
Vue.config.productionTip = false;
//-----------------------------------------------------------------------------
const app = new Vue({
    el    : "app",
    render: r => r(App)
});
