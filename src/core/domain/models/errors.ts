export interface ApiHttpError {
  status: number
  body: { error?: string; [key: string]: string | undefined }
}
