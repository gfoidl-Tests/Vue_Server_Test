<template>
    <b-container>
        <b-row>
            <b-col>
                <b-form @submit.prevent="hello" @reset.prevent="reset">
                    <b-form-group id="nameGroup" label="Name" label-for="nameInput">
                        <b-form-input id="nameInput" v-model="name" required placeholder="Name" autocomplete="off"></b-form-input>
                    </b-form-group>

                    <b-button id="sendButton" type="submit" variant="primary" :disabled="name.length === 0">Say Hi</b-button>
                    <b-button id="resetButton" type="reset" variant="danger">Reset</b-button>
                </b-form>

                <b-row v-if="message.length > 0">
                    <b-col>
                        <hr />
                        Message: <strong class="message" id="messageSpan">{{ message }}</strong>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>

        <hr />

        <b-row>
            <b-col>
                <b-button id="errorButton" variant="outline-info" @click="throwError">Throw unhandled error</b-button>
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
    import { Vue, Component } from "vue-property-decorator";
    import setupBootstrap     from "@/setup-bootstrap";
    import GreetingService    from "./greeting-service";
    import { Nullable }       from "@ext/types";
    //-------------------------------------------------------------------------
    // Fabalouse hack for testing with jest, otherwise there are some build
    // failures which seem strange to me...
    if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
        setupBootstrap();
    } else {
        console.debug("Skipping registration of BootstrapVue PlugIn");
    }
    //-------------------------------------------------------------------------
    @Component
    export default class MainView extends Vue {
        // It should be private, so with _ or # (Ecma script) prefix.
        // Vue uses _ internally, so this won't work.
        // # is treated at CSS selector, so don't work either.
        // Hence just keep it simple ;-)
        greetingService: Nullable<GreetingService> = null;
        //---------------------------------------------------------------------
        public name   : string = "";
        public message: string = "";
        //---------------------------------------------------------------------
        private mounted(): void {
            console.debug("mounted at", new Date());

            // For Vue this won't work in the ctor, that's why it's here.
            this.greetingService = new GreetingService(this.$http);
        }
        //---------------------------------------------------------------------
        public async hello(): Promise<void> {
            this.message = await this.greetingService!.hello(this.name);

            console.debug("message set to", this.message);
        }
        //---------------------------------------------------------------------
        public reset(): void {
            this.name    = "";
            this.message = "";
        }
        //---------------------------------------------------------------------
        public throwError(): void {
            throw new Error("Test for unhandled error");
        }
    }
</script>
