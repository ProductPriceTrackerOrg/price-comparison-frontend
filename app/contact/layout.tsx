import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Contact Us - PricePulse",
  description:
    "Get in touch with PricePulse team. Contact us for support, partnerships, or general inquiries about our price tracking platform.",
};

export default function ContactLayout({
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
