import "./globals.css";

export const metadata = {
  title: "AutoBooking — Mecánica automotriz a domicilio en Santiago",
  description:
    "Agenda mecánica a domicilio en Santiago: baterías, frenos, diagnósticos, mantención, scanner e inspección pre-compra. Cobertura en zona Centro, Oriente y Sur.",
  openGraph: {
    title: "AutoBooking — Mecánica automotriz a domicilio",
    description:
      "Agenda tu hora en minutos. Mecánica a domicilio en zona Centro, Oriente y Sur de Santiago.",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
