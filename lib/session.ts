const INSTALLATION_ID_KEY = "narp_installation_id";

export function getInstallationId(): string {
    if (typeof window === "undefined") {
        throw new Error("Installation ID is only available in the browser.");
    }

    let installationId = localStorage.getItem(INSTALLATION_ID_KEY);

    if (!installationId) {
        installationId = crypto.randomUUID();

        localStorage.setItem(
            INSTALLATION_ID_KEY,
            installationId
        );
    }

    return installationId;
}