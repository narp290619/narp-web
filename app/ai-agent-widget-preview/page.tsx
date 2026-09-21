"use client";

import {
    useState,
} from "react";

import {
    AgentWidget,
    type AgentWidgetTheme,
} from "@/components/ai-agent-widget";

const previewTheme: AgentWidgetTheme = {
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
        panel: "20px",
        message: "16px",
        button: "999px",
        input: "14px",
    },

    sizes: {
        button: 56,
        panelWidth: 380,
        panelHeight: 600,
    },
};

export default function AgentWidgetPreviewPage() {
    const [
        position,
        setPosition,
    ] = useState<
        "bottom-right" | "bottom-left"
    >("bottom-right");

    const [
        compact,
        setCompact,
    ] = useState(false);

    const theme: AgentWidgetTheme = compact
        ? {
            ...previewTheme,

            sizes: {
                ...previewTheme.sizes,
                button: 50,
                panelWidth: 340,
                panelHeight: 520,
            },
        }
        : previewTheme;

    return (
        <main
            style={{
                minHeight: "100vh",
                padding: "48px 24px",
                background:
                    "linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)",
                color: "#111827",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 900,
                    margin: "0 auto",
                }}
            >
                <div
                    style={{
                        marginBottom: 32,
                    }}
                >
                    <p
                        style={{
                            margin: "0 0 8px",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#64748b",
                        }}
                    >
                        AI Agent Widget
                    </p>

                    <h1
                        style={{
                            margin: "0 0 12px",
                            fontSize: 36,
                            lineHeight: 1.15,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        Widget Preview
                    </h1>

                    <p
                        style={{
                            maxWidth: 620,
                            margin: 0,
                            fontSize: 16,
                            lineHeight: 1.6,
                            color: "#64748b",
                        }}
                    >
                        This is a development playground for
                        the reusable AI Agent Widget. The widget
                        is currently using mock UI only and is
                        not connected to the AI backend.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: 16,
                    }}
                >
                    <section
                        style={{
                            padding: 20,
                            border: "1px solid #e2e8f0",
                            borderRadius: 16,
                            background: "#ffffff",
                        }}
                    >
                        <h2
                            style={{
                                margin: "0 0 16px",
                                fontSize: 15,
                            }}
                        >
                            Position
                        </h2>

                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                            }}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setPosition(
                                        "bottom-right"
                                    )
                                }
                                style={{
                                    flex: 1,
                                    padding: "10px 12px",
                                    borderRadius: 10,
                                    border:
                                        position ===
                                        "bottom-right"
                                            ? "2px solid #111827"
                                            : "1px solid #e2e8f0",
                                    background:
                                        "#ffffff",
                                    color: "#111827",
                                    cursor: "pointer",
                                    fontSize: 13,
                                }}
                            >
                                Bottom Right
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setPosition(
                                        "bottom-left"
                                    )
                                }
                                style={{
                                    flex: 1,
                                    padding: "10px 12px",
                                    borderRadius: 10,
                                    border:
                                        position ===
                                        "bottom-left"
                                            ? "2px solid #111827"
                                            : "1px solid #e2e8f0",
                                    background:
                                        "#ffffff",
                                    color: "#111827",
                                    cursor: "pointer",
                                    fontSize: 13,
                                }}
                            >
                                Bottom Left
                            </button>
                        </div>
                    </section>

                    <section
                        style={{
                            padding: 20,
                            border: "1px solid #e2e8f0",
                            borderRadius: 16,
                            background: "#ffffff",
                        }}
                    >
                        <h2
                            style={{
                                margin: "0 0 16px",
                                fontSize: 15,
                            }}
                        >
                            Size
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setCompact(
                                    (current) =>
                                        !current
                                )
                            }
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: 10,
                                border: "1px solid #e2e8f0",
                                background:
                                    compact
                                        ? "#111827"
                                        : "#ffffff",
                                color:
                                    compact
                                        ? "#ffffff"
                                        : "#111827",
                                cursor: "pointer",
                                fontSize: 13,
                            }}
                        >
                            {compact
                                ? "Use Standard Size"
                                : "Use Compact Size"}
                        </button>
                    </section>
                </div>

                <section
                    style={{
                        marginTop: 24,
                        padding: 24,
                        border: "1px solid #e2e8f0",
                        borderRadius: 16,
                        background: "#ffffff",
                    }}
                >
                    <h2
                        style={{
                            margin: "0 0 8px",
                            fontSize: 15,
                        }}
                    >
                        Current Configuration
                    </h2>

                    <pre
                        style={{
                            margin: 0,
                            overflowX: "auto",
                            fontSize: 12,
                            lineHeight: 1.6,
                            color: "#475569",
                        }}
                    >
{JSON.stringify(
    {
        position,
        size: compact
            ? "compact"
            : "standard",
        panelWidth:
            theme.sizes.panelWidth,
        panelHeight:
            theme.sizes.panelHeight,
        buttonSize:
            theme.sizes.button,
        agentId:
            "preview-agent",
    },
    null,
    2
)}
                    </pre>
                </section>

                <div
                    style={{
                        marginTop: 32,
                        minHeight: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #cbd5e1",
                        borderRadius: 20,
                        background:
                            "rgba(255,255,255,0.55)",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            color: "#64748b",
                        }}
                    >
                        <div
                            style={{
                                marginBottom: 8,
                                fontSize: 32,
                            }}
                        >
                            ✦
                        </div>

                        <p
                            style={{
                                margin: 0,
                                fontSize: 14,
                            }}
                        >
                            Website preview area
                        </p>

                        <p
                            style={{
                                margin:
                                    "6px 0 0",
                                fontSize: 12,
                            }}
                        >
                            Open the AI assistant
                            using the floating button.
                        </p>
                    </div>
                </div>
            </div>

            <AgentWidget
                agentId="preview-agent"
                name="NARP Assistant"
                subtitle="Customer Support"
                greeting="Hi! 👋 How can I help you today?"
                placeholder="Ask anything..."
                theme={theme}
                position={position}
                showToolActivity
                showPoweredBy
            />
        </main>
    );
}