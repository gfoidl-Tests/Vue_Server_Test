<template>
    <b-container v-show="name.length > 0">
        <b-row>
            <b-col id="nameCol">
                Name: <strong>{{ name }}</strong>
            </b-col>
        </b-row>
        <b-row>
            <b-col id="messageCol">
                Message: <strong>{{ message }}</strong>
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="less" scoped>
    strong {
        color: #0094ff;
    }
</style>

<script lang="ts">
    import { defineComponent } from "@vue/composition-api";
    import { useUserStore }    from "@store/user/user";
    //-------------------------------------------------------------------------
    export default defineComponent({
        setup() {
            const { name, message } = useUserStore();

            return {
                name,
                message
            };
        }
    });
</script>
