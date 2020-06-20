<template>
    <footer class="float-right">
        Version: {{ version }}<br />
        © <a href="https://github.com/gfoidl">gfoidl</a>, {{ year }}
    </footer>
</template>

<style lang="less" scoped>
    footer {
        font-size: x-small;
    }
</style>

<script lang="ts">
    import { defineComponent } from "@vue/composition-api";
    //-------------------------------------------------------------------------
    const componenet = defineComponent({
        setup() {
            const version = __VERSION__;
            const year    = new Date().getFullYear();

            return {
                version,
                year
            };
        }
    });
    //-------------------------------------------------------------------------
    export default componenet;
</script>
