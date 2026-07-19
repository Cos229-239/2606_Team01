// ======================================================
// useSmoothScroll.ts
// ------------------------------------------------------
// Small hook that reads the "smooth scroll" General setting
// and keeps components in sync with it. Anywhere in the app
// that scrolls the page (e.g. the Help page's quick-nav) or
// animates an accordion/dropdown open should read this hook
// rather than hard-coding "smooth" or a transition duration,
// so everything respects the user's preference consistently.
//
// Listens for the "general-settings-change" event so a toggle
// flipped on GeneralSettingsPage takes effect immediately in
// any other page/component that's currently mounted, without
// needing a full reload.
// ======================================================
import { useEffect, useState } from "react";
import { getSmoothScroll } from "./generalSettings";

export const SMOOTH_SCROLL_CHANGE_EVENT = "general-settings-change";

export function useSmoothScroll(): boolean {
    const [smoothScroll, setSmoothScroll] = useState<boolean>(getSmoothScroll);

    useEffect(() => {
        function handleChange() {
            setSmoothScroll(getSmoothScroll());
        }

        window.addEventListener(SMOOTH_SCROLL_CHANGE_EVENT, handleChange);
        return () => {
            window.removeEventListener(SMOOTH_SCROLL_CHANGE_EVENT, handleChange);
        };
    }, []);

    return smoothScroll;
}
