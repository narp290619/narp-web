"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "@/lib/firebase";
import {
  AlertCircle,
  Check,
  Clock,
  Loader2,
  Sparkles,
  Users,
  Vote,
  Wrench,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface SkillRequest {
  id: string;
  skillName: string;
  votes: number;
  requestedUsers: string[];
  status: string;
  createdAt?: any;
}

interface ApproveForm {
  title: string;
  description: string;
  image: string;
  sampleImage: string;
}

interface GenerateSkillResult {
  description?: string;
  imageUrl?: string;
  sampleImageUrl?: string;
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function SkillRequestsPage() {
  const [requests, setRequests] = useState<SkillRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState<string | null>(null);

  const [approveRequest, setApproveRequest] =
    useState<SkillRequest | null>(null);

  /*
   * Listen to pending skill requests in real time.
   *
   * Equivalent to the Flutter:
   *
   * collection("SkillRequests")
   *   .where("status", isEqualTo: "pending")
   *   .orderBy("votes", descending: true)
   */
  useEffect(() => {
    const requestsQuery = query(
      collection(db, "SkillRequests"),
      where("status", "==", "pending"),
      orderBy("votes", "desc")
    );

    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const data: SkillRequest[] = snapshot.docs.map((item) => {
          const raw = item.data();

          return {
            id: item.id,
            skillName: raw.skillName ?? "",
            votes: Number(raw.votes ?? 0),
            requestedUsers: Array.isArray(raw.requestedUsers)
              ? raw.requestedUsers
              : [],
            status: raw.status ?? "",
            createdAt: raw.createdAt,
          };
        });

        setRequests(data);
        setLoading(false);
        setError("");
      },
      (snapshotError) => {
        console.error(
          "Skill requests listener error:",
          snapshotError
        );

        setError("Unable to load skill requests.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Reject                                                                   */
  /* ------------------------------------------------------------------------ */

  const rejectRequest = async (request: SkillRequest) => {
    const confirmed = window.confirm(
      `Reject the skill request for "${request.skillName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(request.id);

      await updateDoc(doc(db, "SkillRequests", request.id), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error rejecting skill request:", error);

      window.alert(
        "Failed to reject the skill request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Approve                                                                  */
  /* ------------------------------------------------------------------------ */

  const approveSkill = async (
    request: SkillRequest,
    form: ApproveForm
  ) => {
    try {
      setProcessingId(request.id);

      const batch = writeBatch(db);

      /*
       * Create/update the actual skill document.
       *
       * Same as Flutter:
       *
       * final skillRef =
       *     firestore.collection("Skills").doc(skillName);
       */
      const skillRef = doc(
        db,
        "Skills",
        request.skillName
      );

      batch.set(skillRef, {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        skillSampleImage: form.sampleImage.trim(),
        totalMembers: 0,
      });

      /*
       * Mark request as approved.
       */
      const requestRef = doc(
        db,
        "SkillRequests",
        request.id
      );

      batch.update(requestRef, {
        status: "approved",
        approvedAt: serverTimestamp(),
      });

      /*
       * Commit both changes together.
       */
      await batch.commit();

      setApproveRequest(null);

      window.alert(
        `${form.title.trim()} approved successfully.`
      );
    } catch (error) {
      console.error(
        "Error approving skill request:",
        error
      );

      window.alert(
        "Failed to approve the skill request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Wrench className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Skill Requests
            </h1>

            <p className="text-sm text-slate-500">
              Review and manage skill requests from Narp users.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Clock className="h-5 w-5" />}
            label="Pending Requests"
            value={requests.length}
          />

          <SummaryCard
            icon={<Vote className="h-5 w-5" />}
            label="Total Votes"
            value={requests.reduce(
              (total, request) =>
                total + request.votes,
              0
            )}
          />

          <SummaryCard
            icon={<Users className="h-5 w-5" />}
            label="Users Requesting"
            value={requests.reduce(
              (total, request) =>
                total +
                request.requestedUsers.length,
              0
            )}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

            <span className="text-sm">
              Loading skill requests...
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5" />

            <div>
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        requests.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Wrench className="h-7 w-7 text-slate-400" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No pending skill requests
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              New skill requests from users will
              appear here automatically.
            </p>
          </div>
        )}

      {/* Request List */}
      {!loading &&
        !error &&
        requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((request) => (
              <SkillRequestCard
                key={request.id}
                request={request}
                processing={
                  processingId === request.id
                }
                onReject={() =>
                  rejectRequest(request)
                }
                onApprove={() =>
                  setApproveRequest(request)
                }
              />
            ))}
          </div>
        )}

      {/* Approval Modal */}
      {approveRequest && (
        <ApproveSkillModal
          request={approveRequest}
          processing={
            processingId === approveRequest.id
          }
          onClose={() => {
            if (
              processingId !==
              approveRequest.id
            ) {
              setApproveRequest(null);
            }
          }}
          onApprove={(form) =>
            approveSkill(
              approveRequest,
              form
            )
          }
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary Card                                                               */
/* -------------------------------------------------------------------------- */

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

function SummaryCard({
  icon,
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Skill Request Card                                                         */
/* -------------------------------------------------------------------------- */

interface SkillRequestCardProps {
  request: SkillRequest;
  processing: boolean;
  onReject: () => void;
  onApprove: () => void;
}

function SkillRequestCard({
  request,
  processing,
  onReject,
  onApprove,
}: SkillRequestCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Top */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Wrench className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900">
              {request.skillName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {request.requestedUsers.length}{" "}
              {request.requestedUsers.length === 1
                ? "user has"
                : "users have"}{" "}
              requested this skill.
            </p>
          </div>
        </div>

        {/* Votes */}
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
          <Vote className="h-4 w-4" />

          {request.votes}{" "}
          {request.votes === 1
            ? "vote"
            : "votes"}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <Vote className="h-4 w-4" />

            Votes
          </div>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {request.votes}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <Users className="h-4 w-4" />

            Requested By
          </div>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {request.requestedUsers.length}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          disabled={processing}
          onClick={onReject}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}

          Reject
        </button>

        <button
          type="button"
          disabled={processing}
          onClick={onApprove}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="h-4 w-4" />

          Approve
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Approve Skill Modal                                                        */
/* -------------------------------------------------------------------------- */

interface ApproveSkillModalProps {
  request: SkillRequest;
  processing: boolean;
  onClose: () => void;
  onApprove: (form: ApproveForm) => void;
}

function ApproveSkillModal({
  request,
  processing,
  onClose,
  onApprove,
}: ApproveSkillModalProps) {
  const [form, setForm] = useState<ApproveForm>({
    title: request.skillName,
    description: "",
    image: "",
    sampleImage: "",
  });

  const [gender, setGender] = useState<
    "Male" | "Female"
  >("Male");

  const [generating, setGenerating] =
    useState(false);

  const [generateError, setGenerateError] =
    useState("");

  /* ------------------------------------------------------------------------ */
  /* Update Field                                                             */
  /* ------------------------------------------------------------------------ */

  const updateField = (
    field: keyof ApproveForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ------------------------------------------------------------------------ */
  /* Generate With AI                                                         */
  /* ------------------------------------------------------------------------ */

  const handleGenerate = async () => {
    if (!request.skillName.trim()) {
      window.alert("Skill name is required.");
      return;
    }

    try {
      setGenerating(true);
      setGenerateError("");

      /*
       * Firebase callable function:
       *
       * generateSkill
       *
       * Same as Flutter:
       *
       * FirebaseFunctions.instance
       *   .httpsCallable("generateSkill")
       *   .call({
       *      "skill": widget.skillName,
       *      "gender": _gender
       *   });
       */

      const functions = getFunctions();

      const generateSkill = httpsCallable<
        {
          skill: string;
          gender: string;
        },
        GenerateSkillResult
      >(functions, "generateSkill");

      const result = await generateSkill({
        skill: request.skillName,
        gender,
      });

      const data = result.data;

      setForm((current) => ({
        ...current,
        title: request.skillName,
        description:
          data.description ?? "",
        image: data.imageUrl ?? "",
        sampleImage:
          data.sampleImageUrl ?? "",
      }));
    } catch (error) {
      console.error(
        "generateSkill failed:",
        error
      );

      setGenerateError(
        "Unable to generate the skill information. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Submit                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = () => {
    if (!form.title.trim()) {
      window.alert(
        "Please enter a skill name."
      );
      return;
    }

    if (!form.description.trim()) {
      window.alert(
        "Please enter a description."
      );
      return;
    }

    if (!form.image.trim()) {
      window.alert(
        "Please enter an image URL."
      );
      return;
    }

    if (!form.sampleImage.trim()) {
      window.alert(
        "Please enter a sample image URL."
      );
      return;
    }

    onApprove(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Approve Skill
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Configure the skill before adding it
              to Narp.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={
              processing || generating
            }
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Skill Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Skill Name
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  updateField(
                    "title",
                    e.target.value
                  )
                }
                disabled={
                  processing || generating
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
                disabled={
                  processing || generating
                }
                rows={4}
                placeholder="Enter a description or generate one with AI..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Image URL
              </label>

              <input
                type="url"
                value={form.image}
                onChange={(e) =>
                  updateField(
                    "image",
                    e.target.value
                  )
                }
                disabled={
                  processing || generating
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />

              {form.image.trim() && (
                <ImagePreview
                  src={form.image}
                  alt="Skill image preview"
                />
              )}
            </div>

            {/* Sample Image URL */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sample Image URL
              </label>

              <input
                type="url"
                value={form.sampleImage}
                onChange={(e) =>
                  updateField(
                    "sampleImage",
                    e.target.value
                  )
                }
                disabled={
                  processing || generating
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />

              {form.sampleImage.trim() && (
                <ImagePreview
                  src={form.sampleImage}
                  alt="Sample image preview"
                />
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value as
                      | "Male"
                      | "Female"
                  )
                }
                disabled={
                  processing || generating
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>
              </select>

              <p className="mt-2 text-xs text-slate-400">
                Gender is used by AI when generating
                the skill images.
              </p>
            </div>

            {/* AI Generate */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />

                    <h3 className="font-semibold text-blue-900">
                      Generate with AI
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-blue-700">
                    Generate the description and
                    images automatically.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={
                    generating ||
                    processing
                  }
                  onClick={handleGenerate}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>

              {generateError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {generateError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:flex-row">
          <button
            type="button"
            disabled={
              processing || generating
            }
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              processing ||
              generating
            }
            onClick={handleSubmit}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Approve
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Image Preview                                                              */
/* -------------------------------------------------------------------------- */

interface ImagePreviewProps {
  src: string;
  alt: string;
}

function ImagePreview({
  src,
  alt,
}: ImagePreviewProps) {
  const [failed, setFailed] =
    useState(false);

  if (failed) {
    return (
      <div className="mt-3 flex h-32 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm text-red-500">
        Unable to load image preview.
      </div>
    );
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <img
        src={src}
        alt={alt}
        className="h-40 w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}