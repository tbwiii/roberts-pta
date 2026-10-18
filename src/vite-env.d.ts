/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEADS_URL?: string;
}

interface Window {
  // beforeinstallprompt can fire before React mounts; main.tsx stashes it here for the install banner.
  __ptaInstallEvent?: Event;
}
