// I like OOP and thought this should be a class, as it has a state, behavior
// and identity === class.
// But in JavaScript / TypeScript encapsulation is primarly done at the level
// of modules (i.e. files), so a class would be pure overhead by adding an
// artificial layer.
//-----------------------------------------------------------------------------
import { ref, computed } from "@vue/composition-api";
import GreetingService   from "./greeting-service";
//-----------------------------------------------------------------------------
const nameRef         = ref("");
const messageRef      = ref("");
const greetingService = new GreetingService();
//-----------------------------------------------------------------------------
const name = computed({
    get: ()  => nameRef.value,
    set: val => nameRef.value = val
});

const message = computed(() => messageRef.value);
//-----------------------------------------------------------------------------
async function hello(): Promise<void> {
    messageRef.value = await greetingService.hello(nameRef.value);

    console.debug("message set to", messageRef.value);
}
//-----------------------------------------------------------------------------
function reset(): void {
    nameRef.value    = "";
    messageRef.value = "";
}
//-----------------------------------------------------------------------------
export default {
    name,
    message,
    hello,
    reset
};
