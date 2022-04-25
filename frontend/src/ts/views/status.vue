<template>
    <c-container v-show="name.length > 0">
        <c-row>
            <c-col id="nameCol">
                Name: <strong>{{ name }}</strong>
            </c-col>
        </c-row>
        <c-row>
            <c-col id="messageCol">
                Message: <strong>{{ message }}</strong>
            </c-col>
        </c-row>
    </c-container>
</template>

<style lang="less" scoped>
    strong {
        color: #0094ff;
    }
</style>

<script lang="ts" setup>
    import { useUserStore }           from "@store/user/user";
    import { CContainer, CRow, CCol } from "@coreui/vue";
    //-------------------------------------------------------------------------
    const { name, message } = useUserStore();
</script>
