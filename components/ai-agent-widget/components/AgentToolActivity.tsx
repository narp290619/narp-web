import {
    Check,
    CircleDot,
    Headphones,
    Package,
    RotateCcw,
    Search,
    Ticket,
    Truck,
} from "lucide-react";

import type {
    AgentToolCall,
} from "../hooks/useAgentWidget";

type AgentToolActivityProps = {
    toolCalls: AgentToolCall[];
    isLoading?: boolean;
};

type ToolInfo = {
    label: string;
    completedLabel: string;
    icon: "search" | "package" | "truck" | "return" | "ticket" | "human" | "default";
};

function getToolInfo(
    tool: AgentToolCall,
): ToolInfo {
    const name =
        tool.name ??
        tool.tool ??
        "";

    switch (name) {
        case "getProductInformation":
            return {
                label: "Checking product information",
                completedLabel: "Product information checked",
                icon: "search",
            };

        case "getOrderStatus":
            return {
                label: "Checking order status",
                completedLabel: "Order status checked",
                icon: "package",
            };

        case "getShippingInformation":
            return {
                label: "Looking up shipping details",
                completedLabel: "Shipping details checked",
                icon: "truck",
            };

        case "getReturnPolicy":
            return {
                label: "Checking return policy",
                completedLabel: "Return policy checked",
                icon: "return",
            };

        case "createSupportTicket":
            return {
                label: "Creating support ticket",
                completedLabel: "Support ticket created",
                icon: "ticket",
            };

        case "escalateToHuman":
            return {
                label: "Connecting you to a human",
                completedLabel: "Human support contacted",
                icon: "human",
            };

        default:
            return {
                label: "Working on your request",
                completedLabel: "Request processed",
                icon: "default",
            };
    }
}

function ToolIcon({
    type,
}: {
    type: ToolInfo["icon"];
}) {
    switch (type) {
        case "search":
            return (
                <Search
                    size={13}
                    strokeWidth={2}
                />
            );

        case "package":
            return (
                <Package
                    size={13}
                    strokeWidth={2}
                />
            );

        case "truck":
            return (
                <Truck
                    size={13}
                    strokeWidth={2}
                />
            );

        case "return":
            return (
                <RotateCcw
                    size={13}
                    strokeWidth={2}
                />
            );

        case "ticket":
            return (
                <Ticket
                    size={13}
                    strokeWidth={2}
                />
            );

        case "human":
            return (
                <Headphones
                    size={13}
                    strokeWidth={2}
                />
            );

        default:
            return (
                <CircleDot
                    size={13}
                    strokeWidth={2}
                />
            );
    }
}

function getToolResult(
    tool: AgentToolCall,
): Record<string, unknown> | null {
    if (
        !tool.result ||
        typeof tool.result !== "object" ||
        Array.isArray(tool.result)
    ) {
        return null;
    }

    return tool.result as Record<string, unknown>;
}

function getStringValue(
    result: Record<string, unknown>,
    keys: string[],
): string | null {
    for (const key of keys) {
        const value = result[key];

        if (
            typeof value === "string" &&
            value.trim().length > 0
        ) {
            return value.trim();
        }

        if (
            typeof value === "number"
        ) {
            return String(value);
        }
    }

    return null;
}

function formatFirestoreTimestamp(
    value: unknown,
): string | null {
    if (
        !value ||
        typeof value !== "object" ||
        Array.isArray(value)
    ) {
        return null;
    }

    const timestamp =
        value as Record<string, unknown>;

    const seconds =
        typeof timestamp._seconds === "number"
            ? timestamp._seconds
            : null;

    if (seconds === null) {
        return null;
    }

    const date =
        new Date(seconds * 1000);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric",
        },
    ).format(date);
}

function ProductResultCard({
    tool,
}: {
    tool: AgentToolCall;
}) {
    const result =
        getToolResult(tool);

    if (!result) {
        return null;
    }

    const product =
        result.product;

    if (
        !product ||
        typeof product !== "object" ||
        Array.isArray(product)
    ) {
        return null;
    }

    const productData =
        product as Record<string, unknown>;

    const name =
        getStringValue(
            productData,
            [
                "name",
                "productName",
                "title",
            ],
        );

    const price =
        getStringValue(
            productData,
            [
                "price",
                "productPrice",
                "amount",
            ],
        );

    const currency =
        getStringValue(
            productData,
            [
                "currency",
            ],
        );

    const description =
        getStringValue(
            productData,
            [
                "description",
                "details",
                "summary",
            ],
        );

    const features =
        productData.features;

    const featureList =
        Array.isArray(features)
            ? features.filter(
                (
                    feature,
                ): feature is string =>
                    typeof feature ===
                    "string" &&
                    feature.trim()
                        .length > 0,
            )
            : [];

    if (
        !name &&
        !price &&
        !description &&
        featureList.length === 0
    ) {
        return null;
    }

    return (
        <div className="ai-agent-widget__product-card">
            <div className="ai-agent-widget__product-card-header">
                <div>
                    <div className="ai-agent-widget__product-card-name">
                        {name ??
                            "Product"}
                    </div>

                    {price && (
                        <div className="ai-agent-widget__product-card-price">
                            {currency ===
                                "PHP"
                                ? "₱"
                                : currency
                                    ? `${currency} `
                                    : ""}
                            {price}
                        </div>
                    )}
                </div>
            </div>

            {description && (
                <div className="ai-agent-widget__product-card-description">
                    {description}
                </div>
            )}

            {featureList.length > 0 && (
                <div className="ai-agent-widget__product-card-features">
                    {featureList.map(
                        (
                            feature,
                            featureIndex,
                        ) => (
                            <span
                                key={`${feature}-${featureIndex}`}
                                className="ai-agent-widget__product-card-feature"
                            >
                                {feature}
                            </span>
                        ),
                    )}
                </div>
            )}
        </div>
    );
}

function OrderStatusResultCard({
    tool,
}: {
    tool: AgentToolCall;
}) {
    const result =
        getToolResult(tool);

    console.log(
        "AI ORDER RESULT:",
        result
    );

    if (!result) {
        return null;
    }

    const order =
        result.order;

    if (
        !order ||
        typeof order !== "object" ||
        Array.isArray(order)
    ) {
        return null;
    }

    const orderData =
        order as Record<string, unknown>;

    console.log(
        "AI ESTIMATED DELIVERY:",
        orderData.estimatedDelivery
    );

    const orderNumber =
        getStringValue(
            orderData,
            [
                "orderNumber",
                "orderId",
                "id",
                "number",
            ],
        );

    const status =
        getStringValue(
            orderData,
            [
                "status",
                "orderStatus",
            ],
        );

    const estimatedDelivery =
        formatFirestoreTimestamp(
            orderData.estimatedDelivery,
        );

    if (
        !orderNumber &&
        !status &&
        !estimatedDelivery
    ) {
        return null;
    }

    const formattedStatus =
        status
            ? status
                .replaceAll("_", " ")
                .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                )
            : null;

    return (
        <div className="ai-agent-widget__order-card">
            <div className="ai-agent-widget__order-card-header">
                <div className="ai-agent-widget__order-card-icon">
                    <Package
                        size={16}
                        strokeWidth={2}
                    />
                </div>

                <div className="ai-agent-widget__order-card-title">
                    <div className="ai-agent-widget__order-card-label">
                        Order
                    </div>

                    <div className="ai-agent-widget__order-card-number">
                        #{orderNumber ?? "—"}
                    </div>
                </div>
            </div>

            {formattedStatus && (
                <div className="ai-agent-widget__order-card-status">
                    <span className="ai-agent-widget__order-card-status-dot" />

                    <span>
                        {formattedStatus}
                    </span>
                </div>
            )}

            {estimatedDelivery && (
                <div className="ai-agent-widget__order-card-delivery">
                    <div className="ai-agent-widget__order-card-delivery-label">
                        Estimated delivery
                    </div>

                    <div className="ai-agent-widget__order-card-delivery-value">
                        {estimatedDelivery}
                    </div>
                </div>
            )}
        </div>
    );
}

function ShippingResultCard({
    tool,
}: {
    tool: AgentToolCall;
}) {
    const result =
        getToolResult(tool);

    if (!result) {
        return null;
    }

    const country =
        getStringValue(
            result,
            ["country"],
        );

    const cost =
        getStringValue(
            result,
            ["cost"],
        );

    const estimatedDays =
        getStringValue(
            result,
            [
                "estimatedDays",
                "estimatedDelivery",
                "deliveryTime",
            ],
        );

    const available =
        result.available === true;

    if (
        !country &&
        !cost &&
        !estimatedDays
    ) {
        return null;
    }

    return (
        <div className="ai-agent-widget__shipping-card">
            <div className="ai-agent-widget__shipping-card-header">
                <div className="ai-agent-widget__shipping-card-icon">
                    <Truck
                        size={16}
                        strokeWidth={2}
                    />
                </div>

                <div className="ai-agent-widget__shipping-card-title">
                    <div className="ai-agent-widget__shipping-card-label">
                        Shipping
                    </div>

                    <div className="ai-agent-widget__shipping-card-country">
                        {country ??
                            "Shipping information"}
                    </div>
                </div>
            </div>

            {available && cost && (
                <div className="ai-agent-widget__shipping-card-cost">
                    <div className="ai-agent-widget__shipping-card-cost-label">
                        Shipping cost
                    </div>

                    <div className="ai-agent-widget__shipping-card-cost-value">
                        {cost}
                    </div>
                </div>
            )}

            {estimatedDays && (
                <div className="ai-agent-widget__shipping-card-delivery">
                    <div className="ai-agent-widget__shipping-card-delivery-label">
                        Delivery time
                    </div>

                    <div className="ai-agent-widget__shipping-card-delivery-value">
                        {estimatedDays}
                    </div>
                </div>
            )}
        </div>
    );
}

function ReturnPolicyResultCard({
    tool,
}: {
    tool: AgentToolCall;
}) {
    const result =
        getToolResult(tool);

    if (!result) {
        return null;
    }

    const policy =
        result.policy;

    if (
        !policy ||
        typeof policy !== "object" ||
        Array.isArray(policy)
    ) {
        return null;
    }

    const policyData =
        policy as Record<string, unknown>;

    const returnWindow =
        getStringValue(
            policyData,
            ["returnWindow"],
        );

    const condition =
        getStringValue(
            policyData,
            ["condition"],
        );

    const exclusions =
        getStringValue(
            policyData,
            ["exclusions"],
        );

    const refund =
        getStringValue(
            policyData,
            ["refund"],
        );

    const contact =
        getStringValue(
            policyData,
            ["contact"],
        );

    if (
        !returnWindow &&
        !condition &&
        !exclusions &&
        !refund &&
        !contact
    ) {
        return null;
    }

    return (
        <div className="ai-agent-widget__return-card">
            <div className="ai-agent-widget__return-card-header">
                <div className="ai-agent-widget__return-card-icon">
                    <RotateCcw
                        size={16}
                        strokeWidth={2}
                    />
                </div>

                <div className="ai-agent-widget__return-card-title">
                    <div className="ai-agent-widget__return-card-label">
                        Return Policy
                    </div>

                    {returnWindow && (
                        <div className="ai-agent-widget__return-card-window">
                            {returnWindow} return window
                        </div>
                    )}
                </div>
            </div>

            {condition && (
                <div className="ai-agent-widget__return-card-section">
                    <div className="ai-agent-widget__return-card-section-label">
                        Conditions
                    </div>

                    <div className="ai-agent-widget__return-card-section-value">
                        {condition}
                    </div>
                </div>
            )}

            {exclusions && (
                <div className="ai-agent-widget__return-card-section">
                    <div className="ai-agent-widget__return-card-section-label">
                        Exclusions
                    </div>

                    <div className="ai-agent-widget__return-card-section-value">
                        {exclusions}
                    </div>
                </div>
            )}

            {refund && (
                <div className="ai-agent-widget__return-card-section">
                    <div className="ai-agent-widget__return-card-section-label">
                        Refunds
                    </div>

                    <div className="ai-agent-widget__return-card-section-value">
                        {refund}
                    </div>
                </div>
            )}

            {contact && (
                <div className="ai-agent-widget__return-card-contact">
                    {contact}
                </div>
            )}
        </div>
    );
}

function SupportTicketResultCard({
    tool,
}: {
    tool: AgentToolCall;
}) {
    const result =
        getToolResult(tool);

    if (!result) {
        return null;
    }

    const ticketNumber =
        getStringValue(
            result,
            ["ticketNumber"],
        );

    const status =
        getStringValue(
            result,
            ["status"],
        );

    const priority =
        getStringValue(
            result,
            ["priority"],
        );

    const message =
        getStringValue(
            result,
            ["message"],
        );

    if (
        !ticketNumber &&
        !status &&
        !priority &&
        !message
    ) {
        return null;
    }

    const formattedStatus =
        status
            ? status
                .replaceAll("_", " ")
                .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                )
            : null;

    const formattedPriority =
        priority
            ? priority
                .replaceAll("_", " ")
                .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                )
            : null;

    return (
        <div className="ai-agent-widget__ticket-card">
            <div className="ai-agent-widget__ticket-card-header">
                <div className="ai-agent-widget__ticket-card-icon">
                    <Ticket
                        size={16}
                        strokeWidth={2}
                    />
                </div>

                <div className="ai-agent-widget__ticket-card-title">
                    <div className="ai-agent-widget__ticket-card-label">
                        Support Ticket
                    </div>

                    {ticketNumber && (
                        <div className="ai-agent-widget__ticket-card-number">
                            {ticketNumber}
                        </div>
                    )}
                </div>
            </div>

            {(formattedStatus ||
                formattedPriority) && (
                    <div className="ai-agent-widget__ticket-card-meta">
                        {formattedStatus && (
                            <span className="ai-agent-widget__ticket-card-badge">
                                {formattedStatus}
                            </span>
                        )}

                        {formattedPriority && (
                            <span className="ai-agent-widget__ticket-card-badge">
                                {formattedPriority} priority
                            </span>
                        )}
                    </div>
                )}

            {message && (
                <div className="ai-agent-widget__ticket-card-message">
                    {message}
                </div>
            )}
        </div>
    );
}

function HumanEscalationResultCard({
    tool,
}: {
    tool: AgentToolCall;
}) {
    const result =
        getToolResult(tool);

    if (!result) {
        return null;
    }

    const status =
        getStringValue(
            result,
            ["status"],
        );

    const message =
        getStringValue(
            result,
            ["message"],
        );

    const escalationId =
        getStringValue(
            result,
            ["escalationId"],
        );

    if (
        !status &&
        !message &&
        !escalationId
    ) {
        return null;
    }

    const formattedStatus =
        status
            ? status
                .replaceAll("_", " ")
                .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                )
            : null;

    return (
        <div className="ai-agent-widget__escalation-card">
            <div className="ai-agent-widget__escalation-card-header">
                <div className="ai-agent-widget__escalation-card-icon">
                    <Headphones
                        size={16}
                        strokeWidth={2}
                    />
                </div>

                <div className="ai-agent-widget__escalation-card-title">
                    <div className="ai-agent-widget__escalation-card-label">
                        Human Support
                    </div>

                    <div className="ai-agent-widget__escalation-card-heading">
                        Your request has been escalated
                    </div>
                </div>
            </div>

            {formattedStatus && (
                <div className="ai-agent-widget__escalation-card-status">
                    <span className="ai-agent-widget__escalation-card-status-dot" />

                    <span>
                        {formattedStatus}
                    </span>
                </div>
            )}

            {message && (
                <div className="ai-agent-widget__escalation-card-message">
                    {message}
                </div>
            )}

            {escalationId && (
                <div className="ai-agent-widget__escalation-card-id">
                    Reference: {escalationId}
                </div>
            )}
        </div>
    );
}

export function AgentToolActivity({
    toolCalls,
    isLoading = false,
}: AgentToolActivityProps) {
    if (toolCalls.length === 0) {
        return null;
    }

    return (
        <>
            <div className="ai-agent-widget__tool-activity">
                {toolCalls.map(
                    (tool, index) => {
                        const info =
                            getToolInfo(tool);

                        const isActive =
                            isLoading &&
                            index ===
                            toolCalls.length - 1;

                        return (
                            <div
                                key={`${tool.name ?? tool.tool ?? "tool"}-${index}`}
                                className={`ai-agent-widget__tool ${isActive
                                    ? "ai-agent-widget__tool--active"
                                    : "ai-agent-widget__tool--complete"
                                    }`}
                            >
                                <span className="ai-agent-widget__tool-icon">
                                    {isActive ? (
                                        <span className="ai-agent-widget__tool-spinner" />
                                    ) : (
                                        <ToolIcon
                                            type={info.icon}
                                        />
                                    )}
                                </span>

                                <span className="ai-agent-widget__tool-label">
                                    {isActive
                                        ? info.label
                                        : info.completedLabel}
                                </span>

                                {!isActive && (
                                    <Check
                                        className="ai-agent-widget__tool-check"
                                        size={13}
                                        strokeWidth={2.5}
                                    />
                                )}
                            </div>
                        );
                    }
                )}
            </div>

            {toolCalls.map(
                (tool, index) => {
                    const toolName =
                        tool.name ??
                        tool.tool;

                    if (
                        toolName ===
                        "getProductInformation"
                    ) {
                        return (
                            <ProductResultCard
                                key={`product-${index}`}
                                tool={tool}
                            />
                        );
                    }

                    if (
                        toolName ===
                        "getOrderStatus"
                    ) {
                        return (
                            <OrderStatusResultCard
                                key={`order-${index}`}
                                tool={tool}
                            />
                        );
                    }

                    if (
                        toolName ===
                        "getShippingInformation"
                    ) {
                        return (
                            <ShippingResultCard
                                key={`shipping-${index}`}
                                tool={tool}
                            />
                        );
                    }

                    if (
                        toolName ===
                        "getReturnPolicy"
                    ) {
                        return (
                            <ReturnPolicyResultCard
                                key={`return-${index}`}
                                tool={tool}
                            />
                        );
                    }

                    if (
                        toolName ===
                        "createSupportTicket"
                    ) {
                        return (
                            <SupportTicketResultCard
                                key={`ticket-${index}`}
                                tool={tool}
                            />
                        );
                    }

                    if (
                        toolName ===
                        "escalateToHuman"
                    ) {
                        return (
                            <HumanEscalationResultCard
                                key={`escalation-${index}`}
                                tool={tool}
                            />
                        );
                    }

                    return null;
                }
            )}
        </>
    );
}