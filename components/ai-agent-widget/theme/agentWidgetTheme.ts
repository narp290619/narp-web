import {
    agentWidgetTokens,
} from "./agentWidgetTokens";

export type AgentWidgetTheme = {
    primary: string;
    primaryForeground: string;

    background: string;
    surface: string;
    surfaceMuted: string;

    text: string;
    textMuted: string;

    border: string;

    userMessage: string;
    userMessageForeground: string;

    assistantMessage: string;
    assistantMessageForeground: string;

    error: string;
    errorBackground: string;

    radius: {
        panel: string;
        message: string;
        button: string;
        input: string;
    };

    sizes: {
        button: number;
        panelWidth: number;
        panelHeight: number;
    };
};

export const defaultAgentWidgetTheme: AgentWidgetTheme = {
    primary: "#111827",
    primaryForeground: "#ffffff",

    background: "#ffffff",
    surface: "#f8fafc",
    surfaceMuted: "#f1f5f9",

    text: "#111827",
    textMuted: "#64748b",

    border: "#e2e8f0",

    userMessage: "#111827",
    userMessageForeground: "#ffffff",

    assistantMessage: "#f1f5f9",
    assistantMessageForeground: "#111827",

    error: "#dc2626",
    errorBackground: "#fef2f2",

    radius: {
        panel: `${agentWidgetTokens.radius.xl}px`,
        message: `${agentWidgetTokens.radius.lg}px`,
        button: `${agentWidgetTokens.radius.pill}px`,
        input: `${agentWidgetTokens.radius.lg}px`,
    },

    sizes: {
        button: agentWidgetTokens.sizes.button,
        panelWidth: agentWidgetTokens.sizes.panelWidth,
        panelHeight: agentWidgetTokens.sizes.panelHeight,
    },
};