<template>
    <main-view></main-view>
</template>

<script lang="ts">
    import Loading      from "@cmp/loading.vue";
    import LoadingError from "@cmp/loading-error.vue";

    const MainView = () => ({
        component: import(/* webpackChunkName: "main", webpackPreload: true */ "@view/main.vue") as any,    // https://github.com/vuejs/vue-class-component/issues/323#issuecomment-479834166
        loading  : Loading,
        error    : LoadingError
    });
    //-------------------------------------------------------------------------
    export default {
        components: {
            MainView
        }
    };
</script>
