<template>
    <div>Hi</div>
</template>

<style lang="less" scoped>
</style>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import setupBootstrap from "@/setup-bootstrap";
    //-------------------------------------------------------------------------
    // Fabalouse hack for testing with jest, otherwise there are some build
    // failures which seem strange to me...
    if (BOOTSTRAP_SKIP === undefined || !BOOTSTRAP_SKIP) {
        setupBootstrap();
    } else {
        console.debug("Skipping registration of BootstrapVue PlugIn");
    }
    //-------------------------------------------------------------------------
    @Component
    export default class MainView extends Vue {
    }
</script>
