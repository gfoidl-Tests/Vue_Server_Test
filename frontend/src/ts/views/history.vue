<template>
    <c-container>
        <c-row>
            <c-col id="historyList" v-if="history.length > 0">
                <h5>History of messages</h5>

                <ul>
                    <li v-for="(item, index) in history" :key="index" data-test="history">
                        {{ item.message }}
                        <c-button :id    ="'redoButton_' + index"
                                  @click ="redoHistory(index)"
                                  color  ="primary"
                                  variant="outline"
                                  size   ="sm"
                                  v-c-tooltip="redoTooltip(item)">
                            <c-icon icon="cilActionRedo"></c-icon>
                        </c-button>
                        <c-button :id    ="'redoSignalRButton_' + index"
                                  @click ="redoHistoryWithSignalR(index)"
                                  color  ="primary"
                                  variant="outline"
                                  size   ="sm"
                                  v-c-tooltip="redoSignalRTooltip(item)">
                            <c-icon icon="cilActionUndo"></c-icon>
                        </c-button>
                        <c-button :id    ="'deleteButton_' + index"
                                  @click ="removeFromHistory(index)"
                                  color  ="secondary"
                                  variant="outline"
                                  size   ="sm"
                                  v-c-tooltip="'Remove from history'">
                            <c-icon icon="cilTrash"></c-icon>
                        </c-button>
                    </li>
                </ul>
            </c-col>
        </c-row>
    </c-container>
</template>

<style lang="less" scoped>
    li {
        list-style: square;

        button {
            width: 32px;
        }
    }
</style>

<script lang="ts">
    import { defineComponent, inject }    from "vue";
    import { useUserStore, HistoryEntry } from "@store/user/user";
    import GreetingHub                    from "@hub/greeting-hub";
    //-------------------------------------------------------------------------
    export default defineComponent({
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
</script>
