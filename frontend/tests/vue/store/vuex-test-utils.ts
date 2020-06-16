import { VuexModule }                  from "vuex-module-decorators";
import { isEmpty, isEqual, cloneDeep } from 'lodash';
//-----------------------------------------------------------------------------
export function cloneState<TState>(storeModule: VuexModule): TState {
    // Due to getModule there is another level of indirection to get to the state
    // then it's wrapper-functions, so use the JSON-trick to get the raw-data
    const tmp      = (storeModule as any).store.state;
    let storeState = JSON.parse(JSON.stringify(tmp));
    let keys       = Object.keys(storeState);

    // If the storeState is like { user: { name: "", message: "" } }, so
    // unwrap the object
    if (keys.length === 1) {
        storeState = storeState[keys[0]];
        keys       = Object.keys(storeState);
    }

    return keys.reduce((state: TState, key: string) => {
        // skip private fields
        if (key.startsWith("_")) return state;

        // The store must be cast as indexable to get the value.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state as any)[key] = cloneDeep(storeState[key]);
        return state;
    }, {} as TState);
}
//-----------------------------------------------------------------------------
export function stateDiff<TState>(initialState: TState, storeModule: VuexModule): Partial<TState> | null {
    const tmp   = (storeModule as any).store.state;
    const state = JSON.parse(JSON.stringify(tmp));

    if (!state) {
        return null;
    }

    const storeState = cloneState<TState>(storeModule) as any;

    const result: any = Object.keys(initialState).reduce((diff: any, key: string) => {
        if (!storeState.hasOwnProperty(key)) {
            diff[key] = (initialState as any)[key];
        } else if (isEqual((initialState as any)[key], storeState[key])) {
            delete diff[key];
        }

        return diff;
    }, storeState);

    if (isEmpty(result)) {
        return null;
    }

    return result as TState;
}
