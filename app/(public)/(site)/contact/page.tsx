import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import {
  getSocialLinks,
  getContentSettings,
} from "@/app/db-controller/content-actions";
import Ambient from "@/components/motion/Ambient";
import Parallax from "@/components/motion/Parallax";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";

export default async function ContactPage() {
  const [socialLinks, settings] = await Promise.all([
    getSocialLinks(),
    getContentSettings(),
  ]);

  return (
    <main className="relative min-h-screen text-white pt-28 p-8 pb-20 flex flex-col items-center">
      <Ambient />

      <div className="w-full max-w-2xl space-y-6">
        <Reveal
          variant="tilt"
          amount={0.1}
          className="relative rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-8 shadow-2xl overflow-hidden"
        >
          {/* Card drifts against the page. */}
          <Parallax y={[-18, 18]} className="relative">
            <RevealGroup stagger={0.1} delayChildren={0.15}>
              <SplitText
                text="📬 Get in Touch"
                className="text-2xl font-bold mb-2"
              />
              <RevealItem
                as="p"
                variant="blur"
                className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed"
              >
                {settings.contact_intro}
              </RevealItem>
            </RevealGroup>

            <ContactForm />
          </Parallax>
        </Reveal>

        <Reveal
          variant="up"
          amount={0.15}
          className="relative rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 shadow-2xl"
        >
          <Parallax y={[16, -16]} className="relative">
            <RevealItem
              as="h2"
              variant="left"
              className="text-lg font-semibold mb-4 text-white"
            >
              Or find me here
            </RevealItem>
            <RevealGroup
              stagger={0.07}
              delayChildren={0.15}
              className="grid grid-cols-2 gap-4"
            >
              {socialLinks.map((social, index) => (
                /* The animated wrapper *is* the grid cell: a `display: contents`
                   wrapper would leave the anchor as the cell but give it no box
                   to transform, so the reveal would run invisibly. */
                <RevealItem
                  key={index}
                  variant="scale"
                  whileHover={{ y: -4 }}
                  className="group/link rounded-xl bg-white/5 border border-white/10 transition-colors hover:border-blue-500/50 hover:bg-white/10"
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full p-3 flex items-center justify-between text-xs font-medium text-gray-300"
                  >
                    <span>{social.name}</span>
                    <span className="text-blue-400 transition-transform group-hover/link:translate-x-1">
                      &rarr;
                    </span>
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
          </Parallax>
        </Reveal>

        {/* The last thing on the page can never scroll far enough to satisfy a
            high threshold, so this one asks for a sliver instead of half. */}
        <Reveal variant="fade" amount={0.2} className="mt-8">
          <Link
            href="/"
            data-view-transition="back"
            className="inline-block px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-colors"
          >
            &larr; Return to Homepage
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
