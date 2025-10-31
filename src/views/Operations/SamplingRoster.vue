<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Sampling Roster" />

    <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: Form -->
      <ComponentCard title="New Sampling Roster" description="Register a new sampling roster entry">
        <div class="p-6">
          <form class="space-y-6" @keydown.enter.prevent>

            <!-- Search Ship Nomination -->
            <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Search Ship Nomination
              </label>
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @input="handleSearch"
                  @focus="showDropdown = true"
                  type="text"
                  class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Search by vessel name or AmSpec reference..."
                />
                <svg
                  class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <!-- Info message when showing only recent items -->
                <div
                  v-if="showDropdown && !searchQuery && filteredShipNominations.length > 0"
                  class="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-blue-50 shadow-lg dark:border-gray-700 dark:bg-blue-900/20 p-3 mb-1"
                >
                  <p class="text-xs text-blue-700 dark:text-blue-300">
                    Showing last 5 ship nominations. Type to search all records.
                  </p>
                </div>

                <!-- Dropdown Results -->
                <div
                  v-if="showDropdown && filteredShipNominations.length > 0"
                  :class="[
                    'absolute z-10 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 max-h-60 overflow-y-auto',
                    !searchQuery ? 'mt-16' : 'mt-1'
                  ]"
                >
                  <button
                    v-for="ship in filteredShipNominations"
                    :key="ship._id"
                    type="button"
                    @click="selectShipNomination(ship)"
                    class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                  >
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ ship.vesselName }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Ref: {{ ship.amspecReference }}
                        </p>
                      </div>
                      <span
                        class="text-xs px-2 py-1 rounded-full"
                        :class="getStatusBadgeClass(ship.status)"
                      >
                        {{ ship.status || 'pending' }}
                      </span>
                    </div>
                    <div v-if="ship.berth || ship.etb" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span v-if="ship.berth">Berth: {{ ship.berth }}</span>
                      <span v-if="ship.berth && ship.etb"> | </span>
                      <span v-if="ship.etb">ETB: {{ formatDateShort(ship.etb) }}</span>
                    </div>
                  </button>
                </div>

                <!-- No results message -->
                <div
                  v-if="showDropdown && searchQuery && filteredShipNominations.length === 0 && !isLoadingShips"
                  class="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 p-4"
                >
                  <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
                    No ship nominations found for "{{ searchQuery }}"
                  </p>
                </div>

                <!-- Loading indicator -->
                <div
                  v-if="isLoadingShips"
                  class="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 p-4"
                >
                  <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Loading...
                  </p>
                </div>
              </div>
            </div>

            <!-- Vessel -->
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Vessel <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.vessel"
                type="text"
                readonly
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                placeholder="Select from Ship Nomination"
              />
            </div>

            <!-- Row: Berth + AmSpec Ref -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Berth <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.berth"
                  type="text"
                  readonly
                  class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  placeholder="From Ship Nomination"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  AmSpec Ref <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.amspecRef"
                  type="text"
                  readonly
                  class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  placeholder="From Ship Nomination"
                />
              </div>
            </div>

            <!-- Row: POB + ETB -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  POB <span class="text-red-500">*</span>
                </label>
                <input
                  :value="formatDateTimeDisplay(formData.pob)"
                  type="text"
                  readonly
                  class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  placeholder="From Ship Nomination"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  ETB <span class="text-red-500">*</span>
                </label>
                <input
                  :value="formatDateTimeDisplay(formData.etb)"
                  type="text"
                  readonly
                  class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  placeholder="From Ship Nomination"
                />
              </div>
            </div>

            <!-- Row: Start Discharge + Discharge Time (Hrs) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Start Discharge <span class="text-red-500">*</span>
                </label>
                <flat-pickr
                  v-model="formData.startDischarge"
                  :config="dateTimeConfig"
                  class="h-11 w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white"
                  :class="submittedOnce && !formData.startDischarge ? 'border-red-500 focus:ring-red-500/20 dark:border-red-600' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700'"
                  placeholder="Auto-calculated (ETB + 3hrs)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Discharge Time (Hrs) <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="formData.dischargeTimeHours"
                  type="number"
                  min="0"
                  step="1"
                  class="h-11 w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-white"
                  :class="submittedOnce && !formData.dischargeTimeHours ? 'border-red-500 focus:ring-red-500/20 dark:border-red-600' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700'"
                  placeholder="Enter hours"
                />
              </div>
            </div>

            <!-- ETC (Calculated) -->
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                ETC <span class="text-red-500">*</span>
              </label>
              <input
                :value="calculatedETC"
                readonly
                class="h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                placeholder="Auto-calculated"
              />
            </div>

            <!-- Cargo -->
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Cargo <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.cargo"
                type="text"
                readonly
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                placeholder="From Ship Nomination"
              />
            </div>

            <!-- Surveyor -->
            <div>
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Surveyor <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.surveyor"
                type="text"
                readonly
                class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                placeholder="From Ship Nomination"
              />
            </div>

            <!-- Row: Pre Discharge Testing + Post Discharge Testing -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Pre Discharge Testing
                </label>
                <input
                  v-model="formData.preDischargeTest"
                  type="text"
                  readonly
                  class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  placeholder="From Ship Nomination (Chemist)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Post Discharge Testing
                </label>
                <input
                  v-model="formData.postDischargeTest"
                  type="text"
                  readonly
                  class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  placeholder="From Ship Nomination (Chemist)"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end">
              <div class="flex gap-2">
                <button
                  type="button"
                  @click="handleSubmit"
                  :disabled="isSubmitting"
                  class="rounded-lg bg-brand-500 px-6 py-2.5 text-white font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isEditing ? 'Update' : 'Save' }}
                </button>
                <button
                  v-if="isEditing"
                  type="button"
                  class="rounded-lg bg-orange-500 px-6 py-2.5 text-white font-medium hover:bg-orange-600"
                  @click="cancelEdit"
                >
                  Cancel Edit
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-gray-200 px-6 py-2.5 text-gray-900 font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                  @click="resetForm"
                >
                  Reset
                </button>
              </div>
            </div>

          </form>
        </div>
      </ComponentCard>

      <!-- Right: Office Sampling -->
      <ComponentCard title="Office Sampling" description="Sampling roster schedule">
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Who</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Start Office</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Finish Sampling</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Hours</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <tr v-if="officeSampling.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Select a Ship Nomination to populate Office Sampling
                  </td>
                </tr>
                <tr v-for="(sample, index) in officeSampling" :key="sample.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <!-- Who -->
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {{ sample.who }}
                  </td>

                  <!-- Start Office -->
                  <td class="px-4 py-3 text-sm">
                    <flat-pickr
                      v-if="sample.isEditing"
                      v-model="sample.startOffice"
                      :config="dateTimeConfig"
                      class="h-9 w-full appearance-none rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Select start time"
                    />
                    <span v-else class="text-gray-700 dark:text-gray-300">
                      {{ sample.startOffice ? formatDateTimeDisplay(sample.startOffice) : '-' }}
                    </span>
                  </td>

                  <!-- Finish Sampling -->
                  <td class="px-4 py-3 text-sm">
                    <flat-pickr
                      v-if="sample.isEditing"
                      v-model="sample.finishSampling"
                      :config="dateTimeConfig"
                      class="h-9 w-full appearance-none rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Select finish time"
                    />
                    <span v-else class="text-gray-700 dark:text-gray-300">
                      {{ sample.finishSampling ? formatDateTimeDisplay(sample.finishSampling) : '-' }}
                    </span>
                  </td>

                  <!-- Hours (Calculated) -->
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {{ calculateHours(sample.startOffice, sample.finishSampling) }}
                  </td>

                  <!-- Actions -->
                  <td class="px-4 py-3 text-sm">
                    <div class="flex items-center gap-2">
                      <button
                        v-if="!sample.isEditing"
                        @click="editOfficeSample(index)"
                        class="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all"
                        title="Edit"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        v-if="sample.isEditing"
                        @click="saveOfficeSample(index)"
                        class="rounded-lg p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 transition-all"
                        title="Save"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        v-if="sample.isEditing"
                        @click="cancelEditOfficeSample(index)"
                        class="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all"
                        title="Cancel"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ComponentCard>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useToast } from 'vue-toastification'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { getAllShipNominations, searchShipNominations, type ShipNomination } from '@/services/shipNominationService'
import dropdownService from '@/services/dropdownService'

const toast = useToast()

// Ship Nomination Search
const searchQuery = ref('')
const showDropdown = ref(false)
const isLoadingShips = ref(false)
const shipNominations = ref<ShipNomination[]>([])
const searchTimeout = ref<NodeJS.Timeout | null>(null)

// Show filtered results (from loaded data)
const filteredShipNominations = computed(() => {
  return shipNominations.value
})

// Load initial ship nominations (only last 5)
const loadInitialShipNominations = async () => {
  isLoadingShips.value = true
  try {
    const response = await getAllShipNominations({ limit: 5, sortBy: 'etb', sortOrder: 'desc' })
    if (response.success && response.data) {
      shipNominations.value = response.data
    }
  } catch (error) {
    console.error('Error loading ship nominations:', error)
  } finally {
    isLoadingShips.value = false
  }
}

// Search ship nominations with debounce
const handleSearch = async () => {
  showDropdown.value = true

  // Clear previous timeout
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // If search query is empty, load only last 5
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    await loadInitialShipNominations()
    return
  }

  // Debounce search: wait 500ms after user stops typing
  searchTimeout.value = setTimeout(async () => {
    isLoadingShips.value = true
    try {
      const response = await searchShipNominations(searchQuery.value, 20)
      if (response.success && response.data) {
        shipNominations.value = response.data
      }
    } catch (error) {
      console.error('Error searching ship nominations:', error)
      toast.error('Error searching ship nominations')
    } finally {
      isLoadingShips.value = false
    }
  }, 500) // 500ms debounce
}

// Select ship nomination and fill form
const selectShipNomination = (ship: ShipNomination) => {
  // Fill form with ship nomination data
  formData.value.vessel = ship.vesselName
  formData.value.berth = ship.berth || ''
  formData.value.amspecRef = ship.amspecReference
  formData.value.pob = ship.pilotOnBoard || ''
  formData.value.etb = ship.etb || ''
  formData.value.cargo = ship.productTypes?.join(', ') || ''
  formData.value.surveyor = ship.surveyor || ''

  // Calculate Start Discharge automatically: ETB + 3 hours
  if (ship.etb) {
    const etbDate = new Date(ship.etb)
    const startDischargeDate = new Date(etbDate.getTime() + (3 * 60 * 60 * 1000))
    // Format for flatpickr: 'Y-m-d H:i'
    const year = startDischargeDate.getFullYear()
    const month = String(startDischargeDate.getMonth() + 1).padStart(2, '0')
    const day = String(startDischargeDate.getDate()).padStart(2, '0')
    const hours = String(startDischargeDate.getHours()).padStart(2, '0')
    const minutes = String(startDischargeDate.getMinutes()).padStart(2, '0')
    formData.value.startDischarge = `${year}-${month}-${day} ${hours}:${minutes}`
  } else {
    formData.value.startDischarge = ''
  }

  // Reset discharge time hours (user will input manually)
  formData.value.dischargeTimeHours = null

  // Fill Pre/Post Discharge Testing with Chemist name
  formData.value.preDischargeTest = ship.chemist || ''
  formData.value.postDischargeTest = ship.chemist || ''

  // Populate Office Sampling table
  populateOfficeSampling(ship)

  // Close dropdown and clear search
  showDropdown.value = false
  searchQuery.value = `${ship.vesselName} - ${ship.amspecReference}`

  toast.success('Form filled with ship nomination data')
}

// Populate Office Sampling table based on ship nomination
const populateOfficeSampling = (ship: ShipNomination) => {
  // Clear existing data
  officeSampling.value = []

  // Check if we have sampler from ship nomination
  if (!ship.sampler || !ship.pilotOnBoard) {
    return
  }

  // Calculate start office (same as POB)
  const startOffice = ship.pilotOnBoard

  // Calculate finish sampling (POB + 6 hours)
  let finishSampling = ''
  if (startOffice) {
    const pobDate = new Date(startOffice)
    const finishDate = new Date(pobDate.getTime() + (6 * 60 * 60 * 1000))

    // Format for flatpickr: 'Y-m-d H:i'
    const year = finishDate.getFullYear()
    const month = String(finishDate.getMonth() + 1).padStart(2, '0')
    const day = String(finishDate.getDate()).padStart(2, '0')
    const hours = String(finishDate.getHours()).padStart(2, '0')
    const minutes = String(finishDate.getMinutes()).padStart(2, '0')
    finishSampling = `${year}-${month}-${day} ${hours}:${minutes}`
  }

  // Add sampler to office sampling table
  officeSampling.value.push({
    id: generateSampleId(),
    who: ship.sampler,
    startOffice: startOffice,
    finishSampling: finishSampling,
    isEditing: false
  })
}

// Status badge class
const getStatusBadgeClass = (status?: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'approved':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

// Format date for display
const formatDateShort = (dateString: string) => {
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Close dropdown when clicking outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showDropdown.value = false
    }
  })
}

// Form data interface
interface SamplingRosterData {
  vessel: string
  berth: string
  amspecRef: string
  pob: string
  etb: string
  startDischarge: string
  dischargeTimeHours: number | null
  cargo: string
  surveyor: string
  preDischargeTest: string
  postDischargeTest: string
}

// Form data
const formData = ref<SamplingRosterData>({
  vessel: '',
  berth: '',
  amspecRef: '',
  pob: '',
  etb: '',
  startDischarge: '',
  dischargeTimeHours: null,
  cargo: '',
  surveyor: '',
  preDischargeTest: '',
  postDischargeTest: ''
})

// Date/Time picker configuration
const dateTimeConfig = {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  altInput: true,
  altFormat: 'F j, Y at h:i K',
  time_24hr: true,
  minuteIncrement: 15,
  locale: { firstDayOfWeek: 1 }
}

// Surveyor options (loaded from service)
const surveyorOptions = ref<string[]>([])

// Office Sampling data
interface OfficeSample {
  id: string
  who: string
  startOffice: string
  finishSampling: string
  isEditing: boolean
  originalData?: {
    startOffice: string
    finishSampling: string
  }
}

const officeSampling = ref<OfficeSample[]>([])

// Generate unique ID for office samples
const generateSampleId = () => {
  return `sample-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Format date/time for display in readonly fields
const formatDateTimeDisplay = (dateString: string) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Computed: Calculate ETC based on Start Discharge + Discharge Time (Hrs)
const calculatedETC = computed(() => {
  if (!formData.value.startDischarge || !formData.value.dischargeTimeHours) return ''

  const startDate = new Date(formData.value.startDischarge)
  const hours = formData.value.dischargeTimeHours

  // Add hours to start discharge
  const etcDate = new Date(startDate.getTime() + (hours * 60 * 60 * 1000))

  return etcDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
})

// Calculate hours between two datetime strings
const calculateHours = (start: string, finish: string): string => {
  if (!start || !finish) return '0.00'

  const startDate = new Date(start)
  const finishDate = new Date(finish)
  const diff = finishDate.getTime() - startDate.getTime()

  if (diff < 0) return '0.00'

  const hours = diff / (1000 * 60 * 60)
  return hours.toFixed(2)
}

// Edit office sample (enable editing mode)
const editOfficeSample = async (index: number) => {
  const sample = officeSampling.value[index]

  // Save original data for cancel
  sample.originalData = {
    startOffice: sample.startOffice,
    finishSampling: sample.finishSampling
  }
  sample.isEditing = true

  // Wait for DOM update
  await nextTick()
}

// Save office sample (disable editing mode)
const saveOfficeSample = async (index: number) => {
  const sample = officeSampling.value[index]

  // Validate that both dates are set
  if (!sample.startOffice || !sample.finishSampling) {
    toast.warning('Please set both Start Office and Finish Sampling times')
    return
  }

  // Validate that finish is after start
  const start = new Date(sample.startOffice)
  const finish = new Date(sample.finishSampling)

  if (finish <= start) {
    toast.warning('Finish Sampling must be after Start Office')
    return
  }

  // Clear original data and exit editing mode
  delete sample.originalData
  sample.isEditing = false

  // Wait for DOM update
  await nextTick()

  toast.success('Office sampling updated')
}

// Cancel edit office sample (restore original data)
const cancelEditOfficeSample = async (index: number) => {
  const sample = officeSampling.value[index]

  // Restore original data
  if (sample.originalData) {
    sample.startOffice = sample.originalData.startOffice
    sample.finishSampling = sample.originalData.finishSampling
    delete sample.originalData
  }

  sample.isEditing = false

  // Wait for DOM update
  await nextTick()
}

// Form submission
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref<string>('')
const submittedOnce = ref(false)

const validateForm = () => {
  submittedOnce.value = true

  // Check all required fields
  if (!formData.value.vessel || !formData.value.berth || !formData.value.amspecRef ||
      !formData.value.pob || !formData.value.etb || !formData.value.startDischarge ||
      !formData.value.dischargeTimeHours || !formData.value.cargo || !formData.value.surveyor) {
    toast.warning('Please fill in all required fields')
    return false
  }

  // Validate discharge time hours is a positive number
  if (formData.value.dischargeTimeHours <= 0) {
    toast.warning('Discharge Time (Hrs) must be greater than 0')
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  if (!validateForm()) {
    isSubmitting.value = false
    return
  }

  try {
    // TODO: Call API service to save/update
    toast.success(isEditing.value ? 'Entry updated successfully' : 'Entry created successfully')
    resetForm()
    // TODO: Reload items
  } catch (error) {
    toast.error('Failed to save entry')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    vessel: '',
    berth: '',
    amspecRef: '',
    pob: '',
    etb: '',
    startDischarge: '',
    dischargeTimeHours: null,
    cargo: '',
    surveyor: '',
    preDischargeTest: '',
    postDischargeTest: ''
  }
  submittedOnce.value = false
  isEditing.value = false
  editingId.value = ''
  searchQuery.value = ''

  // Clear office sampling table
  officeSampling.value = []
}

const cancelEdit = () => {
  resetForm()
}

// Load ship nominations and surveyors on component mount
onMounted(async () => {
  // Load only last 5 ship nominations initially
  await loadInitialShipNominations()

  // Load surveyor options
  const surveyorsResponse = await dropdownService.getSurveyors(true)
  if (surveyorsResponse.success && surveyorsResponse.data) {
    surveyorOptions.value = surveyorsResponse.data.map((s: any) => s.name)
  }
})
</script>
