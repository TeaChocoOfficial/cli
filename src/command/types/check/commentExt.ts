// -Path: "cli/src/command/types/format/commentExt.ts"

export interface CommentExtension {
    /**
     * @description Comment start
     * @example "<!--"
     */
    start: string;
    /**
     * @description Comment end
     * @example "-->"
     */
    end?: string;

    /**
     * @description File extensions to use this comment
     * @example ["html", "css"]
     */
    extensions: string[];
}
