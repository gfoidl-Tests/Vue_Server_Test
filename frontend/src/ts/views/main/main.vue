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
    import { defineComponent, ref, computed } from "@vue/composition-api";
    import setupBootstrap                     from "@/setup-bootstrap";
    import GreetingService                    from "./greeting-service";
    //-------------------------------------------------------------------------
    // Fabalouse hack for testing with jest, otherwise there are some build
    // failures which seem strange to me...
    if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
        setupBootstrap();
    } else {
        console.debug("Skipping registration of BootstrapVue PlugIn");
    }
    //-------------------------------------------------------------------------
    const name            = ref("");
    const message         = ref("");
    const greetingService = new GreetingService();
    //-------------------------------------------------------------------------
    async function hello(): Promise<void> {
        message.value = await greetingService.hello(name.value);

        console.debug("message set to", message.value);
    }
    //-------------------------------------------------------------------------
    function reset(): void {
        name.value    = "";
        message.value = "";
    }
    //-------------------------------------------------------------------------
    function throwError(): void {
        throw new Error("Test for unhandled error");
    }
    //-------------------------------------------------------------------------
    const component = defineComponent({
        setup() {
            // Returns the "view model"
            // All the types returned could come from different places, and they
            // are "composed" here -- hence the name.
            // It's all about the view model, and this doesn't need to be a class,
            // rather it's a "loose" coupling of types that are used by the view.
            return {
                name: computed<string>({
                    get: ()  => name.value,
                    set: val => name.value = val
                }),
                message: computed(() => message.value),
                hello,
                reset,
                throwError
            };
        }
    });
    //-------------------------------------------------------------------------
    export default component;
</script>
