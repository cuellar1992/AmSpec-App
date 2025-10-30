<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Row 1: Vessel Name, AmSpec Reference #, Client Reference # -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Vessel Name - Required -->
      <div>
        <label for="vesselName" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Vessel Name <span class="text-red-500">*</span>
        </label>
        <input
          id="vesselName"
          v-model="formData.vesselName"
          type="text"
          required
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          placeholder="Enter vessel name"
        />
      </div>

      <!-- AmSpec Reference # - Required -->
      <div>
        <label for="amspecRef" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          AmSpec Reference # <span class="text-red-500">*</span>
        </label>
        <input
          id="amspecRef"
          v-model="formData.amspecReference"
          type="text"
          required
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          placeholder="Enter AmSpec reference number"
        />
      </div>

      <!-- Client Reference # -->
      <div>
        <label for="clientRef" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Client Reference #
        </label>
        <input
          id="clientRef"
          v-model="formData.clientReference"
          type="text"
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          placeholder="Enter client reference number"
        />
      </div>
    </div>

    <!-- Row 2: Client, Product Types, Agent -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Client - Multi Select -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="client" class="block text-sm font-medium text-gray-900 dark:text-white">
            Client
          </label>
          <button
            type="button"
            @click="openManageModal('clients', 'Clients', 'Client')"
            class="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Manage
          </button>
        </div>
        <MultipleSelect
          v-model="formData.clients"
          :options="clientOptions"
          placeholder="Select clients"
        />
      </div>

      <!-- Product Types - Multi Select - Required -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="productTypes" class="block text-sm font-medium text-gray-900 dark:text-white">
            Product Types <span class="text-red-500">*</span>
          </label>
          <button
            type="button"
            @click="openManageModal('product-types', 'Product Types', 'Product Type')"
            class="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Manage
          </button>
        </div>
        <MultipleSelect
          v-model="formData.productTypes"
          :options="productTypeOptions"
          placeholder="Select product types"
          required
        />
      </div>

      <!-- Agent - Select -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="agent" class="block text-sm font-medium text-gray-900 dark:text-white">
            Agent
          </label>
          <button
            type="button"
            @click="openManageModal('agents', 'Agents', 'Agent')"
            class="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Manage
          </button>
        </div>
        <select
          id="agent"
          v-model="formData.agent"
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select agent</option>
          <option v-for="agent in agentOptions" :key="agent" :value="agent">
            {{ agent }}
          </option>
        </select>
      </div>
    </div>

    <!-- Row 3: Pilot on Board, ETB, ETC -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Pilot on Board - DateTime Picker -->
      <div>
        <label for="pilotOnBoard" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Pilot on Board
        </label>
        <div class="relative">
          <flat-pickr
            id="pilotOnBoard"
            v-model="formData.pilotOnBoard"
            :config="dateTimeConfig"
            class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            placeholder="Select date and time"
          />
          <span
            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
          >
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>

      <!-- ETB (Estimated Time of Berthing) - DateTime Picker -->
      <div>
        <label for="etb" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          ETB (Estimated Time of Berthing)
        </label>
        <div class="relative">
          <flat-pickr
            id="etb"
            v-model="formData.etb"
            :config="dateTimeConfig"
            class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            placeholder="Select date and time"
          />
          <span
            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
          >
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>

      <!-- ETC (Estimated Time of Completion) - DateTime Picker -->
      <div>
        <label for="etc" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          ETC (Estimated Time of Completion)
        </label>
        <div class="relative">
          <flat-pickr
            id="etc"
            v-model="formData.etc"
            :config="dateTimeConfig"
            class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            placeholder="Select date and time"
          />
          <span
            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
          >
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Row 4: Terminal, Berth, Surveyor -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Terminal - Select -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="terminal" class="block text-sm font-medium text-gray-900 dark:text-white">
            Terminal
          </label>
          <button
            type="button"
            @click="openManageModal('terminals', 'Terminals', 'Terminal')"
            class="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Manage
          </button>
        </div>
        <select
          id="terminal"
          v-model="formData.terminal"
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select terminal</option>
          <option v-for="terminal in terminalOptions" :key="terminal" :value="terminal">
            {{ terminal }}
          </option>
        </select>
      </div>

      <!-- Berth - Select -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="berth" class="block text-sm font-medium text-gray-900 dark:text-white">
            Berth
          </label>
          <button
            type="button"
            @click="openManageModal('berths', 'Berths', 'Berth')"
            class="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Manage
          </button>
        </div>
        <select
          id="berth"
          v-model="formData.berth"
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select berth</option>
          <option v-for="berth in berthOptions" :key="berth" :value="berth">
            {{ berth }}
          </option>
        </select>
      </div>

      <!-- Surveyor - Select -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="surveyor" class="block text-sm font-medium text-gray-900 dark:text-white">
            Surveyor
          </label>
          <button
            type="button"
            @click="openManageModal('surveyors', 'Surveyors', 'Surveyor')"
            class="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Manage
          </button>
        </div>
        <select
          id="surveyor"
          v-model="formData.surveyor"
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select surveyor</option>
          <option v-for="surveyor in surveyorOptions" :key="surveyor" :value="surveyor">
            {{ surveyor }}
          </option>
        </select>
      </div>
    </div>

    <!-- Row 5: Sampler, Chemist -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Sampler - Select -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="sampler" class="block text-sm font-medium text-gray-900 dark:text-white">
            Sampler
          </label>
          <button
            type="button"
            @click="openManageModal('samplers', 'Samplers', 'Sampler')"
            class="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Manage
          </button>
        </div>
        <select
          id="sampler"
          v-model="formData.sampler"
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select sampler</option>
          <option v-for="sampler in samplerOptions" :key="sampler" :value="sampler">
            {{ sampler }}
          </option>
        </select>
      </div>

      <!-- Chemist - Select -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label for="chemist" class="block text-sm font-medium text-gray-900 dark:text-white">
            Chemist
          </label>
          <button
            type="button"
            @click="openManageModal('chemists', 'Chemists', 'Chemist')"
            class="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Manage
          </button>
        </div>
        <select
          id="chemist"
          v-model="formData.chemist"
          class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select chemist</option>
          <option v-for="chemist in chemistOptions" :key="chemist" :value="chemist">
            {{ chemist }}
          </option>
        </select>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex gap-4 pt-4">
      <Button type="submit" variant="primary" size="md">
        Submit Nomination
      </Button>
      <Button type="button" variant="outline" size="md" @click="handleReset">
        Reset
      </Button>
    </div>
  </form>

  <!-- Manage Dropdown Modal (for non-Sampler dropdowns) -->
  <ManageDropdownModal
    v-if="manageModal.type !== 'samplers'"
    :is-open="manageModal.isOpen"
    :type="manageModal.type"
    :title="manageModal.title"
    :singular-title="manageModal.singularTitle"
    @close="closeManageModal"
    @updated="handleDropdownUpdated"
  />

  <!-- Manage Sampler Modal (special modal for samplers) -->
  <ManageSamplerModal
    :is-open="manageSamplerModal"
    @close="closeSamplerModal"
    @updated="handleDropdownUpdated"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MultipleSelect from '@/components/forms/FormElements/MultipleSelect.vue'
import Button from '@/components/ui/Button.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { createShipNomination, type ShipNominationData } from '@/services/shipNominationService'
import dropdownService from '@/services/dropdownService'
import ManageDropdownModal from './ManageDropdownModal.vue'
import ManageSamplerModal from './ManageSamplerModal.vue'

// Form data
const formData = ref({
  vesselName: '',
  amspecReference: '',
  clientReference: '',
  clients: [] as Array<{ value: string; label: string }>,
  productTypes: [] as Array<{ value: string; label: string }>,
  agent: '',
  pilotOnBoard: '',
  etb: '',
  etc: '',
  terminal: '',
  berth: '',
  surveyor: '',
  sampler: '',
  chemist: '',
})

// Dropdown options loaded from MongoDB
const clientOptions = ref<Array<{ value: string; label: string }>>([])
const productTypeOptions = ref<Array<{ value: string; label: string }>>([])
const agentOptions = ref<string[]>([])
const terminalOptions = ref<string[]>([])
const berthOptions = ref<string[]>([])
const surveyorOptions = ref<string[]>([])
const samplerOptions = ref<string[]>([])
const chemistOptions = ref<string[]>([])

// Load dropdown data from MongoDB
const loadDropdownData = async () => {
  try {
    // Load agents
    const agentsResponse = await dropdownService.getAgents()
    if (agentsResponse.success && agentsResponse.data) {
      agentOptions.value = agentsResponse.data.map((item) => item.name)
    }

    // Load berths
    const berthsResponse = await dropdownService.getBerths()
    if (berthsResponse.success && berthsResponse.data) {
      berthOptions.value = berthsResponse.data.map((item) => item.name)
    }

    // Load chemists
    const chemistsResponse = await dropdownService.getChemists()
    if (chemistsResponse.success && chemistsResponse.data) {
      chemistOptions.value = chemistsResponse.data.map((item) => item.name)
    }

    // Load samplers
    const samplersResponse = await dropdownService.getSamplers()
    if (samplersResponse.success && samplersResponse.data) {
      samplerOptions.value = samplersResponse.data.map((item) => item.name)
    }

    // Load surveyors
    const surveyorsResponse = await dropdownService.getSurveyors()
    if (surveyorsResponse.success && surveyorsResponse.data) {
      surveyorOptions.value = surveyorsResponse.data.map((item) => item.name)
    }

    // Load terminals
    const terminalsResponse = await dropdownService.getTerminals()
    if (terminalsResponse.success && terminalsResponse.data) {
      terminalOptions.value = terminalsResponse.data.map((item) => item.name)
    }

    // Load clients
    const clientsResponse = await dropdownService.getClients()
    if (clientsResponse.success && clientsResponse.data) {
      clientOptions.value = clientsResponse.data.map((item) => ({ value: item.name, label: item.name }))
    }

    // Load product types
    const productTypesResponse = await dropdownService.getProductTypes()
    if (productTypesResponse.success && productTypesResponse.data) {
      productTypeOptions.value = productTypesResponse.data.map((item) => ({ value: item.name, label: item.name }))
    }
  } catch (error) {
    console.error('Error loading dropdown data:', error)
  }
}

// Load dropdown data on component mount
onMounted(() => {
  loadDropdownData()
})

// Flatpickr configuration for date + time
const dateTimeConfig = {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  altInput: true,
  altFormat: 'F j, Y at h:i K',
  time_24hr: true,
  minuteIncrement: 15,
  locale: {
    firstDayOfWeek: 1, // Start week on Monday (0 = Sunday, 1 = Monday)
  },
}

// Loading state
const isSubmitting = ref(false)

// Form handlers
const handleSubmit = async () => {
  // Validate required fields
  if (!formData.value.vesselName || !formData.value.amspecReference || formData.value.productTypes.length === 0) {
    alert('Please fill in all required fields: Vessel Name, AmSpec Reference #, and Product Types')
    return
  }

  try {
    isSubmitting.value = true

    // Prepare data for API
    const nominationData: ShipNominationData = {
      vesselName: formData.value.vesselName,
      amspecReference: formData.value.amspecReference,
      clientReference: formData.value.clientReference || undefined,
      clients: formData.value.clients.length > 0 ? formData.value.clients.map((c) => c.value) : undefined,
      productTypes: formData.value.productTypes.map((pt) => pt.value),
      agent: formData.value.agent || undefined,
      pilotOnBoard: formData.value.pilotOnBoard || undefined,
      etb: formData.value.etb || undefined,
      etc: formData.value.etc || undefined,
      terminal: formData.value.terminal || undefined,
      berth: formData.value.berth || undefined,
      surveyor: formData.value.surveyor || undefined,
      sampler: formData.value.sampler || undefined,
      chemist: formData.value.chemist || undefined,
    }

    // Send to backend API
    const response = await createShipNomination(nominationData)

    if (response.success) {
      alert(`✅ Ship Nomination created successfully!\n\nReference: ${response.data?.amspecReference}\nVessel: ${response.data?.vesselName}`)

      // Reset form after successful submission
      handleReset()
    } else {
      alert(`❌ Error: ${response.message || 'Failed to create nomination'}`)
    }
  } catch (error: any) {
    console.error('Error submitting form:', error)

    // Handle specific error types
    if (error.response?.data) {
      const errorData = error.response.data
      if (errorData.errors && Array.isArray(errorData.errors)) {
        alert(`❌ Validation Errors:\n${errorData.errors.join('\n')}`)
      } else {
        alert(`❌ Error: ${errorData.message || 'Failed to create nomination'}`)
      }
    } else {
      alert('❌ Network error. Please make sure the backend server is running on port 5000.')
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleReset = () => {
  formData.value = {
    vesselName: '',
    amspecReference: '',
    clientReference: '',
  clients: [] as Array<{ value: string; label: string }>,
  productTypes: [] as Array<{ value: string; label: string }>,
    agent: '',
    pilotOnBoard: '',
    etb: '',
    etc: '',
    terminal: '',
    berth: '',
    surveyor: '',
    sampler: '',
    chemist: '',
  }
}

// Manage modal state
const manageModal = ref({
  isOpen: false,
  type: '',
  title: '',
  singularTitle: '',
})

// Sampler modal state
const manageSamplerModal = ref(false)

// Open manage modal
const openManageModal = (type: string, title: string, singularTitle: string) => {
  // Use special modal for samplers
  if (type === 'samplers') {
    manageSamplerModal.value = true
    return
  }

  // Use generic modal for other dropdowns
  manageModal.value = {
    isOpen: true,
    type,
    title,
    singularTitle,
  }
}

// Close manage modal
const closeManageModal = () => {
  manageModal.value.isOpen = false
}

// Close sampler modal
const closeSamplerModal = () => {
  manageSamplerModal.value = false
}

// Handle dropdown updated (reload dropdown data)
const handleDropdownUpdated = () => {
  loadDropdownData()
}
</script>
