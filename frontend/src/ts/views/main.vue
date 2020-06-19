<template>
    <div>
        <form-view></form-view>
        <hr />
        <status-view></status-view>
    </div>
</template>

<script lang="ts">
    import setupBootstrap from "@/setup-bootstrap";
    //-------------------------------------------------------------------------
    import FormView   from "./form.vue";
    import StatusView from "./status.vue";
    //-------------------------------------------------------------------------
    // Fabalouse hack for testing with jest, otherwise there are some build
    // failures which seem strange to me...
    if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
        setupBootstrap();
    } else {
        console.debug("Skipping registration of BootstrapVue PlugIn");
    }
    //-------------------------------------------------------------------------
    export default {
        components: {
            FormView,
            StatusView
        }
    };
</script>
