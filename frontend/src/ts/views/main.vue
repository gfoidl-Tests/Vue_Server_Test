<template>
    <form-view></form-view>
    <hr v-show="isNameEntered" />
    <status-view></status-view>
    <hr v-show="isNameEntered" />
    <history-view></history-view>
    <hr v-show="!isNameEntered" />
    <version></version>
</template>

<script lang="ts">
    import setupCoreUI                                         from "@/setup-coreui";
    import { defineComponent, computed, onUnmounted, provide } from "vue";
    import { provideUserStore, useUserStore }                  from "@store/user/user";
    import GreetingHub                                         from "@hub/greeting-hub";
    //-------------------------------------------------------------------------
    import FormView    from "./form.vue";
    import StatusView  from "./status.vue";
    import HistoryView from "./history.vue";
    import Version     from "@cmp/version.vue";
    //-------------------------------------------------------------------------
    // Fabalouse hack for testing with jest, otherwise there are some build
    // failures which seem strange to me...
    if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
        setupCoreUI();
    } else {
        console.debug("Skipping registration of BootstrapVue PlugIn");
    }
    //-------------------------------------------------------------------------
    export default defineComponent({
        components: {
            FormView,
            StatusView,
            HistoryView,
            Version
        },
        setup() {
            // This provides an instance of the user-store, which can be used
            // by `useUserStore` and the state is shared.
            // A different component could create a new store with different
            // (new) state.
            // That's the advantage of the provide-inject-pattern over
            // "global" state in the store.
            provideUserStore();

            // Use the provided store (instance) self
            const { name }      = useUserStore();
            const isNameEntered = computed(() => name.value.length > 0);

            // Vue's inject is only allowed within an active component. So use
            // ctor-injection here.
            const greetingHub = new GreetingHub(useUserStore());

            // For me this is the most elegant approach. Other possibilities are:
            //   * using 'props' to pass the greetingHub to the child
            //   * using 'emit' in the child and handling the event here
            // Both have the drawback of some overhead ceremony and it's not the
            // responsibility to handle this here.
            provide("greetingHub", greetingHub);

            onUnmounted(() => {
                greetingHub.disconnect();
            });

            return {
                isNameEntered
            };
        }
    });
</script>
