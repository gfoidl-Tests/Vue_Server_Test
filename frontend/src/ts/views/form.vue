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
    import { defineComponent } from "@vue/composition-api";
    import { useUserStore }    from "@store/user/user";
    //-------------------------------------------------------------------------
    function throwError(): void {
        throw new Error("Test for unhandled error");
    }
    //-------------------------------------------------------------------------
    export default defineComponent({
        setup() {
            // Deconstruct for easier use in the view-model
            const { name, message, hello, reset } = useUserStore();

            // Returns the "view model"
            // All the types returned could come from different places, and they
            // are "composed" here -- hence the name.
            // It's all about the view model, and this doesn't need to be a class,
            // rather it's a "loose" coupling of types that are used by the view.
            return {
                name,
                message,
                hello,
                reset,
                throwError
            };
        }
    });
</script>
