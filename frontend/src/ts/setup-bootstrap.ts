// Could be used to import only needed features if Tree-Shaking isn't possible.
// With the current setup this split isn't needed, as webpack will elide
// dead code.
//-----------------------------------------------------------------------------
import { app }      from "./app";
import BootstrapVue from "bootstrap-vue-3";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
//-----------------------------------------------------------------------------
export default function setupBootstrap(): void {
    app.use(BootstrapVue);
    console.debug("[BootstrapVue] registered as PlugIn to Vue");
}
