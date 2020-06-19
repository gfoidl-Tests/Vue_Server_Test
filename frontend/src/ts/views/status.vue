<template>
    <b-container>
        <b-row>
            <b-col id="nameCol">
                Name: {{ name }}
            </b-col>
        </b-row>
        <b-row>
            <b-col id="messageCol">
                Message: {{ message }}
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
    import { defineComponent } from "@vue/composition-api";
    import { useUserStore }    from "@store/user/user";
    //-------------------------------------------------------------------------
    const component = defineComponent({
        setup() {
            const { name, message } = useUserStore();

            return {
                name,
                message
            };
        }
    });
    //-------------------------------------------------------------------------
    export default component;
</script>
