import api from './api'
import type { ApiResponse } from './shipNominationService'

export interface DropdownItem {
  _id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Generic dropdown service for all dropdown endpoints
 */
class DropdownService {
  private baseUrl = '/dropdowns'

  // Get all items for a specific dropdown type
  async getAll(type: string, includeInactive = false): Promise<ApiResponse<DropdownItem[]>> {
    try {
      const params = includeInactive ? { includeInactive: 'true' } : {}
      const response = await api.get(`${this.baseUrl}/${type}`, { params })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || `Failed to fetch ${type}`,
        error: error.message,
      }
    }
  }

  // Get single item by ID
  async getById(type: string, id: string): Promise<ApiResponse<DropdownItem>> {
    try {
      const response = await api.get(`${this.baseUrl}/${type}/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || `Failed to fetch ${type} item`,
        error: error.message,
      }
    }
  }

  // Create new item
  async create(type: string, name: string): Promise<ApiResponse<DropdownItem>> {
    try {
      const response = await api.post(`${this.baseUrl}/${type}`, { name })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || `Failed to create ${type}`,
        error: error.message,
      }
    }
  }

  // Update item
  async update(
    type: string,
    id: string,
    data: { 
      name?: string
      isActive?: boolean
      email?: string
      phone?: string
      has24HourRestriction?: boolean
      restrictedDays?: number[]
      [key: string]: any
    }
  ): Promise<ApiResponse<DropdownItem>> {
    try {
      const response = await api.put(`${this.baseUrl}/${type}/${id}`, data)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || `Failed to update ${type}`,
        error: error.message,
      }
    }
  }

  // Delete item (soft delete)
  async delete(type: string, id: string): Promise<ApiResponse<DropdownItem>> {
    try {
      const response = await api.delete(`${this.baseUrl}/${type}/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || `Failed to delete ${type}`,
        error: error.message,
      }
    }
  }

  // Permanent delete
  async permanentDelete(type: string, id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`${this.baseUrl}/${type}/${id}/permanent`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || `Failed to permanently delete ${type}`,
        error: error.message,
      }
    }
  }

  // Specific methods for each dropdown type
  async getAgents(includeInactive = false) {
    return this.getAll('agents', includeInactive)
  }

  async getBerths(includeInactive = false) {
    return this.getAll('berths', includeInactive)
  }

  async getChemists(includeInactive = false) {
    return this.getAll('chemists', includeInactive)
  }

  async getSamplers(includeInactive = false) {
    return this.getAll('samplers', includeInactive)
  }

  async getSurveyors(includeInactive = false) {
    return this.getAll('surveyors', includeInactive)
  }

  async getTerminals(includeInactive = false) {
    return this.getAll('terminals', includeInactive)
  }

  async getClients(includeInactive = false) {
    return this.getAll('clients', includeInactive)
  }

  async getProductTypes(includeInactive = false) {
    return this.getAll('product-types', includeInactive)
  }
}

export const dropdownService = new DropdownService()
export default dropdownService
