// I like OOP and thought this should be a class, as it has a state, behavior
// and identity === class.
// But in JavaScript / TypeScript encapsulation is primarly done at the level
// of modules (i.e. files), so a class would be pure overhead by adding an
// artificial layer.
//-----------------------------------------------------------------------------
import { ref, computed, provide, inject } from "@vue/composition-api";
import GreetingService                    from "./greeting-service";
//-----------------------------------------------------------------------------
export interface HistoryEntry {
    name   : string;
    message: string;
}
//-----------------------------------------------------------------------------
export function createUserStore(greetingServiceInjected?: GreetingService) {
    const nameRef         = ref("");
    const messageRef      = ref("");
    const historyRef      = ref(new Array<HistoryEntry>());
    const greetingService = greetingServiceInjected ?? new GreetingService();
    //-------------------------------------------------------------------------
    const name = computed({
        get: ()  => nameRef.value,
        set: val => nameRef.value = val
    });

    const message = computed(() => messageRef.value);
    const history = computed(() => historyRef.value);
    //-------------------------------------------------------------------------
    async function hello(): Promise<void> {
        const message = await greetingService.hello(nameRef.value);

        messageRef.value = message;
        historyRef.value.push({ name: nameRef.value, message });

        console.debug("message set to", messageRef.value);
    }
    //-------------------------------------------------------------------------
    function removeFromHistory(index: number): void {
        const removed = historyRef.value.splice(index, 1);

        console.debug("Removed item from history (index, item):", index, removed);
    }
    //-------------------------------------------------------------------------
    async function redoHistory(index: number): Promise<void> {
        if (index >= history.value.length) return;

        const { name } = history.value[index];
        nameRef.value  = name;

        await hello();
    }
    //-------------------------------------------------------------------------
    function addToHistory(historyEntry: HistoryEntry) {
        historyRef.value.push(historyEntry);
    }
    //-------------------------------------------------------------------------
    function reset(): void {
        nameRef.value    = "";
        messageRef.value = "";
        historyRef.value = [];
    }
    //-------------------------------------------------------------------------
    return {
        name,
        message,
        history,
        hello,
        removeFromHistory,
        redoHistory,
        addToHistory,
        reset
    };
}
//-----------------------------------------------------------------------------
// Note: declare is optional
export declare type UserStore = ReturnType<typeof createUserStore>;
//-----------------------------------------------------------------------------
// Define a unique key
const key = Symbol();
//-----------------------------------------------------------------------------
export function provideUserStore(greetingService?: GreetingService) {
    provide(key, createUserStore(greetingService));
}
//-----------------------------------------------------------------------------
export function useUserStore() {
    return inject(key) as UserStore;
}
