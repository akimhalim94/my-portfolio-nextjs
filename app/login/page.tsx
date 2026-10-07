import LoginForm from "@/components/LoginForm";
import Ambient from "@/components/motion/Ambient";
import Parallax from "@/components/motion/Parallax";
import Reveal, { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import SplitText from "@/components/motion/SplitText";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-black text-white pt-28 p-8 flex flex-col items-center justify-center">
      <Ambient />

      <Reveal
        variant="flip"
        amount={0.2}
        className="w-full max-w-md perspective-[1200px]"
      >
        <Parallax y={[-24, 24]} className="perspective-[1200px]">
          <div className="gradient-ring sheen relative overflow-hidden rounded-2xl bg-gray-950/80 border border-white/10 backdrop-blur-md p-8 shadow-2xl">
            <RevealGroup stagger={0.12} delayChildren={0.2}>
              <SplitText
                text="Admin Login"
                trigger="load"
                className="text-2xl font-bold mb-2"
              />
              <RevealItem
                as="p"
                variant="blur"
                className="text-gray-400 text-xs sm:text-sm mb-6 leading-relaxed"
              >
                Log in to manage your portfolio&apos;s messages and content.
              </RevealItem>
            </RevealGroup>

            <LoginForm />
          </div>
        </Parallax>
      </Reveal>
    </main>
  );
}