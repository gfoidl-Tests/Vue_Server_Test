<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <form @submit.prevent="hello" @reset.prevent="reset">
                    <div class="form-group" id="nameGroup">
                        <label for="nameInput">Name</label>
                        <input type="text" id="nameInput" v-model="name" required placeholder="Name" autocomplete="off" />
                    </div>

                    <button type="submit" id="sendButton" class="btn btn-primary" :disabled="name.length === 0">Say Hi</button>
                    <button type="reset" id="resetButton" class="btn btn-danger">Reset</button>
                </form>

                <div class="row" v-if="message.length > 0">
                    <div class="col">
                        <hr />
                        Message: <strong class="message" id="messageSpan">{{ message }}</strong>
                    </div>
                </div>
            </div>
        </div>

        <hr />

        <div class="row">
            <div class="col">
                <button type="button" id="errorButton" class="btn btn-outline-info" @click="throwError">Throw unhandled error</button>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .message {
        color: #0094ff;
    }
</style>

<script lang="ts">
    import { Vue }         from "vue-class-component";
    import GreetingService from "./greeting-service";
    import setupBootstrap  from "@/setup-bootstrap";
    import { Nullable }    from "@ext/types";
    //-------------------------------------------------------------------------
    // Fabalouse hack for testing with jest, otherwise there are some build
    // failures which seem strange to me...
    if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
        setupBootstrap();
    } else {
        console.debug("Skipping registration of BootstrapVue PlugIn");
    }
    //-------------------------------------------------------------------------
    // https://github.com/vuejs/vue-class-component/issues/406
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
        public mounted(): void {
            console.debug("mounted at", new Date());

            // For Vue this won't work in the ctor, that's why it's here.
            this.greetingService = new GreetingService();
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
