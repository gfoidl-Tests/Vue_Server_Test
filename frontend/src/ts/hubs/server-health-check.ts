import Axios from "axios";
//-----------------------------------------------------------------------------
export default async function isServerHealthy(): Promise<boolean> {
    try {
        const url = __BASE_URL__ + "health";
        const result = await Axios.get<string>(url);

        return result.status === 200;
    } catch (e) {
        return false;
    }
}
