import type { Metadata } from "next"



export const metadata: Metadata = {
  title: "Help Center - PricePulse",
  description: "Get help with PricePulse price tracking platform. Find answers to common questions and learn how to use our features.",
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" flex flex-col">
      
      <main className="flex-1">
        {children}
      </main>
      
    </div>
  )
}
