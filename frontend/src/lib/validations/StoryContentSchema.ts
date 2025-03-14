import { z } from "zod";

export const storyContentResponseSchema = z.object({
    metricDisplay: z
        .object({
            labels: z.array(z.string()).describe("List of labels for the metric display"),
            values: z.array(z.number()).describe("List of values for the metric display"),
        })
        .describe("Fictional metric display that has labels and values that fits the instructions"),
    chartDisplay: z
        .object({
            labels: z.array(z.string()).describe("5-20 items of 1-dimensional array of labels for the chart"),
            values: z.array(z.number()).describe("5-20 items 1-dimensional array of values for the chart"),
            chartType: z.enum(["line", "bar", "radar", "doughnut", "polarArea", "pie"]).describe("The type of the chart"),
            chartShape: z.enum(["sine", "random", "exponential"]).describe("The shape of the chart"),
        })
        .describe("Fictional chart display that has labels and values that fits the instructions"),
    dataTableDisplay: z
        .object({
            headers: z
                .array(z.string())
                .describe("Header lables for the data table"),
            body: z
                .array(z.array(z.string()).describe("Columns of data for the data table"))
                .describe("Rows of data for the data table"),
        })
        .describe("Fictional data table display that has some headers and body content that fits the instructions"),
    codeDisplay: z
        .object({
            content: z
                .string()
                .describe("Some fictional code jargon"),
        })
        .describe("Fictional code display that has some code content that fits the instructions"),
})
    .strict()
    .describe("Dynamically generated fictional text content");