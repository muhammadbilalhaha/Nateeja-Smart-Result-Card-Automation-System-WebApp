import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata = {
  title: "Nateeja - Smart Report Card Generator",
  description: "School Result Card Automation System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}