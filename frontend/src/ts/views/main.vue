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
    import { userModule }     from "@store/user/user-module";
    import setupBootstrap     from "@/setup-bootstrap";
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
        public get name(): string {
            return userModule.name;
        }

        public set name(value: string) {
            userModule.setName(value);
        }
        //---------------------------------------------------------------------
        public get message(): string {
            return userModule.message;
        }
        //---------------------------------------------------------------------
        public hello(): void {
            //this.$store.dispatch("user/hello");
            userModule.hello();
        }
        //---------------------------------------------------------------------
        public reset(): void {
            //this.$store.dispatch("user/reset");
            userModule.reset();
        }
        //---------------------------------------------------------------------
        public throwError(): void {
            throw new Error("Test for unhandled error");
        }
    }
</script>
