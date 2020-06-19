<template>
    <main-view></main-view>
</template>

<script lang="ts">
    const MainView = () => ({
        component: import(/* webpackChunkName: "main", webpackPreload: true */ "@view/main.vue") as any     // https://github.com/vuejs/vue-class-component/issues/323#issuecomment-479834166
    });
    //-------------------------------------------------------------------------
    export default {
        components: {
            MainView
        }
    };
</script>
