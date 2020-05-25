import { IHttpClient } from "@svc/httpclient";
//-----------------------------------------------------------------------------
declare module "vue/types/vue" {
    interface Vue {
        $http: IHttpClient
    }
}
