<template>
    <main-view></main-view>
</template>

<script lang="ts">
    import { defineAsyncComponent } from "vue";
    import Loading                  from "@cmp/loading.vue";
    import LoadingError             from "@cmp/loading-error.vue";
    //-------------------------------------------------------------------------
    const MainView = defineAsyncComponent({
        loader          : () => import(/* webpackChunkName: "main", webpackPreload: true */ "@view/main.vue"),
        loadingComponent: Loading,
        errorComponent  : LoadingError
    });

    export default {
        components: {
            MainView
        }
    };
</script>
