import { z } from "zod";

export const themeResponseSchema = z.object({
    colors: z.object({
        primary: z.string().describe("Primary color for the theme"),
        secondary: z.string().describe("Secondary color for the theme"),
        accent: z.string().describe("Accent color for the theme"),
        background: z.string().describe("Background color for components"),
        surface: z.string().describe("Background color for the whole layout"),
        success: z.string().describe("Color for success text or components"),
        warning: z.string().describe("Color for warning text or components"),
        error: z.string().describe("Color for error text or components"),
        text: z.object({
            primary: z.string().describe("Primary text color"),
            secondary: z.string().describe("Secondary text color, should be opposite of primary"),
        }),
    })
        .describe("Color palette that fits the description"),

    typography: z.object({
        fontFamily: z.string(),
        fontSizes: z.object({
            sm: z.string(),
            md: z.string(),
            lg: z.string(),
        }).describe("small, medium and large font sizes with big size differences"),
        fontWeights: z.object({
            regular: z.number(),
            medium: z.number(),
            bold: z.number(),
        }),
    })
        .describe("Typography styles that fits the description"),

    padding: z.object({
        none: z.string(),
        xs: z.string(),
        sm: z.string(),
        md: z.string(),
        lg: z.string(),
        xl: z.string(),
    })
        .describe("xs, sm, md, lg and xl padding values for components"),

    borders: z.object({
        widths: z.object({
            thin: z.string(),
            medium: z.string(),
            thick: z.string(),
        }),
    })
        .describe("Border styles for the theme"),

    radius: z.object({
        none: z.string(),
        sm: z.string(),
        md: z.string(),
        lg: z.string(),
        full: z.string(),
    })
        .describe("Border radius for components"),
})
    .strict()
    .describe("Dynamically generated theme and styles for fictional UI layout");