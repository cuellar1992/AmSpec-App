import api from './api'

export interface ShipNominationData {
  vesselName: string
  amspecReference: string
  clientReference?: string
  clients?: string[]
  productTypes: string[]
  agent?: string
  pilotOnBoard?: string
  etb?: string
  etc?: string
  terminal?: string
  berth?: string
  surveyor?: string
  sampler?: string
  chemist?: string
  status?: 'pending' | 'approved' | 'in-progress' | 'completed' | 'cancelled'
}

export interface ShipNomination extends ShipNominationData {
  _id: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: string[]
  count?: number
  total?: number
  page?: number
  pages?: number
  limit?: number
  exists?: boolean
}

// Get all ship nominations (paginated)
export const getAllShipNominations = async (
  params?: { page?: number; limit?: number; sortBy?: 'createdAt' | 'etb'; sortOrder?: 'asc' | 'desc' }
): Promise<ApiResponse<ShipNomination[]>> => {
  const response = await api.get('/ship-nominations', { params })
  return response.data
}

// Get ship nomination by ID
export const getShipNominationById = async (id: string): Promise<ApiResponse<ShipNomination>> => {
  const response = await api.get(`/ship-nominations/${id}`)
  return response.data
}

// Check if AmSpec reference exists
export const checkAmspecReference = async (
  amspecReference: string
): Promise<ApiResponse<ShipNomination | null>> => {
  const encoded = encodeURIComponent(amspecReference)
  const response = await api.get(`/ship-nominations/ref/${encoded}`)
  return response.data
}

// Create new ship nomination
export const createShipNomination = async (
  data: ShipNominationData
): Promise<ApiResponse<ShipNomination>> => {
  const response = await api.post('/ship-nominations', data)
  return response.data
}

// Update ship nomination
export const updateShipNomination = async (
  id: string,
  data: Partial<ShipNominationData>
): Promise<ApiResponse<ShipNomination>> => {
  const response = await api.put(`/ship-nominations/${id}`, data)
  return response.data
}

// Delete ship nomination
export const deleteShipNomination = async (id: string): Promise<ApiResponse<{}>> => {
  const response = await api.delete(`/ship-nominations/${id}`)
  return response.data
}

// Get ship nominations by status
export const getShipNominationsByStatus = async (
  status: string
): Promise<ApiResponse<ShipNomination[]>> => {
  const response = await api.get(`/ship-nominations/status/${status}`)
  return response.data
}
