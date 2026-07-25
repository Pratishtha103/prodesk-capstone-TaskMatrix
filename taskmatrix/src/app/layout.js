import { Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/ReduxProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/contexts/ThemeContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "TaskMatrix",
  description: "TaskMatrix Capstone App",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script: sets data-theme before React hydrates to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ReduxProvider>
          <AuthProvider>
            <ThemeProvider>
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  style: {
                    background: "var(--surface)",
                    color: "var(--text-main)",
                    border: "1px solid var(--secondary)",
                  },
                }}
              />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}