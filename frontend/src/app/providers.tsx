// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import store from "@/redux/store";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
