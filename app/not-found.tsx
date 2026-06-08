import { SiteShell } from "@/components/SiteShell";
import { StatusScreen } from "@/components/sections";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <SiteShell>
      <StatusScreen
        icon="frown"
        iconTone="brand"
        eyebrow="Error 404"
        title="Page Not Found"
        description="The page you're looking for has moved or no longer exists. Let's get you back on track."
        actions={
          <>
            <Button href="/">Back to Home</Button>
            <Button href="/properties" variant="accent">
              Search Properties
            </Button>
          </>
        }
      />
    </SiteShell>
  );
}
