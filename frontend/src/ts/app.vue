<template>
    <main-view></main-view>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    const MainView = () => ({
        component: import(/* webpackChunkName: "main", webpackPreload: true */ "@view/main/main.vue") as any     // https://github.com/vuejs/vue-class-component/issues/323#issuecomment-479834166
    });
    //-------------------------------------------------------------------------
    @Component({
        components: {
            MainView
        }
    })
    export default class App extends Vue { }
</script>
