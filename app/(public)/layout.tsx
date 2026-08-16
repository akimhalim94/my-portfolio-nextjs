import Navbar from "@/components/Navbar";
import FloatingChatButton from "@/components/FloatingChatButton";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <FloatingChatButton />
    </>
  );
}
