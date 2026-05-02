import { apiClient } from "./apiClient"
import { http } from "./http"

export interface ApiKeyPermission {
  [key: string]: string
}

export interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  permissions: string[]
  rateLimit: number
  isActive: boolean
  lastUsedAt: string | null
  createdAt: string
}

export interface CreateApiKeyResponse {
  success: boolean
  data: ApiKey & { rawKey: string }
}

export interface ListApiKeysResponse {
  success: boolean
  data: ApiKey[]
}

export interface DeleteApiKeyResponse {
  success: boolean
  data: {
    id: string
    isActive: boolean
  }
}

export interface CreateApiKeyPayload {
  name: string
  permissions: string[]
  rateLimit: number
}

const BASE_URL = `https://mediverify.up.railway.app/api/api-keys`

export async function createApiKey(
  payload: CreateApiKeyPayload
): Promise<CreateApiKeyResponse> {
  return http<CreateApiKeyResponse>(BASE_URL, {
    
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function listApiKeys(): Promise<ListApiKeysResponse> {
  return http<ListApiKeysResponse>(BASE_URL, {
    method: "GET",
  })
}

export async function deleteApiKey(id: string): Promise<DeleteApiKeyResponse> {
  return http<DeleteApiKeyResponse>(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })
}
