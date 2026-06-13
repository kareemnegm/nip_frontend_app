import { EditableText } from "@/components/EditableText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteHeroGutterX, siteMaxWidth } from "@/components/ui/SiteChrome";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { HOME_REL_URL } from "./home-editable";

export async function HomeHeroSection() {
  return (
    <section
      data-site-hero
      className="relative overflow-hidden bg-[linear-gradient(158deg,#254672_0%,#081a33_72%)] py-24 text-white sm:py-32 lg:py-[200px]"
    >
      <Container className={cn("relative", siteMaxWidth, siteHeroGutterX)}>
        <EditableText
          relUrl={HOME_REL_URL}
          blockKey="hero-eyebrow"
          placeholderContent="A Private Advisory View | Dubai Real Estate"
          placeholderTag="p"
          className="text-xs font-semibold uppercase leading-4 text-sapphire-200"
        />
        <EditableText
          relUrl={HOME_REL_URL}
          blockKey="hero-title"
          placeholderContent="For Those Who Expect More"
          placeholderTag="h1"
          className="mt-9 max-w-[620px] font-[family-name:var(--font-display)] text-5xl font-normal uppercase leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-[64px] lg:leading-[72px]"
        />
        <EditableText
          relUrl={HOME_REL_URL}
          blockKey="hero-body"
          placeholderContent="Dubai real estate has no shortage of choice. The difference lies in knowing what deserves your attention. NIP brings together market insight, editorial perspective, and private advisory for clients who want to move with judgment."
          placeholderTag="p"
          className="mt-9 max-w-[452px] text-[13px] leading-[18px] text-white"
        />
        <div className="mt-9 flex max-w-[452px] flex-col items-stretch gap-3 sm:flex-row">
          <Button href="/insights" variant="accent" size="lg" className="w-full flex-1">
            Read the Latest Insights <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
          <Button
            href="/contact"
            variant="outlineInverse"
            size="lg"
            className="w-full flex-1 border-platinum-400 text-[#d7dce3]"
          >
            Speak with NIP
          </Button>
        </div>
      </Container>
    </section>
  );
}
