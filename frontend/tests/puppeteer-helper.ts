import * as fs           from "fs";
import * as path         from "path";
import { ElementHandle } from "puppeteer";
//-----------------------------------------------------------------------------
export default class PuppeteerHelper {
    public static async takeScreenshot(name: string, outputDir = "screenshots-e2e"): Promise<void> {
        PuppeteerHelper.ensureDirExists(outputDir);
        await page.screenshot({ path: path.resolve(outputDir, name) });
    }
    //-------------------------------------------------------------------------
    public static async isVisible(element: ElementHandle<Element>) {
        const boxModel = await element.boxModel();

        return boxModel?.width === 0
            && boxModel.height === 0;
    }
    //-------------------------------------------------------------------------
    public static sleep(ms: number): Promise<void> {
        return new Promise<void>(res => {
            setTimeout(() => res(), ms);
        });
    }
    //-------------------------------------------------------------------------
    private static ensureDirExists(dir: string): void {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
}
