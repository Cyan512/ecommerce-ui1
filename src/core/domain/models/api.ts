export interface ApiError {
  error: string
  [key: string]: string | undefined
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}
