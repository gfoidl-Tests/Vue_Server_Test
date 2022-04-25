<template>
    <footer class="float-end">
        Version: {{ version }}<br />
        © <a href="https://github.com/gfoidl">gfoidl</a>, {{ year }}
    </footer>
</template>

<style lang="less" scoped>
    footer {
        font-size: x-small;
    }
</style>

<!-- Classic Composition API way -->
<!-- <script lang="ts">
    import { defineComponent } from "vue";
    //-------------------------------------------------------------------------
    export default defineComponent({
        setup() {
            const version = __VERSION__;
            const year    = new Date().getFullYear();

            return {
                version,
                year
            };
        }
    });
</script> -->

<!-- New Composition API way: all top-level bindings are usable in the template -->
<script lang="ts" setup>
    const version = __VERSION__;
    const year    = new Date().getFullYear();
</script>
