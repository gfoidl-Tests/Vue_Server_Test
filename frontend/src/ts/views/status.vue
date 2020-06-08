<template>
    <b-container>
        <b-row>
            <b-col>
                Name: {{ name }}
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                Message: {{ message }}
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { userStore }      from "@store/user/user-store";
    //-------------------------------------------------------------------------
    @Component
    export default class StatusView extends Vue {
        public get name(): string {
            return userStore.name;
        }
        //---------------------------------------------------------------------
        public get message(): string {
            return userStore.message;
        }
    }
</script>
