import api from "./api";

// ─── Types ────────────────────────────────────────────

export interface ExportOptions {
  fromDate?: string; // YYYY-MM-DD  (optional – defaults to 1 year ago on the server)
  toDate?: string; // YYYY-MM-DD  (optional – defaults to today on the server)
}

// ─── Helpers ──────────────────────────────────────────

/**
 * Builds the query string from optional date-range params.
 * e.g. "?fromDate=2024-01-01&toDate=2025-03-21"
 */
const buildQuery = (options: ExportOptions = {}): string => {
  const params = new URLSearchParams();
  if (options.fromDate) params.set("fromDate", options.fromDate);
  if (options.toDate) params.set("toDate", options.toDate);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

/**
 * Triggers a file download in the browser using a blob URL.
 */
const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// ─── API Functions ────────────────────────────────────

/**
 * Downloads the user's financial report as a CSV file.
 *
 * @example
 * // Default: rolling 12-month range
 * await exportAsCSV();
 *
 * @example
 * // Custom date range
 * await exportAsCSV({ fromDate: "2024-01-01", toDate: "2025-03-21" });
 */
export const exportAsCSV = async (
  options: ExportOptions = {},
): Promise<void> => {
  const response = await api.get<Blob>(`/export/csv${buildQuery(options)}`, {
    responseType: "blob",
  });

  // Prefer the server-supplied filename from Content-Disposition, fall back to a sensible default.
  const disposition = response.headers["content-disposition"] as
    | string
    | undefined;
  const serverFilename = disposition?.match(/filename="?([^"]+)"?/)?.[1];
  const filename =
    serverFilename ??
    `financial-report_${options.fromDate ?? "auto"}_to_${options.toDate ?? "auto"}.csv`;

  downloadBlob(response.data, filename);
};

/**
 * Downloads the user's financial report as a PDF file.
 *
 * @example
 * // Default: rolling 12-month range
 * await exportAsPDF();
 *
 * @example
 * // Custom date range
 * await exportAsPDF({ fromDate: "2024-01-01", toDate: "2025-03-21" });
 */
export const exportAsPDF = async (
  options: ExportOptions = {},
): Promise<void> => {
  const response = await api.get<Blob>(`/export/pdf${buildQuery(options)}`, {
    responseType: "blob",
  });

  const disposition = response.headers["content-disposition"] as
    | string
    | undefined;
  const serverFilename = disposition?.match(/filename="?([^"]+)"?/)?.[1];
  const filename =
    serverFilename ??
    `financial-report_${options.fromDate ?? "auto"}_to_${options.toDate ?? "auto"}.pdf`;

  downloadBlob(response.data, filename);
};
