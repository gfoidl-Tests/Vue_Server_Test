import { createApp } from "vue";
import App           from "@/app.vue";
import Logger        from "@svc/logger";
//-----------------------------------------------------------------------------
const app = createApp(App);
Logger.init(app.config);
app.mount("app");
