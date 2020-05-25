// https://www.mistergoodcat.com/post/vuejs-plugins-with-typescript
//-----------------------------------------------------------------------------
import _Vue           from "vue";
import { HttpClient } from "./httpclient";
//-----------------------------------------------------------------------------
export default function HttpClientPlugin(Vue: typeof _Vue): void {
    Vue.prototype.$http = HttpClient.Default;
}
