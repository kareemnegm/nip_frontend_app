import { redirect } from "next/navigation";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminIndexPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  redirect(localizedHref(resolveLocale(rawLocale), "/admin/site"));
}
