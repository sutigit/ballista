import { z } from "zod";

export const layoutResponseSchema = z.object({
    type: z
        .enum(["div", "button", "header","paragraph", "section", "codeDisplay", "metricDisplay", "chartDisplay", "dataTableDisplay"])
        .describe("The type of the UI component"),
    label: z
        .string()
        .describe("The label of the UI component, used for buttons, headers and paragraphs"),
    flexContainer: z
        .object({
            container: z
                .enum(["flex", "inline-flex"])
                .describe("The type of flex container"),
            flexDirection: z
                .enum(["row", "row-reverse", "column", "column-reverse"])
                .describe("The direction of the flex container"),
            justifyContent: z
                .enum(["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"])
                .describe("The alignment of the flex container"),
            alignItems: z
                .enum(["flex-start", "flex-end", "center", "baseline", "stretch"])
                .describe("The alignment of the flex items"),
            gap: z
                .string()
                .describe("The gap between the flex items"),
        }),
    flexItem: z
        .object({
            flex: z
                .string()
                .describe("Shorthand for flex-grow, flex-shrink and flex-basis combined."),
            alignSelf: z
                .enum(["auto", "flex-start", "flex-end", "center", "baseline", "stretch"])
                .describe("The alignment of the flex item"),
        }),
    children: z
        .array(z.lazy((): any => layoutResponseSchema))
        .describe("Nested UI components"),
})
    .strict()
    .describe("Dynamically generated Fictional UI layout");