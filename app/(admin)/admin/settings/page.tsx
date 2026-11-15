
"use client";

import { useCallback, useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
    AlertCircle,
    CheckCircle,
    Loader2,
    RefreshCw,
    Save,
    Settings,
    X,
} from "lucide-react";

import { getInstallationId } from "@/lib/session";

// ============================================================
// TYPES
// ============================================================

type AdSettingsResponse = {
    success: boolean;
    maxActiveCampaignsPerAdvertiser: number;
    minAllowed: number;
    maxAllowed: number;
    isDefault: boolean;
};

type UpdateAdSettingsResponse = {
    success: boolean;
    maxActiveCampaignsPerAdvertiser: number;
    message: string;
};

type CallableRequest = {
    installationId: string;
    clientPlatform: "web";
};

type UpdateAdSettingsRequest = CallableRequest & {
    maxActiveCampaignsPerAdvertiser: number;
};

// ============================================================
// FIREBASE FUNCTIONS
// ============================================================

const functions = getFunctions(undefined, "asia-southeast1");

const getAdSettingsCallable = httpsCallable<
    CallableRequest,
    AdSettingsResponse
>(functions, "getAdSettings");

const updateAdSettingsCallable = httpsCallable<
    UpdateAdSettingsRequest,
    UpdateAdSettingsResponse
>(functions, "updateAdSettings");

// ============================================================
// ERROR HANDLING
// ============================================================

function getErrorMessage(error: unknown): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
    ) {
        return String(error.message);
    }

    return "An unexpected error occurred.";
}

// ============================================================
// ADMIN SETTINGS PAGE
// ============================================================

export default function AdminSettingsPage() {
    const [maxCampaigns, setMaxCampaigns] = useState("3");
    const [savedMaxCampaigns, setSavedMaxCampaigns] = useState(3);

    const [minAllowed, setMinAllowed] = useState(1);
    const [maxAllowed, setMaxAllowed] = useState(100);

    const [isDefault, setIsDefault] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // ========================================================
    // LOAD SETTINGS
    // ========================================================

    const loadSettings = useCallback(async () => {
        try {
            setError(null);

            const result = await getAdSettingsCallable({
                installationId: getInstallationId(),
                clientPlatform: "web",
            });

            const settings = result.data;

            setMaxCampaigns(
                String(settings.maxActiveCampaignsPerAdvertiser)
            );

            setSavedMaxCampaigns(
                settings.maxActiveCampaignsPerAdvertiser
            );

            setMinAllowed(settings.minAllowed);
            setMaxAllowed(settings.maxAllowed);
            setIsDefault(settings.isDefault);

        } catch (err) {
            console.error(
                "[ADMIN SETTINGS] Failed to load advertisement settings:",
                err
            );

            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadSettings();
    }, [loadSettings]);

    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setSuccess(null);

        await loadSettings();
    };

    // ========================================================
    // SAVE SETTINGS
    // ========================================================

    const handleSave = async () => {
        const value = Number(maxCampaigns);

        if (
            !Number.isSafeInteger(value) ||
            value < minAllowed ||
            value > maxAllowed
        ) {
            setError(
                `Enter a whole number between ${minAllowed} and ${maxAllowed}.`
            );
            return;
        }

        if (value === savedMaxCampaigns) {
            setError("There are no changes to save.");
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            setSuccess(null);

            const result = await updateAdSettingsCallable({
                maxActiveCampaignsPerAdvertiser: value,
                installationId: getInstallationId(),
                clientPlatform: "web",
            });

            setSavedMaxCampaigns(
                result.data.maxActiveCampaignsPerAdvertiser
            );

            setMaxCampaigns(
                String(result.data.maxActiveCampaignsPerAdvertiser)
            );

            setIsDefault(false);

            setSuccess(
                result.data.message ||
                "Advertisement settings updated successfully."
            );

        } catch (err) {
            console.error(
                "[ADMIN SETTINGS] Failed to update advertisement settings:",
                err
            );

            setError(getErrorMessage(err));
        } finally {
            setIsSaving(false);
        }
    };

    // ========================================================
    // INPUT VALIDATION
    // ========================================================

    const numericValue = Number(maxCampaigns);

    const isValid =
        maxCampaigns.trim() !== "" &&
        Number.isSafeInteger(numericValue) &&
        numericValue >= minAllowed &&
        numericValue <= maxAllowed;

    const hasChanges =
        isValid &&
        numericValue !== savedMaxCampaigns;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="space-y-6 p-4 sm:p-6">

            {/* PAGE HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Settings className="h-6 w-6 text-gray-700" />

                        <h1 className="text-2xl font-bold text-gray-900">
                            Admin Settings
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        Configure platform-wide advertisement settings.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isLoading || isRefreshing || isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            isRefreshing ? "animate-spin" : ""
                        }`}
                    />

                    Refresh
                </button>
            </div>

            {/* ALERTS */}

            {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <p className="break-words">{error}</p>

                    <button
                        type="button"
                        onClick={() => setError(null)}
                        className="ml-auto"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />

                    <p>{success}</p>

                    <button
                        type="button"
                        onClick={() => setSuccess(null)}
                        className="ml-auto"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* ADVERTISEMENT SETTINGS */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                <div className="border-b border-gray-200 p-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Advertisement Configuration
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage how many advertisements each advertiser
                        can create and maintain.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex min-h-64 items-center justify-center">
                        <Loader2 className="h-7 w-7 animate-spin text-gray-500" />
                    </div>
                ) : (
                    <div className="space-y-6 p-5">

                        {/* MAXIMUM CAMPAIGNS */}

                        <div className="max-w-xl space-y-3">

                            <div>
                                <label
                                    htmlFor="maxCampaigns"
                                    className="block text-sm font-semibold text-gray-900"
                                >
                                    Maximum Advertisements per Advertiser
                                </label>

                                <p className="mt-1 text-sm text-gray-500">
                                    The maximum number of active, pending,
                                    or draft advertisements an advertiser
                                    can have at the same time.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    id="maxCampaigns"
                                    type="number"
                                    min={minAllowed}
                                    max={maxAllowed}
                                    step={1}
                                    value={maxCampaigns}
                                    onChange={(event) => {
                                        setMaxCampaigns(event.target.value);
                                        setError(null);
                                        setSuccess(null);
                                    }}
                                    disabled={isSaving}
                                    className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
                                />

                                <span className="text-sm text-gray-500">
                                    advertisements
                                </span>
                            </div>

                            <p className="text-xs text-gray-500">
                                Allowed range: {minAllowed}–{maxAllowed}.
                            </p>

                            {isDefault && (
                                <p className="text-xs text-blue-700">
                                    Using the system default of 3.
                                    Save a different value to create
                                    the settings configuration.
                                </p>
                            )}
                        </div>

                        {/* CURRENT VALUE */}

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Currently saved limit
                            </p>

                            <p className="mt-1 text-3xl font-bold text-gray-900">
                                {savedMaxCampaigns}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Maximum advertisements per advertiser
                            </p>
                        </div>

                        {/* SAVE BUTTON */}

                        <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-5">
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={
                                    isSaving ||
                                    !hasChanges
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}

                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setMaxCampaigns(
                                        String(savedMaxCampaigns)
                                    );
                                    setError(null);
                                    setSuccess(null);
                                }}
                                disabled={isSaving || !hasChanges}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* INFORMATION */}

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                <h3 className="text-sm font-semibold text-blue-900">
                    How the advertisement limit works
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-800">
                    <li>
                        Draft advertisements count toward the limit.
                    </li>

                    <li>
                        Pending payment, pending review, approved,
                        scheduled, active, and paused advertisements
                        count toward the limit.
                    </li>

                    <li>
                        Rejected and expired advertisements do not
                        count toward the limit.
                    </li>

                    <li>
                        Changing the limit does not delete existing
                        advertisements.
                    </li>

                    <li>
                        If the limit is reduced below an advertiser's
                        current count, they cannot create another
                        advertisement until their count falls below
                        the new limit.
                    </li>
                </ul>
            </div>
        </div>
    );
}
