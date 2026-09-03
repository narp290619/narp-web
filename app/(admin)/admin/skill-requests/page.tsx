"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  doc,
  writeBatch,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Check,
  X,
  Wrench,
  Vote,
  Users,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";

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

export default function SkillRequestsPage() {
  const [requests, setRequests] = useState<SkillRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState<string | null>(null);

  const [approveRequest, setApproveRequest] =
    useState<SkillRequest | null>(null);

  useEffect(() => {
    const requestsQuery = query(
      collection(db, "SkillRequests"),
      where("status", "==", "pending"),
      orderBy("votes", "desc")
    );

    const unsubscribe = onSnapshot(
      requestsQuery,
      (snapshot) => {
        const data: SkillRequest[] = snapshot.docs.map((document) => {
          const raw = document.data();

          return {
            id: document.id,
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
        console.error("Skill requests listener error:", snapshotError);
        setError("Unable to load skill requests.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const rejectRequest = async (request: SkillRequest) => {
    const confirmed = window.confirm(
      `Reject the skill request for "${request.skillName}"?`
    );

    if (!confirmed) return;

    try {
      setProcessingId(request.id);

      await updateDoc(doc(db, "SkillRequests", request.id), {
        status: "rejected",
        rejectedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error rejecting skill request:", error);
      alert("Failed to reject the skill request.");
    } finally {
      setProcessingId(null);
    }
  };

  const approveSkill = async (
    request: SkillRequest,
    form: ApproveForm
  ) => {
    try {
      setProcessingId(request.id);

      const batch = writeBatch(db);

      const skillRef = doc(db, "Skills", request.skillName);

      batch.set(skillRef, {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        skillSampleImage: form.sampleImage.trim(),
        totalMembers: 0,
      });

      const requestRef = doc(db, "SkillRequests", request.id);

      batch.update(requestRef, {
        status: "approved",
        approvedAt: serverTimestamp(),
      });

      await batch.commit();

      setApproveRequest(null);

      alert(`${form.title} approved successfully.`);
    } catch (error) {
      console.error("Error approving skill request:", error);
      alert("Failed to approve the skill request.");
    } finally {
      setProcessingId(null);
    }
  };

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
              Review and manage requested skills from Narp users.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
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
              (total, request) => total + request.votes,
              0
            )}
          />

          <SummaryCard
            icon={<Users className="h-5 w-5" />}
            label="Users Requesting"
            value={requests.reduce(
              (total, request) => total + request.requestedUsers.length,
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
      {!loading && !error && requests.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Wrench className="h-7 w-7 text-slate-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No pending skill requests
          </h2>

          <p className="mt-1 max-w-md text-sm text-slate-500">
            New skill requests from users will appear here automatically.
          </p>
        </div>
      )}

      {/* Requests */}
      {!loading && !error && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((request) => (
            <SkillRequestCard
              key={request.id}
              request={request}
              processing={processingId === request.id}
              onReject={() => rejectRequest(request)}
              onApprove={() => setApproveRequest(request)}
            />
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {approveRequest && (
        <ApproveSkillModal
          request={approveRequest}
          processing={processingId === approveRequest.id}
          onClose={() => {
            if (processingId !== approveRequest.id) {
              setApproveRequest(null);
            }
          }}
          onApprove={(form) =>
            approveSkill(approveRequest, form)
          }
        />
      )}
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
          {request.votes === 1 ? "vote" : "votes"}
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
/* Approve Modal                                                              */
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

  const updateField = (
    field: keyof ApproveForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert("Please enter a skill title.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter a skill description.");
      return;
    }

    if (!form.image.trim()) {
      alert("Please enter the skill image URL.");
      return;
    }

    if (!form.sampleImage.trim()) {
      alert("Please enter the sample image URL.");
      return;
    }

    onApprove(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Approve Skill
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create the new skill for Narp users.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Skill Name
            </label>

            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                updateField("title", e.target.value)
              }
              placeholder="e.g. Plumber"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              placeholder="Describe this skill..."
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Skill Image URL
            </label>

            <input
              type="url"
              value={form.image}
              onChange={(e) =>
                updateField("image", e.target.value)
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {form.image.trim() && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={form.image}
                  alt="Skill preview"
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Sample Image URL
            </label>

            <input
              type="url"
              value={form.sampleImage}
              onChange={(e) =>
                updateField("sampleImage", e.target.value)
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {form.sampleImage.trim() && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={form.sampleImage}
                  alt="Sample skill preview"
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row">
          <button
            type="button"
            disabled={processing}
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={handleSubmit}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {processing ? "Approving..." : "Approve Skill"}
          </button>
        </div>
      </div>
    </div>
  );
}