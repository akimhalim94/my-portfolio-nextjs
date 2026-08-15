import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import {
  getSocialLinks,
  getContentSettings,
} from "@/app/db-controller/content-actions";

export default async function ContactPage() {
  const [socialLinks, settings] = await Promise.all([
    getSocialLinks(),
    getContentSettings(),
  ]);

  return (
    <main className="min-h-screen text-white pt-28 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-8 shadow-2xl">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            📬 Get in Touch
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed">
            {settings.contact_intro}
          </p>

          <ContactForm />
        </div>

        <div className="rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-6 shadow-2xl">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Or find me here
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all flex items-center justify-between text-xs font-medium text-gray-300"
              >
                <span>{social.name}</span>
                <span className="text-blue-400">&rarr;</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-medium transition-colors"
          >
            &larr; Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
