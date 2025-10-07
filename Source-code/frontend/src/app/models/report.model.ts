export interface ReportRequest {
  startDate: string;
  endDate: string;
}

export interface ReportResponse {
  jobId: string;
  message: string;
}
