import { ThemeProvider } from "@/components/themes/theme-provider";

import { Approutes } from "./routes";


export function App() {

  return (
    <ThemeProvider storageKey="kasebox-theme" defaultTheme="system">
      <Approutes />
    </ThemeProvider>
  )
}