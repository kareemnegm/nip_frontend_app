export type ContactInquiryPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  interested_property?: string;
  language?: string;
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

export type SupportInquiryPayload = {
  name: string;
  email: string;
  messages: string;
  "g-recaptcha-response"?: string;
};
