<template>
    <c-container>
        <c-row>
            <c-col>
                <c-form @submit.prevent="hello" @reset.prevent="reset">
                    <div class="mb-3">
                        <c-form-label for="nameInput">Name</c-form-label>
                        <c-form-input id="nameInput" v-model="name" required placeholder="Name" autocomplete="off"></c-form-input>
                    </div>

                    <c-button id="sendButton" type="submit" color="primary" :disabled="name.length === 0">Say Hi</c-button>
                    <c-button id="resetButton" type="reset" color="danger">Reset</c-button>
                </c-form>

                <c-row v-if="message.length > 0">
                    <c-col>
                        <hr />
                        Message: <strong class="message" id="messageSpan">{{ message }}</strong>
                    </c-col>
                </c-row>
            </c-col>
        </c-row>

        <hr />

        <c-row>
            <c-col>
                <c-button id="errorButton" color="info" variant="outline" @click="throwError">Throw unhandled error</c-button>
            </c-col>
        </c-row>
    </c-container>
</template>

<style lang="less" scoped>
    .message {
        color: #0094ff;
    }
</style>

<script lang="ts">
    import { defineComponent } from "vue";
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
