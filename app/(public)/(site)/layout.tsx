import Scroll3DBackground from "@/components/Scroll3DBackground";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Scroll3DBackground />
      <div className="relative z-0">{children}</div>
      <ScrollToTopButton />
    </>
  );
}
