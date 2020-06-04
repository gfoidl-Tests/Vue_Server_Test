<template>
    <div>
        <main-view></main-view>

        <hr />

        <status-view></status-view>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    const MainView = () => ({
        component: import(/* webpackChunkName: "main", webpackPreload: true */ "@view/main.vue") as any     // https://github.com/vuejs/vue-class-component/issues/323#issuecomment-479834166
    });

    const StatusView = () => ({
        component: import(/* webpackChunkName: "main", webpackPreload: true */ "@view/status.vue") as any
    });
    //-------------------------------------------------------------------------
    @Component({
        components: {
            MainView,
            StatusView
        }
    })
    export default class App extends Vue { }
</script>
