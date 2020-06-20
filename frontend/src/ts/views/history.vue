<template>
    <b-container>
        <b-row>
            <b-col id="historyList" v-if="history.length > 0">
                <h5>History of messages</h5>

                <ul>
                    <li v-for="(item, index) in history" :key="index" data-test="history">
                        {{ item.message }}
                        <b-button :id    ="'redoButton_' + index"
                                  @click ="redoHistory(index)"
                                  variant="outline-primary"
                                  size   ="sm"
                                  v-b-tooltip.hover
                                  :title ="'Redo with name \'' + item.name + '\''">
                            <b-icon-reply></b-icon-reply>
                        </b-button>
                        <b-button :id    ="'deleteButton_' + index"
                                  @click ="removeFromHistory(index)"
                                  variant="outline-secondary"
                                  size   ="sm"
                                  v-b-tooltip.hover
                                  title  ="Remove from history">
                            <!--<b-icon-trash></b-icon-trash>-->
                            <!-- This is an alternative to the above. Note: the componente must be imported! -->
                            <b-icon icon="trash"></b-icon>
                        </b-button>
                    </li>
                </ul>
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="less" scoped>
    li {
        list-style: square;
    }
</style>

<script lang="ts">
    import { defineComponent } from "@vue/composition-api";
    import { useUserStore }    from "@store/user/user";
    //-------------------------------------------------------------------------
    import { BIconReply, BIconTrash, BIcon } from "bootstrap-vue";
    //-------------------------------------------------------------------------
    const component = defineComponent({
        components: {
            BIconReply,
            BIconTrash,
            BIcon
        },
        setup() {
            const { history, removeFromHistory, redoHistory } = useUserStore();

            return {
                history,
                removeFromHistory,
                redoHistory
            };
        }
    });
    //-------------------------------------------------------------------------
    export default component;
</script>
