export function generateScopedCSSVariables(theme: any, scopeClass: string): string {
    const cssVars: string[] = [];
    Object.entries(theme).forEach(([category, values]) => {
        if (typeof values === 'object' && values !== null) {
            Object.entries(values).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    Object.entries(value).forEach(([subKey, subValue]) => {
                        cssVars.push(`.${scopeClass} { --${category}-${key}-${subKey}: ${subValue}; }`);
                    });
                } else {
                    cssVars.push(`.${scopeClass} { --${category}-${key}: ${value}; }`);
                }
            });
        }
    });
    return cssVars.join('\n');
}