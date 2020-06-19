// I like OOP and thought this should be a class, as it has a state, behavior
// and identity === class.
// But in JavaScript / TypeScript encapsulation is primarly done at the level
// of modules (i.e. files), so a class would be pure overhead by adding an
// artificial layer.
//-----------------------------------------------------------------------------
import { ref, computed, provide, inject } from "@vue/composition-api";
import GreetingService                    from "./greeting-service";
//-----------------------------------------------------------------------------
export function createUserStore(greetingServiceInjected?: GreetingService) {
    const nameRef           = ref("");
    const messageRef        = ref("");
    const messageHistoryRef = ref(new Array<string>());
    const greetingService   = greetingServiceInjected ?? new GreetingService();
    //-------------------------------------------------------------------------
    const name = computed({
        get: ()  => nameRef.value,
        set: val => nameRef.value = val
    });

    const message        = computed(() => messageRef.value);
    const messageHistory = computed(() => messageHistoryRef.value);
    //-------------------------------------------------------------------------
    async function hello(): Promise<void> {
        const message = await greetingService.hello(nameRef.value);

        messageRef.value = message;
        messageHistoryRef.value.push(message);

        console.debug("message set to", messageRef.value);
    }
    //-------------------------------------------------------------------------
    function removeFromHistory(index: number): void {
        const removed = messageHistoryRef.value.splice(index, 1);

        console.debug("Removed item from history (index, message):", index, removed);
    }
    //-------------------------------------------------------------------------
    function reset(): void {
        nameRef.value           = "";
        messageRef.value        = "";
        messageHistoryRef.value = [];
    }
    //-------------------------------------------------------------------------
    return {
        name,
        message,
        messageHistory,
        hello,
        removeFromHistory,
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
