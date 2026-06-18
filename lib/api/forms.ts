import type { Locale } from "@/lib/i18n/config";
import type {
  ConsultationPayload,
  ContactInquiryPayload,
  NewsletterPayload,
  PropertyInquiryPayload,
  SupportInquiryPayload,
} from "@/types/api";
import { apiPost, apiRequest } from "./client";

type FormSubmitOptions = {
  locale?: Locale;
};

export async function submitContactInquiry(
  payload: ContactInquiryPayload,
  options: FormSubmitOptions = {},
) {
  return apiPost<{ message?: string }>("/contact-inquiries", payload, {
    revalidate: false,
    locale: options.locale,
  });
}

export async function submitConsultation(
  payload: ConsultationPayload,
  options: FormSubmitOptions = {},
) {
  return apiPost<{ message?: string }>("/consultations", payload, {
    revalidate: false,
    locale: options.locale,
  });
}

export async function submitPropertyInquiry(
  payload: PropertyInquiryPayload,
  options: FormSubmitOptions = {},
) {
  return apiPost<{ message?: string }>("/property-inquiries", payload, {
    revalidate: false,
    locale: options.locale,
  });
}

export async function submitNewsletter(
  payload: NewsletterPayload,
  options: FormSubmitOptions = {},
) {
  return apiPost<{ message?: string }>("/newsletter-subscriptions", payload, {
    revalidate: false,
    locale: options.locale,
  });
}

export async function submitSupportInquiry(
  payload: SupportInquiryPayload,
  options: FormSubmitOptions = {},
) {
  return apiPost<{ message?: string }>("/support-inquiries", payload, {
    revalidate: false,
    locale: options.locale,
  });
}

export async function submitCareerApplication(
  formData: FormData,
  options: FormSubmitOptions = {},
) {
  return apiRequest<{ message?: string }>("/career-applications", {
    method: "POST",
    body: formData,
    revalidate: false,
    locale: options.locale,
  });
}
