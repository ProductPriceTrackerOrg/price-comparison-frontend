import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Privacy Policy - PricePulse",
  description:
    "Learn how PricePulse protects your privacy and handles your personal data. Our comprehensive privacy policy outlines our data practices.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" flex flex-col">
      
      <main className="flex-1">{children}</main>
      
    </div>
  );
}
