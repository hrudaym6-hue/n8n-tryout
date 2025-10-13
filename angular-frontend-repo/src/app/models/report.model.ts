export interface ReportRequest {
  startDate: string;
  endDate: string;
}

export interface ReportResponse {
  jobId: string;
  status: string;
  message: string;
  reportUrl?: string;
}
