/**
 * @file PlotMathEngine.ts
 * @description Centralized engine for processing mathematical blueprints and generating interactive plots.
 * Features include:
 * - Robust YAML-like parser for blueprint definitions.
 * - Dynamic mathematical evaluation sandbox with common engineering functions.
 * - Automatic Chart.js configuration generation for high-performance simulations.
**/

/**
 * Interface representing the structured data of a plotting blueprint.
 */
export interface PlotBlueprint {
    /** The title displayed on the control panel */
    title: string;
    /** The actual mathematical expression to evaluate (e.g., "sin(x)") */
    equation: string;
    /** Number of data points to sample (higher = smoother curve) */
    steps: number;
    /** Standard color code for the plot line */
    color: string;
    /** Dictionary of user-adjustable parameters (sliders) */
    parameters: Record<string, { label: string; value: number; min: number; max: number; step?: number }>;
    /** Dictionary of intermediate mathematical variables used in the equation */
    vars: Record<string, string>;
    /** Configuration for X and Y axes (titles, ranges) */
    axis: {
        x: { title?: string; min?: number; max?: number };
        y: { title?: string; min?: number; max?: number };
    };
    /** Function to initialize the Chart.js configuration */
    init?: (params: any) => any;
}

/**
 * Core service responsible for turning declarative blueprints into functional plots.
 */
export class PlotMathEngine {
    /**
     * Parses a YAML-like blueprint string into a structured PlotBlueprint object.
     * This parser is designed to be indentation-agnostic and robust against varying input styles.
     * 
     * @param raw The raw string content from the blueprint:plot code block.
     * @returns A PlotBlueprint object filled with the parsed data.
     */
    public static parseBlueprint(raw: string): PlotBlueprint {
        const lines = raw.split(/\r?\n/);
        const config: PlotBlueprint = {
            title: '',
            equation: '0',
            steps: 500,
            color: 'rgb(255, 149, 0)',
            parameters: {},
            vars: {},
            axis: { x: {}, y: {} }
        };

        let currentSection = '';

        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return; // Ignore empty lines and comments

            // Check if this line starts a new section (e.g., "params:", "vars:")
            const isSectionHeader = /^\S/.test(line);

            if (trimmed.includes(':') && isSectionHeader) {
                const colonIndex = line.indexOf(':');
                const key = line.substring(0, colonIndex).trim().toLowerCase();
                const val = line.substring(colonIndex + 1).trim();

                if (key === 'params' || key === 'parameters') {
                    currentSection = 'params';
                } else if (key === 'vars' || key === 'variables') {
                    currentSection = 'vars';
                } else if (key === 'axis') {
                    currentSection = 'axis';
                } else {
                    currentSection = ''; // Root level keys
                    if (key === 'title') config.title = val;
                    else if (key === 'equation') config.equation = val;
                    else if (key === 'steps') config.steps = parseInt(val) || 500;
                    else if (key === 'color') config.color = val;
                }
            } else if (trimmed.includes(':')) {
                // Secondary level keys (nested under params, vars, or axis)
                const colonIndex = line.indexOf(':');
                const key = line.substring(0, colonIndex).trim();
                const val = line.substring(colonIndex + 1).trim();

                // Detection for object-style values like { label: "...", value: 10 }
                const objMatch = val.match(/\{(.*)\}/);

                if (objMatch) {
                    const props: any = {};
                    objMatch[1].split(',').forEach(p => {
                        const [propKey, propVal] = p.split(':').map(s => s.trim());
                        if (propKey && propVal) {
                            let cleanVal: any = propVal.replace(/['"]/g, '').trim();
                            if (!isNaN(Number(cleanVal))) cleanVal = Number(cleanVal);
                            props[propKey] = cleanVal;
                        }
                    });

                    if (currentSection === 'params') config.parameters[key] = props;
                    if (currentSection === 'axis' && (key === 'x' || key === 'y')) (config.axis as any)[key] = props;
                } else if (currentSection === 'vars') {
                    config.vars[key] = val; // Store intermediate math formulas
                }
            }
        });

        // Bind the initialization logic so the UI can easily create the chart
        config.init = (params: any) => this.generateChartConfig(config, params);

        return config;
    }

    /**
     * Generates a Chart.js compatible configuration object from a blueprint and set of parameters.
     * This is where the mathematical evaluation actually occurs.
     * 
     * @param blueprint The parsed blueprint data.
     * @param params The numeric values from the sliders.
     * @returns An object formatted for the Chart.js constructor.
     */
    private static generateChartConfig(blueprint: PlotBlueprint, params: any) {
        const data: any[] = [];
        const xMin = !isNaN(blueprint.axis.x.min as any) ? blueprint.axis.x.min! : 0;
        const xMax = !isNaN(blueprint.axis.x.max as any) ? blueprint.axis.x.max! : 10;
        const range = xMax - xMin;

        /**
         * MATH SANDBOX
         * We inject standard JS Math functions and constants so they can be 
         * used directly in the blueprint equation without the "Math." prefix.
         */
        const math = {
            sin: Math.sin, cos: Math.cos, tan: Math.tan,
            exp: Math.exp, sqrt: Math.sqrt, pow: Math.pow,
            abs: Math.abs, PI: Math.PI, E: Math.E,
            log: Math.log, log10: Math.log10,
            floor: Math.floor, ceil: Math.ceil, round: Math.round,
            min: Math.min, max: Math.max
        };

        const paramKeys = Object.keys(params);
        const paramValues = Object.values(params);
        const mathKeys = Object.keys(math);
        const mathValues = Object.values(math);

        try {
            /** 
             * VAR BRIDGE
             * Pre-calculates any intermediate variable logic from the 'vars' section.
             */
            let varLogic = '';
            for (const vKey in blueprint.vars) {
                varLogic += `const ${vKey} = ${blueprint.vars[vKey]}; `;
            }

            /**
             * DYNAMIC EVALUATOR
             * Creates a sandboxed function that handles the physics/math logic.
             * It receives the current 'x', slider values, and math library as arguments.
             */
            const evalFn = new Function('x', ...paramKeys, ...mathKeys, `
                ${varLogic}
                return ${blueprint.equation};
            `);

            // Sampling loop: run the calculation for every step across the X range
            for (let i = 0; i <= blueprint.steps; i++) {
                const x = xMin + (range * i) / blueprint.steps;
                const y = evalFn(x, ...paramValues, ...mathValues);
                data.push({ x, y });
            }
        } catch (e) {
            console.error('Math Engine Evaluation Error:', e);
            throw new Error(`Equation Error: ${e}`);
        }

        /**
         * Standard Engineering Aesthetic
         * Returns a Chart.js object with custom styling (dark glass, vibrant colors, mono fonts).
         */
        return {
            type: 'line',
            data: {
                datasets: [{
                    label: blueprint.title || 'Plot',
                    data: data,
                    borderColor: blueprint.color,
                    backgroundColor: blueprint.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
                    borderWidth: 3,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: blueprint.axis.x.title || 'X', color: 'rgba(255,255,255,0.6)', font: { family: 'JetBrains Mono' } },
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'JetBrains Mono' } },
                        min: xMin,
                        max: xMax
                    },
                    y: {
                        title: { display: true, text: blueprint.axis.y.title || 'Y', color: 'rgba(255,255,255,0.6)', font: { family: 'JetBrains Mono' } },
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: 'rgba(255,255,255,0.4)', font: { family: 'JetBrains Mono' } },
                        min: !isNaN(blueprint.axis.y.min as any) ? blueprint.axis.y.min : undefined,
                        max: !isNaN(blueprint.axis.y.max as any) ? blueprint.axis.y.max : undefined
                    }
                }
            }
        };
    }
}
