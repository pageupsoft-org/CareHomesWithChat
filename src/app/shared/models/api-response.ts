import { ResponseException } from './response-exception'

export class ApiResponse {
  Version: string
  StatusCode: number
  Message: string
  ResponseException: ResponseException
  Result: any
}
