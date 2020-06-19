<template>
    <b-container>
        <b-row>
            <b-col id="historyList" v-if="messageHistory.length > 0">
                <h5>History of messages</h5>

                <ul>
                    <li v-for="(item, index) in messageHistory" :key="index" data-test="history">
                        {{ item }}
                        <b-button :id    ="'deleteButton_' + index"
                                  @click ="removeFromHistory(index)"
                                  variant="outline-secondary"
                                  size   ="sm">
                            Remove
                        </b-button>
                    </li>
                </ul>
            </b-col>
        </b-row>
    </b-container>
</template>

<style lang="less">
    li {
        list-style: square;
    }
</style>

<script lang="ts">
    import { defineComponent } from "@vue/composition-api";
    import { useUserStore }    from "@store/user/user";
    //-------------------------------------------------------------------------
    const component = defineComponent({
        setup() {
            const { messageHistory, removeFromHistory } = useUserStore();

            return {
                messageHistory,
                removeFromHistory
            };
        }
    });
    //-------------------------------------------------------------------------
    export default component;
</script>
