import { EditableText } from "@/components/EditableText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HOME_REL_URL } from "./home-editable";

function OfficeCrest() {
  return (
    <div
      aria-hidden
      className="mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-sapphire-600 p-2 text-accent-on-dark"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent-on-dark text-xl">
        <span className="sr-only">Private</span>
        &#9671;
      </span>
    </div>
  );
}

export async function PrivateOfficeSection() {
  return (
    <section className="bg-sapphire-800 py-16 text-white sm:py-20">
      <Container className="mx-auto max-w-[520px] text-center">
        <OfficeCrest />
        <EditableText
          relUrl={HOME_REL_URL}
          blockKey="private-office-title"
          placeholderContent="Private Office"
          placeholderTag="h2"
          className="mt-10 font-[family-name:var(--font-display)] text-[36px] font-normal uppercase leading-[38px] tracking-[-0.02em] sm:text-[44px] sm:leading-[42px]"
        />
        <EditableText
          relUrl={HOME_REL_URL}
          blockKey="private-office-desc"
          placeholderContent="For clients introduced to NIP, Private Office provides access to selected opportunities, advisor notes, and private property intelligence."
          placeholderTag="p"
          className="mx-auto mt-4 max-w-[464px] text-[13px] leading-[18px] text-[#8fb0dc]"
        />
        <p className="mt-10 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase leading-4 text-white">
          <span className="h-2 w-2 rounded-full bg-accent" />
          By Introduction Only
        </p>
        <div className="mx-auto mt-10 flex max-w-[340px] flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Button href="/contact" variant="accent" size="lg" className="w-full flex-1">
            Request Access
          </Button>
          <Button
            href="/private-office"
            variant="outlineInverse"
            size="lg"
            className="w-full flex-1"
          >
            Sign In
          </Button>
        </div>
      </Container>
    </section>
  );
}
