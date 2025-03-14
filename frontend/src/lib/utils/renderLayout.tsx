import { defaultFuiComponentsMap } from "./fuiComponentsMap";

// Fui global css
import "./fui-globals.css";


import { generateScopedCSSVariables } from "@/lib/utils/generateScopedCSSVariables";

// Theme
import t1 from "@/app/testing/default-themes/t1.json";


export type LayoutConfig = {
    rowHeights: string[];
    colWidths: string[];
    gridGap: string;
    areas: string[][];
    components: {
        name: string;
    }[];
};

export const renderLayout = (layout: LayoutConfig, id: string) => {

    const { rowHeights, colWidths, gridGap, areas, components } = layout;

    // Generate scoped CSS variables
    const scopeClass = `page-${id}`;
    const scopedCSS = generateScopedCSSVariables(t1, scopeClass);

    return (
        <>
            <style>{scopedCSS}</style>

            <div
                className={`${scopeClass} w-full h-full fui-background`}
                style={{
                    display: "grid",
                    gridTemplateRows: rowHeights.join(" "),
                    gridTemplateColumns: colWidths.join(" "),
                    gridTemplateAreas: areas.map((row) => `"${row.join(" ")}"`).join(" "),
                    gap: gridGap,
                    padding: gridGap,
                    fontFamily: "Orbitron",
                }}
            >
                {components.map((component) => {
                    const Component = defaultFuiComponentsMap[component.name];
                    return (
                        <div
                            key={component.name}
                            style={{
                                gridArea: component.name,
                                // border: "1px solid #ccc"
                                width: "100%", // Ensure content stays within its grid area
                                height: "100%", // Ensure content stays within its grid area
                                // maxWidth: "100%", // Ensure content stays within its grid area
                                // maxHeight: "100%", // Ensure content does not exceed its grid height
                            }}
                        >
                            <Component />
                        </div>
                    )
                })}
            </div>
        </>
    );
};