<template>
    <b-container>
        <b-row>
            <b-col>
                <b-form @submit.prevent="sayHi" @reset.prevent="reset">
                    <b-form-group id="nameGroup" label="Name" label-for="nameInput">
                        <b-form-input id="nameInput" v-model="name" required placeholder="Name" autocomplete="off"></b-form-input>
                    </b-form-group>

                    <b-button id="sendButton" type="submit" variant="primary" :disabled="name.length === 0">Say Hi</b-button>
                    <b-button id="resetButton" type="reset" variant="danger">Reset</b-button>
                </b-form>

                <b-row v-if="message.length > 0">
                    <b-col id="messageCol">
                        <hr />
                        Message: <strong class="message">{{ message }}</strong>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="less" scoped>
    .message {
        color: #0094ff;
    }
</style>

<script lang="ts">
    import { Vue, Component }  from "vue-property-decorator";
    import setupBootstrap      from "@/setup-bootstrap";
    import WinstonLoggerPlugin from "@svc/logger-plugin";
    import HttpClientPlugin    from "@svc/httpclient-plugin";

    import HelloResponse from "./hello-response";
    //-------------------------------------------------------------------------
    Vue.use(WinstonLoggerPlugin);
    Vue.use(HttpClientPlugin);

    // Fabalouse hack for testing with jest, otherwise there are some build
    // failures which seem strange to me...
    if (BOOTSTRAP_SKIP === undefined || !BOOTSTRAP_SKIP) {
        setupBootstrap();
    } else {
        console.debug("Skipping registration of BootstrapVue PlugIn");
    }
    //-------------------------------------------------------------------------
    @Component
    export default class MainView extends Vue {
        public name   : string = "";
        public message: string = "";
        //---------------------------------------------------------------------
        public async sayHi(): Promise<void> {
            const url = `hello?name=${this.name}`;

            this.$logger.debug(`sending request to ${url}`);

            const response = await this.$http.get<HelloResponse>(url);
            this.message   = response.message;

            this.$logger.info({ message: "got response from server", data: response });
        }
        //---------------------------------------------------------------------
        public reset(): void {
            this.name    = "";
            this.message = "";
        }
        //---------------------------------------------------------------------
        private mounted(): void {
            this.$logger.debug({ message: "mounted", at: new Date() });
        }
    }
</script>
