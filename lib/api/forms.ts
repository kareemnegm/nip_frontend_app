import type {
  ConsultationPayload,
  ContactInquiryPayload,
  NewsletterPayload,
  PropertyInquiryPayload,
  SupportInquiryPayload,
} from "@/types/api";
import { apiPost } from "./client";

export async function submitContactInquiry(payload: ContactInquiryPayload) {
  return apiPost<{ message?: string }>("/contact-inquiries", payload, {
    revalidate: false,
  });
}

export async function submitConsultation(payload: ConsultationPayload) {
  return apiPost<{ message?: string }>("/consultations", payload, {
    revalidate: false,
  });
}

export async function submitPropertyInquiry(payload: PropertyInquiryPayload) {
  return apiPost<{ message?: string }>("/property-inquiries", payload, {
    revalidate: false,
  });
}

export async function submitNewsletter(payload: NewsletterPayload) {
  return apiPost<{ message?: string }>("/newsletter-subscriptions", payload, {
    revalidate: false,
  });
}

export async function submitSupportInquiry(payload: SupportInquiryPayload) {
  return apiPost<{ message?: string }>("/support-inquiries", payload, {
    revalidate: false,
  });
}

import { apiRequest } from "./client";

export async function submitCareerApplication(formData: FormData) {
  return apiRequest<{ message?: string }>("/career-applications", {
    method: "POST",
    body: formData,
    revalidate: false,
  });
}
