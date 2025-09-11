export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="min-h-screen pt-16">{children}</section>;
}
