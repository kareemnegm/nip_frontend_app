export type ContactInquiryPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  interested_property?: string;
  language?: string;
  preferred_language?: string;
  lead_type?: string;
  budget_range?: string;
  timeline?: string;
  company?: string;
  "g-recaptcha-response"?: string;
};

export type ConsultationPayload = ContactInquiryPayload & {
  external_source?: string;
};

export type PropertyInquiryPayload = {
  property_id?: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
  purpose_of_inquiry?: string;
  page_url?: string;
  form_id?: string;
  external_source?: string;
  company?: string;
};

export type NewsletterPayload = {
  email: string;
};

/**
 * `POST /insight-submissions` — sent as multipart/form-data because of the
 * optional draft file, so these are the FormData keys rather than a JSON body.
 */
export type InsightSubmissionResponse = {
  message?: string;
  /** `null` when the honeypot was tripped — nothing was stored. */
  data?: {
    id: number;
    reference: string;
    status: string;
    title: string;
    author: string;
    email: string;
    abstract: string;
    draft_filename: string | null;
    created_at: string;
    category?: import("./blog").ApiBlogCategory | null;
  } | null;
};

export type SupportInquiryPayload = {
  name: string;
  email: string;
  messages: string;
  "g-recaptcha-response"?: string;
};
