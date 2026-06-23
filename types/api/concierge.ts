import type { Locale } from "@/lib/i18n/config";
import type { ApiProperty } from "./property";

export type ConciergeFallbackFaq = {
  question: string;
  answer: string;
};

export type ConciergeConfig = {
  enabled: boolean;
  locale: string;
  disclaimer: string;
  greeting: string | null;
  quickPrompts: string[];
  speakToAdvisorUrl: string;
  fallbackMode: boolean;
  fallbackFaqs?: ConciergeFallbackFaq[];
};

export type LeadCaptureStatus = "none" | "collecting" | "qualified" | "submitted";

export type LeadCaptureState = {
  status: LeadCaptureStatus;
  missingFields: string[];
  prompt?: string | null;
};

export type ConciergeSession = {
  sessionId: string;
  locale: string;
  greeting: string;
  disclaimer: string;
  quickPrompts: string[];
  leadCapture: LeadCaptureState;
};

export type ConciergeMessageMeta = {
  messageId?: string;
  model?: string;
  intent?: string;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
  isFallback?: boolean;
  refused?: boolean;
};

export type ConciergeJsonMessageResponse = {
  messageId?: string;
  content: string;
  properties?: ApiProperty[];
  leadCapture?: LeadCaptureState;
  meta?: ConciergeMessageMeta;
};

export type ConciergeStartSessionInput = {
  locale: Locale;
  sourcePage?: string;
  utmSource?: string;
  utmCampaign?: string;
  visitorId?: string;
};

export type ConciergeSendMessageInput = {
  sessionId: string;
  message: string;
  locale: Locale;
  clientMessageId?: string;
};

export type ConciergeLeadInput = {
  sessionId: string;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  budgetRange?: string;
  timeline?: string;
  preferredLanguage?: Locale;
  consentMarketing: boolean;
};

export type ConciergeLeadResponse = {
  leadId: number | string;
  message: string;
};

export type SseTokenEvent = { text: string };
export type SsePropertiesEvent = { items: ApiProperty[] };
export type SseLeadCaptureEvent = LeadCaptureState;
export type SseMetaEvent = ConciergeMessageMeta;
export type SseErrorEvent = { code?: string; message: string };

export type ConciergeSseHandlers = {
  onToken?: (data: SseTokenEvent) => void;
  onProperties?: (data: SsePropertiesEvent) => void;
  onLeadCapture?: (data: SseLeadCaptureEvent) => void;
  onMeta?: (data: SseMetaEvent) => void;
  onError?: (data: SseErrorEvent) => void;
  onDone?: () => void;
};
