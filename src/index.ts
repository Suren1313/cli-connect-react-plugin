import { LinkProcessor, ComponentConfig, ComponentCode } from "@zeplin/cli";
import path from "path";
import pug from "pug";
import { readFile } from "fs-extra";
import { parse } from "react-docgen";

export default class implements LinkProcessor {
    lang = "React";
    supportedFileExtensions = [".js", ".jsx"];

    generateSnippet = pug.compileFile(path.join(__dirname, "template/snippet.pug"));

    async process(context: ComponentConfig): Promise<ComponentCode> {
        const file = await readFile(path.resolve(context.path));

        const reactDocs = parse(file);

        const snippet = this.generateSnippet(reactDocs);
        // TODO maybe generate a markdown propTable as description?
        const { description } = reactDocs;

        return { description, snippet };
    }

    supports(x: ComponentConfig): boolean {
        const fileExtension = path.extname(x.path);

        return this.supportedFileExtensions.includes(fileExtension);
    }

    getLang(): string {
        return this.lang;
    }
}
