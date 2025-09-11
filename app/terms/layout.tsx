import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Terms of Service - PricePulse",
  description:
    "Read PricePulse terms of service and user agreement. Understand your rights and responsibilities when using our price tracking platform.",
};

export default function TermsLayout({
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
