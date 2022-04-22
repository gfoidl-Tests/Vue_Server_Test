import { createApp } from "vue";
import App           from "@/app.vue";
import Logger        from "@svc/logger";
//-----------------------------------------------------------------------------
if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
    console.debug("App starting...");
}

const app = createApp(App);
Logger.init(app);
app.mount("#app");
//-----------------------------------------------------------------------------
export { app };
