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
    import { userModule }     from "@store/user/user-module";
    //-------------------------------------------------------------------------
    @Component
    export default class StatusView extends Vue {
        public get name(): string {
            return userModule.name;
        }
        //---------------------------------------------------------------------
        public get message(): string {
            return userModule.message;
        }
    }
</script>
