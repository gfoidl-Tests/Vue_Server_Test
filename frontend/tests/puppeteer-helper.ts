import * as fs                  from "fs";
import * as path                from "path";
import { ElementHandle }        from "puppeteer";
import { toMatchImageSnapshot } from "jest-image-snapshot";
//-----------------------------------------------------------------------------
expect.extend({ toMatchImageSnapshot });
//-----------------------------------------------------------------------------
export default class PuppeteerHelper {
    public static async takeScreenshot(name: string, outputDir = "screenshots-e2e"): Promise<unknown> {
        PuppeteerHelper.ensureDirExists(outputDir);
        return await page.screenshot({ path: path.resolve(outputDir, name) });
    }
    //-------------------------------------------------------------------------
    public static compareScreenshotToSnapshot(screenshot: unknown, name: string, diffDir = "screenshots-e2e"): void {
        expect(screenshot).toMatchImageSnapshot({
            customSnapshotsDir      : path.resolve("tests", "__image_snapshots__"),     // base dir is /frontend
            customSnapshotIdentifier: name,
            customDiffDir           : diffDir,
            failureThresholdType    : "percent",
            failureThreshold        : 0.5
        });
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
