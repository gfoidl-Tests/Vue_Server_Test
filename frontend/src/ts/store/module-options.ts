import { ModuleOptions } from "vuex-module-decorators/dist/types/moduleoptions";
import { Store }         from "vuex";
import vuexStore         from ".";
//-----------------------------------------------------------------------------
export function moduleOptions(moduleName: string, store?: Store<unknown>): ModuleOptions {
    store = store ?? vuexStore;

    const baseOptions: Partial<ModuleOptions> = {
        namespaced: true,
        name      : moduleName,
        dynamic   : true,
        store
    };

    if (__RUN_FROM_TEST__) {
        return baseOptions;
    }

    // https://github.com/championswimmer/vuex-module-decorators/issues/131
    if (store.hasModule(moduleName)) {
        console.debug(`store: module ${moduleName} is registered, unregister it`);
        store.unregisterModule(moduleName);
    }

    return {
        ...baseOptions,
        dynamic: true,
        store
    };
}
