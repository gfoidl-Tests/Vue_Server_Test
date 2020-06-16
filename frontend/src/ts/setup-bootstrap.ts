// Could be used to import only needed features if Tree-Shaking isn't possible.
// With the current setup this split isn't needed, as webpack will elide
// dead code.
//-----------------------------------------------------------------------------
// TODO: BootstrapVue support for vue3
//import { App }      from "vue";
//import BootstrapVue from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
//import "bootstrap-vue/dist/bootstrap-vue.css";
//-----------------------------------------------------------------------------
export default function setupBootstrap(): void {
//    app.use(BootstrapVue);

    console.debug("BootstrapVue registered as PlugIn to Vue");
}
