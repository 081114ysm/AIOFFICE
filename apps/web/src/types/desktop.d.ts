export {};

type DesktopAgentEvent = {
  type: string;
  agentId?: string;
  agentName?: string;
  payload?: unknown;
  occurredAt: string;
};

declare global {
  interface Window {
    aiOfficeDesktop?: {
      startReadOnlyCodex: (request: { id: string; name?: string; prompt: string }) => Promise<{ id: string; status: string }>;
      stopAgent: (id: string) => Promise<boolean>;
      notifyCompletion?: (title: string, body: string) => void;
      onAgentEvent: (callback: (event: DesktopAgentEvent) => void) => () => void;
    };
  }
}
