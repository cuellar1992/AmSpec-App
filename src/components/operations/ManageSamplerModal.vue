<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <!-- Modal Container -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl transform transition-all"
            >
              <!-- Modal Header -->
              <div
                class="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gradient-to-r from-brand-50 to-white dark:from-gray-800 dark:to-gray-800"
              >
                <DialogTitle class="text-xl font-semibold text-gray-900 dark:text-white">
                  Manage Samplers
                </DialogTitle>
                <button
                  @click="handleClose"
                  class="rounded-lg p-2 text-gray-400 hover:bg-white/50 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white transition-all duration-200"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Add New Sampler Form -->
              <div class="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
                <form @submit.prevent="handleAdd">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <!-- Name -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="newSampler.name"
                        type="text"
                        placeholder="Enter sampler name"
                        required
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition-all duration-200"
                      />
                    </div>

                    <!-- Email -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Email
                      </label>
                      <input
                        v-model="newSampler.email"
                        type="email"
                        placeholder="sampler@amspec.com"
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition-all duration-200"
                      />
                    </div>

                    <!-- Phone -->
                    <div>
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Phone
                      </label>
                      <input
                        v-model="newSampler.phone"
                        type="tel"
                        placeholder="+61 400 000 000"
                        class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition-all duration-200"
                      />
                    </div>

                    <!-- 24 Hour Restriction Switch -->
                    <div class="flex items-center gap-3">
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          v-model="newSampler.has24HourRestriction"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"
                        ></div>
                        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-white">
                          24-Hour Restriction
                        </span>
                      </label>
                    </div>
                  </div>

                  <!-- Restricted Days -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Restricted Days (days sampler cannot work)
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <label
                        v-for="(day, index) in daysOfWeek"
                        :key="index"
                        class="flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all duration-200"
                        :class="
                          newSampler.restrictedDays.includes(index)
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                        "
                      >
                        <input
                          type="checkbox"
                          :checked="newSampler.restrictedDays.includes(index)"
                          @change="toggleRestrictedDay(newSampler.restrictedDays, index)"
                          class="sr-only"
                        />
                        {{ day }}
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    :disabled="isAdding || !newSampler.name.trim()"
                    class="w-full rounded-lg bg-brand-500 px-6 py-2.5 text-white font-medium hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span v-if="isAdding" class="flex items-center justify-center gap-2">
                      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding Sampler...
                    </span>
                    <span v-else>Add Sampler</span>
                  </button>
                </form>
              </div>

              <!-- Samplers List -->
              <div class="max-h-[500px] overflow-y-auto px-6 py-4">
                <div v-if="isLoading" class="text-center py-12">
                  <div
                    class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"
                  ></div>
                  <p class="mt-3 text-gray-500 dark:text-gray-400 font-medium">Loading samplers...</p>
                </div>

                <div v-else-if="samplers.length === 0" class="text-center py-12">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p class="mt-3 text-gray-500 dark:text-gray-400 font-medium">No samplers found</p>
                  <p class="mt-1 text-sm text-gray-400 dark:text-gray-500">
                    Get started by adding one above
                  </p>
                </div>

                <TransitionGroup v-else name="list" tag="div" class="space-y-3">
                  <div
                    v-for="sampler in samplers"
                    :key="sampler._id"
                    class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 hover:shadow-md"
                  >
                    <!-- Editing Mode -->
                    <div v-if="editingId === sampler._id" class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Name *
                          </label>
                          <input
                            v-model="editingData.name"
                            type="text"
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Email
                          </label>
                          <input
                            v-model="editingData.email"
                            type="email"
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Phone
                          </label>
                          <input
                            v-model="editingData.phone"
                            type="tel"
                            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white transition-all duration-200"
                          />
                        </div>
                        <div class="flex items-center">
                          <label class="relative inline-flex items-center cursor-pointer">
                            <input
                              v-model="editingData.has24HourRestriction"
                              type="checkbox"
                              class="sr-only peer"
                            />
                            <div
                              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"
                            ></div>
                            <span class="ms-3 text-sm font-medium text-gray-900 dark:text-white">
                              24-Hour Restriction
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Restricted Days
                        </label>
                        <div class="flex flex-wrap gap-2">
                          <label
                            v-for="(day, index) in daysOfWeek"
                            :key="index"
                            class="flex items-center px-3 py-1.5 text-sm rounded-lg border cursor-pointer transition-all duration-200"
                            :class="
                              editingData.restrictedDays.includes(index)
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                            "
                          >
                            <input
                              type="checkbox"
                              :checked="editingData.restrictedDays.includes(index)"
                              @change="toggleRestrictedDay(editingData.restrictedDays, index)"
                              class="sr-only"
                            />
                            {{ day }}
                          </label>
                        </div>
                      </div>

                      <div class="flex gap-2">
                        <button
                          @click="handleUpdate(sampler._id)"
                          :disabled="isUpdating"
                          class="flex-1 rounded-lg px-4 py-2 text-sm bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition-all duration-200 font-medium shadow-sm hover:shadow"
                        >
                          Save Changes
                        </button>
                        <button
                          @click="cancelEdit"
                          class="flex-1 rounded-lg px-4 py-2 text-sm bg-gray-500 text-white hover:bg-gray-600 transition-all duration-200 font-medium shadow-sm hover:shadow"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <!-- Display Mode -->
                    <div v-else>
                      <div class="flex items-start justify-between">
                        <div class="flex-1 space-y-2">
                          <div class="flex items-center gap-2">
                            <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                              {{ sampler.name }}
                            </h4>
                            <span
                              v-if="!sampler.isActive"
                              class="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 font-medium"
                            >
                              Inactive
                            </span>
                            <span
                              v-if="sampler.has24HourRestriction"
                              class="text-xs px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 font-medium"
                            >
                              24h Restriction
                            </span>
                          </div>

                          <div class="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div v-if="sampler.email" class="flex items-center gap-1">
                              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              {{ sampler.email }}
                            </div>
                            <div v-if="sampler.phone" class="flex items-center gap-1">
                              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              {{ sampler.phone }}
                            </div>
                          </div>

                          <div v-if="sampler.restrictedDays && sampler.restrictedDays.length > 0">
                            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Cannot work on:
                            </p>
                            <div class="flex flex-wrap gap-1">
                              <span
                                v-for="dayIndex in sampler.restrictedDays"
                                :key="dayIndex"
                                class="text-xs px-2 py-1 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              >
                                {{ daysOfWeek[dayIndex] }}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center gap-1 ml-4">
                          <button
                            @click="startEdit(sampler)"
                            class="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
                            title="Edit"
                          >
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          <button
                            @click="handleToggleActive(sampler._id, sampler.isActive)"
                            :disabled="isDeletingId === sampler._id"
                            class="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
                            :class="
                              sampler.isActive
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-green-600 dark:text-green-400'
                            "
                            :title="sampler.isActive ? 'Deactivate' : 'Activate'"
                          >
                            <svg
                              v-if="isDeletingId === sampler._id"
                              class="h-4 w-4 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                              ></circle>
                              <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                v-if="sampler.isActive"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                              <path
                                v-else
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>

                          <button
                            @click="handlePermanentDelete(sampler._id, sampler.name)"
                            :disabled="isPermanentDeletingId === sampler._id"
                            class="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
                            title="Delete Permanently"
                          >
                            <svg
                              v-if="isPermanentDeletingId === sampler._id"
                              class="h-4 w-4 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                              ></circle>
                              <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TransitionGroup>
              </div>

              <!-- Modal Footer -->
              <div
                class="flex justify-end border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50"
              >
                <button
                  @click="handleClose"
                  class="rounded-lg bg-gray-200 px-5 py-2.5 text-gray-900 font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'
import dropdownService from '@/services/dropdownService'

interface Sampler {
  _id: string
  name: string
  email?: string
  phone?: string
  has24HourRestriction: boolean
  restrictedDays: number[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

// Days of week
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Component state
const samplers = ref<Sampler[]>([])
const isLoading = ref(false)
const isAdding = ref(false)
const editingId = ref<string | null>(null)
const isUpdating = ref(false)
const isDeletingId = ref<string | null>(null)
const isPermanentDeletingId = ref<string | null>(null)

// New sampler form
const newSampler = ref({
  name: '',
  email: '',
  phone: '',
  has24HourRestriction: false,
  restrictedDays: [] as number[],
})

// Editing data
const editingData = ref({
  name: '',
  email: '',
  phone: '',
  has24HourRestriction: false,
  restrictedDays: [] as number[],
})

// Load samplers when modal opens
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await loadSamplers()
    }
  }
)

// Load samplers from API
const loadSamplers = async () => {
  isLoading.value = true
  try {
    const response = await dropdownService.getAll('samplers', true)
    if (response.success && response.data) {
      samplers.value = response.data as Sampler[]
    }
  } catch (error) {
    console.error('Error loading samplers:', error)
  } finally {
    isLoading.value = false
  }
}

// Toggle restricted day
const toggleRestrictedDay = (days: number[], dayIndex: number) => {
  const index = days.indexOf(dayIndex)
  if (index > -1) {
    days.splice(index, 1)
  } else {
    days.push(dayIndex)
  }
}

// Add new sampler
const handleAdd = async () => {
  if (!newSampler.value.name.trim()) return

  isAdding.value = true
  try {
    const response = await dropdownService.create('samplers', newSampler.value.name.trim())

    if (response.success && response.data) {
      // Update with additional fields
      await dropdownService.update('samplers', response.data._id, {
        email: newSampler.value.email || undefined,
        phone: newSampler.value.phone || undefined,
        has24HourRestriction: newSampler.value.has24HourRestriction,
        restrictedDays: newSampler.value.restrictedDays,
      })

      // Reset form
      newSampler.value = {
        name: '',
        email: '',
        phone: '',
        has24HourRestriction: false,
        restrictedDays: [],
      }

      await loadSamplers()
      emit('updated')
    } else {
      alert(`Error: ${response.message}`)
    }
  } catch (error) {
    console.error('Error adding sampler:', error)
    alert('Failed to add sampler')
  } finally {
    isAdding.value = false
  }
}

// Start editing
const startEdit = (sampler: Sampler) => {
  editingId.value = sampler._id
  editingData.value = {
    name: sampler.name,
    email: sampler.email || '',
    phone: sampler.phone || '',
    has24HourRestriction: sampler.has24HourRestriction,
    restrictedDays: [...sampler.restrictedDays],
  }
}

// Cancel editing
const cancelEdit = () => {
  editingId.value = null
  editingData.value = {
    name: '',
    email: '',
    phone: '',
    has24HourRestriction: false,
    restrictedDays: [],
  }
}

// Update sampler
const handleUpdate = async (id: string) => {
  if (!editingData.value.name.trim()) return

  isUpdating.value = true
  try {
    const response = await dropdownService.update('samplers', id, {
      name: editingData.value.name.trim(),
      email: editingData.value.email || undefined,
      phone: editingData.value.phone || undefined,
      has24HourRestriction: editingData.value.has24HourRestriction,
      restrictedDays: editingData.value.restrictedDays,
    })
    if (response.success) {
      cancelEdit()
      await loadSamplers()
      emit('updated')
    } else {
      alert(`Error: ${response.message}`)
    }
  } catch (error) {
    console.error('Error updating sampler:', error)
    alert('Failed to update sampler')
  } finally {
    isUpdating.value = false
  }
}

// Toggle active status
const handleToggleActive = async (id: string, currentStatus: boolean) => {
  isDeletingId.value = id
  try {
    const response = await dropdownService.update('samplers', id, {
      isActive: !currentStatus,
    })
    if (response.success) {
      await loadSamplers()
      emit('updated')
    } else {
      alert(`Error: ${response.message}`)
    }
  } catch (error) {
    console.error('Error toggling status:', error)
    alert('Failed to update status')
  } finally {
    isDeletingId.value = null
  }
}

// Permanent delete
const handlePermanentDelete = async (id: string, name: string) => {
  const confirmed = confirm(
    `⚠️ WARNING: This will PERMANENTLY delete "${name}" from the database.\n\nThis action CANNOT be undone!\n\nAre you sure you want to continue?`
  )
  if (!confirmed) return

  const doubleConfirmed = confirm(
    `⚠️ FINAL CONFIRMATION\n\nYou are about to permanently delete "${name}".\n\nAre you absolutely sure?`
  )
  if (!doubleConfirmed) return

  isPermanentDeletingId.value = id
  try {
    const response = await dropdownService.permanentDelete('samplers', id)
    if (response.success) {
      await loadSamplers()
      emit('updated')
      alert(`✅ "${name}" has been permanently deleted from the database.`)
    } else {
      alert(`❌ Error: ${response.message}`)
    }
  } catch (error) {
    console.error('Error permanently deleting sampler:', error)
    alert('❌ Failed to permanently delete sampler')
  } finally {
    isPermanentDeletingId.value = null
  }
}

// Close modal
const handleClose = () => {
  cancelEdit()
  emit('close')
}
</script>

<style scoped>
/* List transition animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
