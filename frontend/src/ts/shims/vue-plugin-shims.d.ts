import { IHttpClient } from "@svc/httpclient";
import { Logger }      from "winston";
//-----------------------------------------------------------------------------
declare module "vue/types/vue" {
    interface Vue {
        $http  : IHttpClient,
        $logger: Logger
    }
}
