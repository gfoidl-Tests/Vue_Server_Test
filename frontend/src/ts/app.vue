<template>
    <main-view></main-view>
</template>

<script lang="ts">
    import { Vue, Options }         from "vue-class-component";
    import { defineAsyncComponent } from "vue";

    const MainView = defineAsyncComponent(() => import(/* webpackChunkName: "main", webpackPreload: true */ "@view/main/main-wo-bootstrap.vue"));
    //-------------------------------------------------------------------------
    @Options({
        components: {
            MainView
        }
    })
    export default class App extends Vue { }
</script>
