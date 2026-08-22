import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { SiteShell } from "@/components/SiteShell";

import { PageBuilderSection } from "@/components/page-builder/PageBuilderSection";

import { getBuilderPage } from "@/lib/api/pages";

import { resolveSectionData } from "@/lib/page-builder/data-source";

import { normalizeBuilderPath } from "@/lib/page-builder/reserved-paths";

import { builderPageMetadata } from "@/lib/i18n/metadata";

import { resolveLocale } from "@/lib/i18n/helpers";



type PageProps = {

  params: Promise<{ locale: string; slug: string[] }>;

};



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

  const { locale: rawLocale, slug } = await params;

  const locale = resolveLocale(rawLocale);

  const path = normalizeBuilderPath(`/${slug.join("/")}`);

  const page = await getBuilderPage(path, locale);

  if (!page) {

    return { title: "Page not found" };

  }

  return builderPageMetadata(path, locale, page.title);

}



export default async function DynamicBuilderPage({ params }: PageProps) {

  const { locale: rawLocale, slug } = await params;

  const locale = resolveLocale(rawLocale);

  const path = normalizeBuilderPath(`/${slug.join("/")}`);



  const page = await getBuilderPage(path, locale);

  if (!page || !page.is_published) {

    notFound();

  }



  const sections = page.sections

    .filter((section) => section.is_visible)

    .sort((a, b) => a.sort_order - b.sort_order);



  const data = await Promise.all(

    sections.map((section) => resolveSectionData(section, locale)),

  );



  return (

    <SiteShell>

      {sections.map((section, index) => (

        <PageBuilderSection

          key={section.id}

          section={section}

          relUrl={path}

          locale={locale}

          data={data[index] ?? {}}

        />

      ))}

    </SiteShell>

  );

}


