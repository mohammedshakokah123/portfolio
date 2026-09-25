import { Mail, MapPin } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/brand-icons";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { site } from "@/content/site";

/** "https://www.linkedin.com/in/jane/" ← "linkedin.com/in/jane" */
function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/+$/, "");
}

export function Contact() {
  const { email, socials, location } = site;

  return (
    <Section
      id="contact"
      labelledBy="contact-title"
      bordered={false}
      className="grid gap-12 lg:grid-cols-[1fr_1.3fr]"
    >
      <div>
        <SectionHeading
          id="contact-title"
          descriptionClassName="text-muted-foreground max-w-md text-base"
          {...site.sections.contact}
        />

        {/* كل رابط بينعرض بس إذا مش null */}
        <ul className="mt-8 space-y-3 text-sm">
          {email && (
            <li>
              <ContactLink href={`mailto:${email}`} icon={<Mail className="size-4" aria-hidden />}>
                {email}
              </ContactLink>
            </li>
          )}
          {socials.linkedin && (
            <li>
              <ContactLink
                href={socials.linkedin}
                external
                icon={<LinkedInIcon className="size-4" />}
              >
                {displayUrl(socials.linkedin)}
              </ContactLink>
            </li>
          )}
          {socials.github && (
            <li>
              <ContactLink href={socials.github} external icon={<GitHubIcon className="size-4" />}>
                {displayUrl(socials.github)}
              </ContactLink>
            </li>
          )}
          <li className="text-muted-foreground inline-flex items-center gap-3">
            <IconBox>
              <MapPin className="size-4" aria-hidden />
            </IconBox>
            {location}
          </li>
        </ul>
      </div>

      <ContactForm />
    </Section>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-border text-muted-foreground group-hover:border-input group-hover:text-brand grid size-9 shrink-0 place-items-center rounded-md border transition-colors duration-200">
      {children}
    </span>
  );
}

type ContactLinkProps = {
  href: string;
  icon: React.ReactNode;
  external?: boolean;
  children: React.ReactNode;
};

function ContactLink({ href, icon, external, children }: ContactLinkProps) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className="group text-body hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-3 rounded-md break-all transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
    >
      <IconBox>{icon}</IconBox>
      {children}
      {external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}
