import { ContactForm } from "@/components/contact/contact-form";
import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { NewTabHint } from "@/components/shared/new-tab-hint";
import { Stage } from "@/components/stages/stage";
import { labels } from "@/content/labels";
import { site } from "@/content/site";
import type { PixelIconName } from "@/pixel/sprites/icons";

/** "https://www.linkedin.com/in/jane/" ← "linkedin.com/in/jane" */
function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/+$/, "");
}

/** "+963 933 981 269" ← "963933981269" (لروابط tel: وwa.me) */
function digits(number: string) {
  return number.replace(/\D/g, "");
}

export function ContactStage() {
  const { email, phone, whatsapp, socials, location, cvPath } = site;
  // LinkedIn وGitHub وأي حساب تاني. اللي لسا null (ما وصل) ما بينعرض
  const accounts = [
    { label: labels.contact.linkedin, url: socials.linkedin },
    { label: labels.contact.github, url: socials.github },
    ...(socials.others ?? []),
  ].filter((account): account is { label: string; url: string } => account.url !== null);

  return (
    <Stage id="contact">
      <div className="contact-grid">
        <div className="win">
          <h3 className="win-title">{labels.contact.links}</h3>
          <ul className="links">
            {email && (
              <li>
                <LinkRow
                  icon="mail"
                  label={labels.contact.email}
                  text={email}
                  href={`mailto:${email}`}
                />
              </li>
            )}
            {/* إضافة عن المرجع: سطرين التلفون والواتساب (بأيقونتين من EXTRA_ICONS)، وسطر لكل حساب بـ socials.others */}
            {phone && (
              <li>
                <LinkRow
                  icon="phone"
                  label={labels.contact.phone}
                  text={phone}
                  href={`tel:+${digits(phone)}`}
                />
              </li>
            )}
            {whatsapp && (
              <li>
                <LinkRow
                  icon="chat"
                  label={labels.contact.whatsapp}
                  text={whatsapp}
                  href={`https://wa.me/${digits(whatsapp)}`}
                  external
                />
              </li>
            )}
            {socials.linkedin && (
              <li>
                <LinkRow
                  icon="profile"
                  label={labels.contact.linkedin}
                  text={displayUrl(socials.linkedin)}
                  href={socials.linkedin}
                  external
                />
              </li>
            )}
            {socials.github && (
              <li>
                <LinkRow
                  icon="branch"
                  label={labels.contact.github}
                  text={displayUrl(socials.github)}
                  href={socials.github}
                  external
                />
              </li>
            )}
            {(socials.others ?? []).map((account) => (
              <li key={account.url}>
                <LinkRow
                  icon={account.icon ?? "profile"}
                  label={account.label}
                  text={displayUrl(account.url)}
                  href={account.url}
                  external
                />
              </li>
            ))}
            <li>
              <LinkRow icon="pin" label={labels.contact.location} text={location} />
            </li>
          </ul>
          <a className={btn()} href={cvPath} download>
            <PixelIcon name="download" />
            {labels.contact.cv}
          </a>
        </div>

        <ContactForm />
      </div>

      <div className="win credits">
        <h3>{labels.contact.credits}</h3>
        {/* نص واحد (template string): `© {year} {name}` بيطلع كذا text node وبيكسر الـ kerning بخط Pixelify */}
        <p>{`© ${new Date().getFullYear()} ${site.name}. ${site.footer.credit}`}</p>
        <ul className="credit-links">
          <li>
            <a href="#home">{labels.contact.backToTitle}</a>
          </li>
          <li>
            <a href={cvPath} download>
              {labels.contact.cvShort}
            </a>
          </li>
          {accounts.map((account) => (
            <li key={account.url}>
              <a href={account.url} target="_blank" rel="noopener noreferrer">
                {account.label}
                <NewTabHint />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Stage>
  );
}

type LinkRowProps = {
  icon: PixelIconName;
  label: string;
  text: string;
  /** بدون href السطر نص بس (الموقع) */
  href?: string;
  external?: boolean;
};

function LinkRow({ icon, label, text, href, external }: LinkRowProps) {
  const content = (
    <>
      <span className="link-ico" aria-hidden="true">
        <PixelIcon name={icon} />
      </span>
      <span className="link-text">
        <b>{label}</b>
        <span>{text}</span>
      </span>
    </>
  );

  if (!href) return <div className="link-row">{content}</div>;

  return (
    <a
      className="link-row"
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {content}
      {external && <NewTabHint />}
    </a>
  );
}
