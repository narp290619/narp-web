"use client";

import { AgentWidget } from "./AgentWidget";

const NARP_SUPPORT_AGENT_ID =
  "p3LeEc6dovtnS0dMi13I";

export default function NarpSupportWidget() {
  return (
    <AgentWidget
      agentId={NARP_SUPPORT_AGENT_ID}
      name="NARP Customer Support"
      subtitle="How can we help?"
      greeting="Hi! How can I help you today?"
      placeholder="Type your message..."
      position="bottom-right"
      showToolActivity={true}
      showPoweredBy={true}
    />
  );
}