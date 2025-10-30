import api from './api'

export interface MolekulisLoadingData {
  when: string // 'YYYY-MM-DD'
  who: string
  startAt: string // ISO datetime
  endAt: string   // ISO datetime
  loads: Array<{ time: string; product: 'Hyvolt I' | 'Hyvol III' }>
}

export interface MolekulisLoading extends MolekulisLoadingData {
  _id: string
  hours: number
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  total?: number
  count?: number
  page?: number
  pages?: number
  limit?: number
}

export const listMolekulisLoadings = async (params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }): Promise<ApiResponse<MolekulisLoading[]>> => {
  console.debug('[ML][svc] list params', params)
  const response = await api.get('/molekulis-loading', { params })
  console.debug('[ML][svc] list response', response?.data)
  return response.data
}

export const createMolekulisLoading = async (data: MolekulisLoadingData): Promise<ApiResponse<MolekulisLoading>> => {
  console.debug('[ML][svc] create payload', data)
  const response = await api.post('/molekulis-loading', data)
  console.debug('[ML][svc] create response', response?.data)
  return response.data
}

export const updateMolekulisLoading = async (id: string, data: Partial<MolekulisLoadingData>): Promise<ApiResponse<MolekulisLoading>> => {
  console.debug('[ML][svc] update id', id, 'payload', data)
  const response = await api.put(`/molekulis-loading/${id}`, data)
  console.debug('[ML][svc] update response', response?.data)
  return response.data
}

export const deleteMolekulisLoading = async (id: string): Promise<ApiResponse<{}>> => {
  const response = await api.delete(`/molekulis-loading/${id}`)
  return response.data
}


