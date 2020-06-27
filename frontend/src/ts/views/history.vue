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
                                  v-b-tooltip.hover.html="redoTooltip(item)">
                            <b-icon-reply></b-icon-reply>
                        </b-button>
                        <b-button :id    ="'redoSignalRButton_' + index"
                                  @click ="redoHistoryWithSignalR(index)"
                                  variant="outline-primary"
                                  size   ="sm"
                                  v-b-tooltip.hover.html="redoSignalRTooltip(item)">
                            <b-icon-reply-fill></b-icon-reply-fill>
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
    import { defineComponent, inject }    from "@vue/composition-api";
    import { useUserStore, HistoryEntry } from "@store/user/user";
    import GreetingHub                    from "@hub/greeting-hub";
    //-------------------------------------------------------------------------
    import { BIconReply, BIconTrash, BIconReplyFill, BIcon } from "bootstrap-vue";
    //-------------------------------------------------------------------------
    const component = defineComponent({
        components: {
            BIconReply,
            BIconTrash,
            BIconReplyFill,
            BIcon
        },
        setup() {
            const { history, removeFromHistory, redoHistory } = useUserStore();
            const greetingHub: GreetingHub | null             = inject<GreetingHub>("greetingHub", null! as GreetingHub);
            //-----------------------------------------------------------------
            function redoTooltip(item: HistoryEntry): string {
                return `Redo with name <strong>${item.name}</strong>`;
            }
            //-----------------------------------------------------------------
            function redoSignalRTooltip(item: HistoryEntry): string {
                return `Redo with SignalR with name <strong>${item.name}</strong>`;
            }
            //-----------------------------------------------------------------
            function redoHistoryWithSignalR(index: number) {
                greetingHub?.redoHistory(index);
            }
            //-----------------------------------------------------------------
            return {
                history,
                removeFromHistory,
                redoHistory,
                redoHistoryWithSignalR,
                redoTooltip,
                redoSignalRTooltip
            };
        }
    });
    //-------------------------------------------------------------------------
    export default component;
</script>
