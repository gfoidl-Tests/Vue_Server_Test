<template>
    <div>
        <form-view></form-view>
        <hr />
        <status-view></status-view>
    </div>
</template>

<script lang="ts">
    import setupBootstrap       from "@/setup-bootstrap";
    import { defineComponent }  from "@vue/composition-api";
    import { provideUserStore } from "@store/user/user";
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
    const component = defineComponent({
        components: {
            FormView,
            StatusView
        },
        setup() {
            // This provides an instance of the user-store, which can be used
            // by `useUserStore` and the state is shared.
            // A different component could create a new store with different
            // (new) state.
            // That's the advantage of the provide-inject-pattern over
            // "global" state in the store.
            provideUserStore();
        }
    });
    //-------------------------------------------------------------------------
    export default component;
</script>
