// Inspired from https://stackoverflow.com/a/60012847/347870
//-----------------------------------------------------------------------------
import Vue, { VueConstructor, ComponentOptions } from "vue";
import { mount }                                 from "@vue/test-utils";
//-----------------------------------------------------------------------------
export function mountComposition<V extends Vue>(component: VueConstructor<V>, localVue: typeof Vue, cb: () => any) {
    const componentOptions = {
        setup() {
            return cb();
        },
        render(h) {
            return h(component);
        }
    } as ComponentOptions<V>;

    return mount(componentOptions, { localVue });
}
