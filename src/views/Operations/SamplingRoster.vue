<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Sampling Roster" />

    <div class="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Left: Form -->
      <ComponentCard title="New Sampling Roster" description="Register a new sampling roster entry" class="lg:col-span-2">
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
      <ComponentCard title="Roster" description="Sampling roster schedule" class="lg:col-span-3">
        <div class="p-6">
          <h4 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Office Sampling</h4>
          
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Who</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">START OFFICE</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">FINISH SAMPLING</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">HOURS</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <tr v-if="officeSamplingData.length === 0" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td colspan="5" class="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">No data available. Select a vessel to populate the table.</td>
                </tr>
                <tr 
                  v-for="(record, index) in officeSamplingData" 
                  :key="index"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <!-- Who -->
                  <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    <select
                      v-if="editingIndex === index"
                      v-model="editingData.who"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select sampler</option>
                      <option v-for="sampler in samplerOptions" :key="sampler" :value="sampler">{{ sampler }}</option>
                    </select>
                    <span v-else class="block">{{ record.who || '-' }}</span>
                  </td>
                  
                  <!-- START OFFICE -->
                  <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div v-show="editingIndex === index">
                      <flat-pickr
                        :key="`start-${index}`"
                        v-model="editingData.startOffice"
                        :config="dateTimeConfig"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <span v-show="editingIndex !== index">{{ record.startOffice || '-' }}</span>
                  </td>
                  
                  <!-- FINISH SAMPLING -->
                  <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div v-show="editingIndex === index">
                      <flat-pickr
                        :key="`finish-${index}`"
                        v-model="editingData.finishSampling"
                        :config="dateTimeConfig"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <span v-show="editingIndex !== index">{{ record.finishSampling || '-' }}</span>
                  </td>
                  
                  <!-- HOURS -->
                  <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <span v-if="editingIndex === index">{{ calculateEditingHours }}</span>
                    <span v-else>{{ record.hours || '-' }}</span>
                  </td>
                  
                  <!-- ACTIONS -->
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    <div v-if="editingIndex === index" class="flex items-center gap-2">
                      <button
                        @click="saveEdit(index)"
                        class="rounded-lg p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 transition-all duration-200"
                        title="Save"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        @click="cancelOfficeSamplingEdit"
                        class="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
                        title="Cancel"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button
                      v-else
                      @click="startEdit(index)"
                      class="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
                      title="Edit"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Line Sampling Table -->
          <div class="mt-6 mb-4 flex items-center justify-between">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">Line Sampling</h4>
            <div class="flex gap-2">
              <button
                v-if="lineSamplingData.length > 0"
                type="button"
                @click="clearLineSampling"
                class="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                @click="handleAutoGenerate"
                :disabled="isGenerating || !formData.startDischarge || !formData.dischargeTimeHours"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ isGenerating ? 'Generating...' : 'Auto generate' }}
              </button>
            </div>
          </div>
          
          <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Who</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Start</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Finish</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Hours</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">ACTIONS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                <tr v-if="lineSamplingData.length === 0" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td colspan="5" class="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">No data available.</td>
                </tr>
                <tr 
                  v-for="(record, index) in lineSamplingData" 
                  :key="index"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <!-- Who -->
                  <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    <select
                      v-if="editingLineIndex === index"
                      v-model="editingLineData.who"
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select sampler</option>
                      <option v-for="sampler in samplerOptions" :key="sampler" :value="sampler">{{ sampler }}</option>
                    </select>
                    <span v-else class="block">{{ record.who || '-' }}</span>
                  </td>
                  
                  <!-- Start Line Sampling -->
                  <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div v-show="editingLineIndex === index">
                      <flat-pickr
                        :key="`start-line-${index}`"
                        v-model="editingLineData.startLineSampling"
                        :config="dateTimeConfig"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <span v-show="editingLineIndex !== index">{{ record.startLineSampling || '-' }}</span>
                  </td>
                  
                  <!-- Finish Line Sampling -->
                  <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div v-show="editingLineIndex === index">
                      <flat-pickr
                        :key="`finish-line-${index}`"
                        v-model="editingLineData.finishLineSampling"
                        :config="dateTimeConfig"
                        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <span v-show="editingLineIndex !== index">{{ record.finishLineSampling || '-' }}</span>
                  </td>
                  
                  <!-- Hours -->
                  <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <span v-if="editingLineIndex === index">{{ calculateLineEditingHours }}</span>
                    <span v-else>{{ record.hours || '-' }}</span>
                  </td>
                  
                  <!-- ACTIONS -->
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    <div v-if="editingLineIndex === index" class="flex items-center gap-2">
                      <button
                        @click="saveLineEdit(index)"
                        class="rounded-lg p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 transition-all duration-200"
                        title="Save"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        @click="cancelLineSamplingEdit"
                        class="rounded-lg p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
                        title="Cancel"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button
                      v-else
                      @click="startLineEdit(index)"
                      class="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
                      title="Edit"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
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
import { ref, computed, onMounted } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { useToast } from 'vue-toastification'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import { getAllShipNominations, searchShipNominations, type ShipNomination } from '@/services/shipNominationService'
import dropdownService from '@/services/dropdownService'
import { autogenerateLineSampling } from '@/services/samplingRosterService'
import { listMolekulisLoadings } from '@/services/molekulisLoadingService'
import { listOtherJobs } from '@/services/otherJobsService'

const toast = useToast()

// Ship Nomination Search
const searchQuery = ref('')
const showDropdown = ref(false)
const isLoadingShips = ref(false)
const shipNominations = ref<ShipNomination[]>([])
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

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

// Office Sampling Data Interface
interface OfficeSamplingRecord {
  who: string
  startOffice: string // Display formatted
  startOfficeRaw: string // ISO format for editing
  finishSampling: string // Display formatted
  finishSamplingRaw: string // ISO format for editing
  hours: string
}

// Office Sampling Data
const officeSamplingData = ref<OfficeSamplingRecord[]>([])
const editingIndex = ref<number | null>(null)
const editingData = ref<{
  who: string
  startOffice: string
  finishSampling: string
  hours: string
}>({
  who: '',
  startOffice: '',
  finishSampling: '',
  hours: ''
})

// Line Sampling Data Interface
interface LineSamplingRecord {
  who: string
  startLineSampling: string // Display formatted
  startLineSamplingRaw: string // ISO format for editing
  finishLineSampling: string // Display formatted
  finishLineSamplingRaw: string // ISO format for editing
  hours: string
}

// Line Sampling Data
const lineSamplingData = ref<LineSamplingRecord[]>([])
const editingLineIndex = ref<number | null>(null)
const editingLineData = ref<{
  who: string
  startLineSampling: string
  finishLineSampling: string
  hours: string
}>({
  who: '',
  startLineSampling: '',
  finishLineSampling: '',
  hours: ''
})

// Sampler options for dropdown
const samplerOptions = ref<string[]>([])

// Format date/time for display (24 hour format)
const formatDateTimeForTable = (dateString: string) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  const year = d.getFullYear()
  const month = d.toLocaleString('en-US', { month: 'short' })
  const day = d.getDate()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${month} ${day}, ${year} ${hours}:${minutes}`
}

// Format date/time for flatpickr input (Y-m-d H:i)
const formatDateTimeForInput = (dateString: string) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// Calculate hours between two dates
const calculateHours = (startDate: Date, finishDate: Date) => {
  const diffMs = finishDate.getTime() - startDate.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  return diffHours.toFixed(2)
}

// Calculate hours in real-time during editing (reactive function)
const calculateEditingHours = computed(() => {
  if (editingIndex.value === null) {
    return null
  }

  if (!editingData.value.startOffice || !editingData.value.finishSampling) {
    return '-'
  }

  const startDate = new Date(editingData.value.startOffice)
  const finishDate = new Date(editingData.value.finishSampling)

  if (isNaN(startDate.getTime()) || isNaN(finishDate.getTime())) {
    return '-'
  }

  if (finishDate <= startDate) {
    return '0.00 hrs'
  }

  const hours = calculateHours(startDate, finishDate)
  return `${hours} hrs`
})

// Calculate hours in real-time during Line Sampling editing (reactive function)
const calculateLineEditingHours = computed(() => {
  if (editingLineIndex.value === null) {
    return null
  }

  if (!editingLineData.value.startLineSampling || !editingLineData.value.finishLineSampling) {
    return '-'
  }

  const startDate = new Date(editingLineData.value.startLineSampling)
  const finishDate = new Date(editingLineData.value.finishLineSampling)

  if (isNaN(startDate.getTime()) || isNaN(finishDate.getTime())) {
    return '-'
  }

  if (finishDate <= startDate) {
    return '0.00 hrs'
  }

  const hours = calculateHours(startDate, finishDate)
  return `${hours} hrs`
})

// Populate Office Sampling table from ship nomination
const populateOfficeSamplingTable = (ship: ShipNomination) => {
  if (!ship.sampler || !ship.pilotOnBoard) {
    officeSamplingData.value = []
    return
  }

  // START OFFICE: Pilot on Board
  const startOfficeDate = new Date(ship.pilotOnBoard)
  
  // FINISH SAMPLING: Pilot on Board + 5 hours
  const finishSamplingDate = new Date(startOfficeDate.getTime() + (5 * 60 * 60 * 1000))
  
  // HOURS: Calculate difference
  const hours = calculateHours(startOfficeDate, finishSamplingDate)

  officeSamplingData.value = [{
    who: ship.sampler,
    startOffice: formatDateTimeForTable(ship.pilotOnBoard),
    startOfficeRaw: startOfficeDate.toISOString(),
    finishSampling: formatDateTimeForTable(finishSamplingDate.toISOString()),
    finishSamplingRaw: finishSamplingDate.toISOString(),
    hours: `${hours} hrs`
  }]
}

// Start editing a record
const startEdit = (index: number) => {
  const record = officeSamplingData.value[index]
  editingIndex.value = index
  editingData.value = {
    who: record.who,
    startOffice: formatDateTimeForInput(record.startOfficeRaw),
    finishSampling: formatDateTimeForInput(record.finishSamplingRaw),
    hours: record.hours
  }
}

// Save edited record
const saveEdit = (index: number) => {
  const currentRecord = officeSamplingData.value[index]
  
  // Use existing dates if not provided in editing data
  let startDate: Date
  let finishDate: Date
  
  if (editingData.value.startOffice) {
    startDate = new Date(editingData.value.startOffice)
    if (isNaN(startDate.getTime())) {
      toast.warning('Invalid START OFFICE date format')
      return
    }
  } else {
    // Use existing date if not changed
    startDate = new Date(currentRecord.startOfficeRaw)
  }
  
  if (editingData.value.finishSampling) {
    finishDate = new Date(editingData.value.finishSampling)
    if (isNaN(finishDate.getTime())) {
      toast.warning('Invalid FINISH SAMPLING date format')
      return
    }
  } else {
    // Use existing date if not changed
    finishDate = new Date(currentRecord.finishSamplingRaw)
  }

  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(finishDate.getTime())) {
    toast.warning('Please fill in START OFFICE and FINISH SAMPLING')
    return
  }

  if (finishDate <= startDate) {
    toast.warning('FINISH SAMPLING must be after START OFFICE')
    return
  }

  // Calculate hours automatically
  const hours = calculateHours(startDate, finishDate)

  // Update the record
  officeSamplingData.value[index] = {
    who: editingData.value.who || currentRecord.who,
    startOffice: formatDateTimeForTable(startDate.toISOString()),
    startOfficeRaw: startDate.toISOString(),
    finishSampling: formatDateTimeForTable(finishDate.toISOString()),
    finishSamplingRaw: finishDate.toISOString(),
    hours: `${hours} hrs`
  }

  // Exit edit mode
  editingIndex.value = null
  editingData.value = {
    who: '',
    startOffice: '',
    finishSampling: '',
    hours: ''
  }
  
  toast.success('Record updated successfully')
}

// Cancel editing Office Sampling
const cancelOfficeSamplingEdit = () => {
  editingIndex.value = null
  editingData.value = {
    who: '',
    startOffice: '',
    finishSampling: '',
    hours: ''
  }
}

// Start editing a Line Sampling record
const startLineEdit = (index: number) => {
  const record = lineSamplingData.value[index]
  editingLineIndex.value = index
  editingLineData.value = {
    who: record.who,
    startLineSampling: formatDateTimeForInput(record.startLineSamplingRaw),
    finishLineSampling: formatDateTimeForInput(record.finishLineSamplingRaw),
    hours: record.hours
  }
}

// Calculate hours between two dates (returns number)
const calculateHoursNumber = (startDate: Date, finishDate: Date): number => {
  const diffMs = finishDate.getTime() - startDate.getTime()
  return diffMs / (1000 * 60 * 60)
}

// Check if two shifts overlap
const doShiftsOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
  return start1 < end2 && start2 < end1
}

// Validate that edited shift doesn't overlap with other shifts
const validateShiftOverlap = (index: number, newStart: Date, newFinish: Date): boolean => {
  for (let i = 0; i < lineSamplingData.value.length; i++) {
    if (i === index) continue // Skip the current shift being edited
    
    const otherShift = lineSamplingData.value[i]
    if (!otherShift.startLineSamplingRaw || !otherShift.finishLineSamplingRaw) continue
    
    const otherStart = new Date(otherShift.startLineSamplingRaw)
    const otherFinish = new Date(otherShift.finishLineSamplingRaw)
    
    if (doShiftsOverlap(newStart, newFinish, otherStart, otherFinish)) {
      return false
    }
  }
  return true
}

// Calculate adjusted subsequent shifts without applying them (for validation)
const calculateAdjustedSubsequentShifts = async (index: number, newFinishTime: Date): Promise<LineSamplingRecord[]> => {
  if (index >= lineSamplingData.value.length - 1) {
    return [] // No subsequent shifts to adjust
  }
  
  // Get ETC (end of discharge period) for adjusting last shift
  let etcDate: Date | null = null
  if (formData.value.startDischarge && formData.value.dischargeTimeHours) {
    let startDischargeISO: string
    if (formData.value.startDischarge.includes('T') || formData.value.startDischarge.includes('Z')) {
      startDischargeISO = formData.value.startDischarge
    } else {
      const startDate = new Date(formData.value.startDischarge.replace(' ', 'T'))
      startDischargeISO = startDate.toISOString()
    }
    const startDischargeDate = new Date(startDischargeISO)
    etcDate = new Date(startDischargeDate.getTime() + formData.value.dischargeTimeHours * 60 * 60 * 1000)
  }
  
  let currentStart = new Date(newFinishTime)
  const adjustedShifts: LineSamplingRecord[] = []
  
  // Calculate all subsequent shifts
  for (let i = index + 1; i < lineSamplingData.value.length; i++) {
    const currentShift = lineSamplingData.value[i]
    
    // Check if we've already reached ETC before starting this shift
    if (etcDate && currentStart >= etcDate) {
      break
    }
    
    // Calculate new shift end (12 hours from start)
    let newShiftEnd = new Date(currentStart.getTime() + 12 * 60 * 60 * 1000)
    
    // Check if end time would exceed ETC
    if (etcDate && newShiftEnd > etcDate) {
      newShiftEnd = etcDate
    }
    
    const shiftHours = calculateHoursNumber(currentStart, newShiftEnd)
    
    adjustedShifts.push({
      who: currentShift.who,
      startLineSampling: formatDateTimeForTable(currentStart.toISOString()),
      startLineSamplingRaw: currentStart.toISOString(),
      finishLineSampling: formatDateTimeForTable(newShiftEnd.toISOString()),
      finishLineSamplingRaw: newShiftEnd.toISOString(),
      hours: `${shiftHours.toFixed(2)} hrs`
    })
    
    // Move to next shift start
    currentStart = new Date(newShiftEnd)
    
    // If we've reached ETC (shift ends exactly at ETC or beyond), stop adjusting
    if (etcDate && newShiftEnd >= etcDate) {
      break
    }
  }
  
  // After adjusting existing shifts, check if we need to add more shifts to reach ETC
  if (etcDate && currentStart < etcDate) {
    // Generate additional shifts until we reach ETC
    // First, get the samplers list to assign them
    const samplersResponse = await dropdownService.getSamplers(true)
    const availableSamplers: string[] = samplersResponse.success && samplersResponse.data 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (samplersResponse.data as any[]).filter((s: any) => s.isActive).map((s: any) => s.name)
      : []
    
    if (availableSamplers.length > 0) {
      // Get used samplers from existing shifts (excluding the one being edited)
      const usedSamplers: string[] = []
      for (let i = 0; i <= index; i++) {
        if (lineSamplingData.value[i].who) {
          usedSamplers.push(lineSamplingData.value[i].who)
        }
      }
      for (const shift of adjustedShifts) {
        if (shift.who) {
          usedSamplers.push(shift.who)
        }
      }
      
      // Rotate samplers for new shifts (start with least used)
      const samplerUsage = new Map<string, number>()
      availableSamplers.forEach((name: string) => {
        samplerUsage.set(name, usedSamplers.filter(s => s === name).length)
      })
      
      // Sort by usage (least used first)
      const sortedSamplers = [...availableSamplers].sort((a, b) => {
        return (samplerUsage.get(a) || 0) - (samplerUsage.get(b) || 0)
      })
      
      let samplerIndex = 0
      
      // Generate shifts until ETC
      while (currentStart < etcDate) {
        // Calculate shift end (12 hours or until ETC)
        let newShiftEnd = new Date(currentStart.getTime() + 12 * 60 * 60 * 1000)
        if (newShiftEnd > etcDate) {
          newShiftEnd = etcDate
        }
        
        const shiftHours = calculateHoursNumber(currentStart, newShiftEnd)
        
        // Assign sampler (rotate through available samplers)
        const assignedSampler = sortedSamplers[samplerIndex % sortedSamplers.length]
        
        adjustedShifts.push({
          who: assignedSampler,
          startLineSampling: formatDateTimeForTable(currentStart.toISOString()),
          startLineSamplingRaw: currentStart.toISOString(),
          finishLineSampling: formatDateTimeForTable(newShiftEnd.toISOString()),
          finishLineSamplingRaw: newShiftEnd.toISOString(),
          hours: `${shiftHours.toFixed(2)} hrs`
        })
        
        // Update sampler usage
        samplerUsage.set(assignedSampler, (samplerUsage.get(assignedSampler) || 0) + 1)
        samplerIndex++
        
        // Move to next shift start
        currentStart = new Date(newShiftEnd)
        
        // If we've reached ETC, stop
        if (currentStart >= etcDate) {
          break
        }
      }
    }
  }
  
  return adjustedShifts
}

// Get week range (Monday 00:00 to Sunday 23:59) for a given date
const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  
  return { start: monday, end: sunday }
}

// Check if any part of a shift falls on a restricted day
const hasRestrictedDay = (shiftStart: Date, shiftEnd: Date, restrictedDays: number[]): boolean => {
  const start = new Date(shiftStart)
  const end = new Date(shiftEnd)
  
  // Check each day the shift spans
  const current = new Date(start)
  current.setHours(0, 0, 0, 0)
  const checkDate = new Date(current)
  
  while (checkDate <= end) {
    const dayOfWeek = checkDate.getDay() // 0 = Sunday, 6 = Saturday
    if (restrictedDays.includes(dayOfWeek)) {
      return true
    }
    checkDate.setDate(checkDate.getDate() + 1)
  }
  
  return false
}

// Validate shifts don't overlap (including calculated adjusted shifts)
const validateShiftsAfterAdjustment = (
  editedIndex: number,
  newStart: Date,
  newFinish: Date,
  adjustedShifts: LineSamplingRecord[]
): boolean => {
  // Check edited shift against all other shifts (excluding subsequent ones that will be adjusted)
  for (let i = 0; i < lineSamplingData.value.length; i++) {
    if (i === editedIndex || i > editedIndex) continue // Skip edited shift and subsequent shifts (they'll be adjusted)
    
    const otherShift = lineSamplingData.value[i]
    if (!otherShift.startLineSamplingRaw || !otherShift.finishLineSamplingRaw) continue
    
    const otherStart = new Date(otherShift.startLineSamplingRaw)
    const otherFinish = new Date(otherShift.finishLineSamplingRaw)
    
    if (doShiftsOverlap(newStart, newFinish, otherStart, otherFinish)) {
      return false
    }
  }
  
  // Check adjusted shifts against each other and against previous shifts
  for (let i = 0; i < adjustedShifts.length; i++) {
    const adjustedShift = adjustedShifts[i]
    const adjStart = new Date(adjustedShift.startLineSamplingRaw)
    const adjFinish = new Date(adjustedShift.finishLineSamplingRaw)
    
    // Check against edited shift
    if (doShiftsOverlap(adjStart, adjFinish, newStart, newFinish)) {
      return false
    }
    
    // Check against other adjusted shifts
    for (let j = i + 1; j < adjustedShifts.length; j++) {
      const otherAdjShift = adjustedShifts[j]
      const otherAdjStart = new Date(otherAdjShift.startLineSamplingRaw)
      const otherAdjFinish = new Date(otherAdjShift.finishLineSamplingRaw)
      
      if (doShiftsOverlap(adjStart, adjFinish, otherAdjStart, otherAdjFinish)) {
        return false
      }
    }
    
    // Check against previous shifts (before edited one)
    for (let j = 0; j < editedIndex; j++) {
      const prevShift = lineSamplingData.value[j]
      if (!prevShift.startLineSamplingRaw || !prevShift.finishLineSamplingRaw) continue
      
      const prevStart = new Date(prevShift.startLineSamplingRaw)
      const prevFinish = new Date(prevShift.finishLineSamplingRaw)
      
      if (doShiftsOverlap(adjStart, adjFinish, prevStart, prevFinish)) {
        return false
      }
    }
  }
  
  return true
}

// Validate sampler restrictions for manual edits (same rules as autogenerate)
const validateSamplerRestrictions = async (
  samplerName: string,
  shiftStart: Date,
  shiftEnd: Date,
  excludeIndex?: number // Index of shift being edited to exclude from conflicts
): Promise<{ valid: boolean; reason?: string }> => {
  // Get sampler details
  const samplersResponse = await dropdownService.getSamplers(true)
  if (!samplersResponse.success || !samplersResponse.data) {
    return { valid: false, reason: 'Failed to fetch sampler information' }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sampler = samplersResponse.data.find((s: any) => s.name === samplerName) as any
  if (!sampler) {
    return { valid: false, reason: 'Sampler not found' }
  }
  
  // Check if sampler is active
  if (!sampler.isActive) {
    return { valid: false, reason: 'Sampler is inactive' }
  }
  
  // Check restricted days
  if (hasRestrictedDay(shiftStart, shiftEnd, sampler.restrictedDays || [])) {
    const restrictedDays = (sampler.restrictedDays || []).map((d: number) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[d]
    }).join(', ')
    return { valid: false, reason: `Cannot work on restricted days: ${restrictedDays}` }
  }
  
  // Check for consecutive shifts (same sampler without minimum rest)
  const MIN_REST_HOURS = 10
  for (let i = 0; i < lineSamplingData.value.length; i++) {
    if (i === excludeIndex) continue // Skip the shift being edited
    
    const otherShift = lineSamplingData.value[i]
    if (!otherShift.who || otherShift.who !== samplerName) continue
    if (!otherShift.startLineSamplingRaw || !otherShift.finishLineSamplingRaw) continue
    
    const otherStart = new Date(otherShift.startLineSamplingRaw)
    const otherFinish = new Date(otherShift.finishLineSamplingRaw)
    
    // Check if this shift comes before or after the edited shift
    let restHours: number
    
    if (shiftStart >= otherFinish) {
      // Edited shift starts after other shift ends
      restHours = calculateHoursNumber(otherFinish, shiftStart)
    } else if (otherStart >= shiftEnd) {
      // Other shift starts after edited shift ends
      restHours = calculateHoursNumber(shiftEnd, otherStart)
    } else {
      // Shifts overlap or are adjacent - this is already handled by overlap validation
      continue
    }
    
    // If shifts are consecutive (one ends exactly when the other starts or very close)
    // and rest is less than minimum, it's invalid
    if (restHours < MIN_REST_HOURS) {
      return {
        valid: false,
        reason: `Insufficient rest between shifts: ${restHours.toFixed(1)}h (minimum ${MIN_REST_HOURS}h required). Cannot assign same sampler to consecutive shifts.`
      }
    }
  }
  
  // Check weekly hours limit (if restricted)
  const WEEKLY_MAX_HOURS_24 = 24
  if (sampler.has24HourRestriction) {
    const weekRange = getWeekRange(shiftStart)
    
    // Calculate weekly hours from all shifts (including this one)
    let weeklyHours = calculateHoursNumber(shiftStart, shiftEnd)
    
    for (let i = 0; i < lineSamplingData.value.length; i++) {
      if (i === excludeIndex) continue
      
      const otherShift = lineSamplingData.value[i]
      if (!otherShift.who || otherShift.who !== samplerName) continue
      if (!otherShift.startLineSamplingRaw || !otherShift.finishLineSamplingRaw) continue
      
      const otherStart = new Date(otherShift.startLineSamplingRaw)
      const otherFinish = new Date(otherShift.finishLineSamplingRaw)
      
      // Only count hours within the same week
      const shiftWeekRange = getWeekRange(otherStart)
      if (shiftWeekRange.start.getTime() === weekRange.start.getTime()) {
        const overlapStart = new Date(Math.max(otherStart.getTime(), weekRange.start.getTime()))
        const overlapEnd = new Date(Math.min(otherFinish.getTime(), weekRange.end.getTime()))
        if (overlapStart < overlapEnd) {
          weeklyHours += calculateHoursNumber(overlapStart, overlapEnd)
        }
      }
    }
    
    // Also check conflicts from other modules
    try {
      const weekStart = weekRange.start
      const weekEnd = weekRange.end
      
      // Fetch Molekulis conflicts
      const molekulisResponse = await listMolekulisLoadings({
        limit: 1000,
        sortBy: 'startAt',
        sortOrder: 'asc'
      })
      
      if (molekulisResponse.success && molekulisResponse.data) {
        for (const item of molekulisResponse.data) {
          if (item.who === samplerName) {
            const itemStart = new Date(item.startAt)
            const itemEnd = new Date(item.endAt)
            
            if (doShiftsOverlap(weekStart, weekEnd, itemStart, itemEnd)) {
              const overlapStart = new Date(Math.max(itemStart.getTime(), weekStart.getTime()))
              const overlapEnd = new Date(Math.min(itemEnd.getTime(), weekEnd.getTime()))
              if (overlapStart < overlapEnd) {
                weeklyHours += calculateHoursNumber(overlapStart, overlapEnd)
              }
            }
          }
        }
      }
      
      // Fetch Other Jobs conflicts
      const otherJobsResponse = await listOtherJobs({
        limit: 1000,
        sortBy: 'startAt',
        sortOrder: 'asc'
      })
      
      if (otherJobsResponse.success && otherJobsResponse.data) {
        for (const item of otherJobsResponse.data) {
          if (item.who === samplerName) {
            const itemStart = new Date(item.startAt)
            const itemEnd = new Date(item.endAt)
            
            if (doShiftsOverlap(weekStart, weekEnd, itemStart, itemEnd)) {
              const overlapStart = new Date(Math.max(itemStart.getTime(), weekStart.getTime()))
              const overlapEnd = new Date(Math.min(itemEnd.getTime(), weekEnd.getTime()))
              if (overlapStart < overlapEnd) {
                weeklyHours += calculateHoursNumber(overlapStart, overlapEnd)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching conflicts for weekly hours validation:', error)
    }
    
    if (weeklyHours > WEEKLY_MAX_HOURS_24) {
      return {
        valid: false,
        reason: `Weekly limit exceeded: ${weeklyHours.toFixed(1)}h (max ${WEEKLY_MAX_HOURS_24}h)`
      }
    }
  }
  
  // Check conflicts with other modules
  try {
    // Check Molekulis conflicts
    const molekulisResponse = await listMolekulisLoadings({
      limit: 1000,
      sortBy: 'startAt',
      sortOrder: 'asc'
    })
    
    if (molekulisResponse.success && molekulisResponse.data) {
      for (const item of molekulisResponse.data) {
        if (item.who === samplerName) {
          const itemStart = new Date(item.startAt)
          const itemEnd = new Date(item.endAt)
          
          if (doShiftsOverlap(shiftStart, shiftEnd, itemStart, itemEnd)) {
            return { valid: false, reason: 'Conflicts with Molekulis assignment' }
          }
        }
      }
    }
    
    // Check Other Jobs conflicts
    const otherJobsResponse = await listOtherJobs({
      limit: 1000,
      sortBy: 'startAt',
      sortOrder: 'asc'
    })
    
    if (otherJobsResponse.success && otherJobsResponse.data) {
      for (const item of otherJobsResponse.data) {
        if (item.who === samplerName) {
          const itemStart = new Date(item.startAt)
          const itemEnd = new Date(item.endAt)
          
          if (doShiftsOverlap(shiftStart, shiftEnd, itemStart, itemEnd)) {
            return { valid: false, reason: 'Conflicts with Other Jobs assignment' }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking conflicts:', error)
  }
  
  return { valid: true }
}

// Save edited Line Sampling record
const saveLineEdit = async (index: number) => {
  const currentRecord = lineSamplingData.value[index]
  
  // Use existing dates if not provided in editing data
  let startDate: Date
  let finishDate: Date
  
  if (editingLineData.value.startLineSampling) {
    startDate = new Date(editingLineData.value.startLineSampling)
    if (isNaN(startDate.getTime())) {
      toast.warning('Invalid Start Line Sampling date format')
      return
    }
  } else {
    // Use existing date if not changed
    startDate = new Date(currentRecord.startLineSamplingRaw)
  }
  
  if (editingLineData.value.finishLineSampling) {
    finishDate = new Date(editingLineData.value.finishLineSampling)
    if (isNaN(finishDate.getTime())) {
      toast.warning('Invalid Finish Line Sampling date format')
      return
    }
  } else {
    // Use existing date if not changed
    finishDate = new Date(currentRecord.finishLineSamplingRaw)
  }

  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(finishDate.getTime())) {
    toast.warning('Please fill in Start Line Sampling and Finish Line Sampling')
    return
  }

  if (finishDate <= startDate) {
    toast.warning('Finish Line Sampling must be after Start Line Sampling')
    return
  }

  // Calculate hours automatically
  const hours = calculateHoursNumber(startDate, finishDate)

  // Get sampler name (from editing data or current record)
  const samplerName = editingLineData.value.who || currentRecord.who

  // Validate sampler restrictions (same rules as autogenerate)
  if (samplerName) {
    const restrictionValidation = await validateSamplerRestrictions(
      samplerName,
      startDate,
      finishDate,
      index
    )
    
    if (!restrictionValidation.valid) {
      toast.error(restrictionValidation.reason || 'Sampler validation failed')
      return
    }
  }

  // Check if finish time was manually changed
  const originalFinishTime = new Date(currentRecord.finishLineSamplingRaw)
  const finishTimeChanged = finishDate.getTime() !== originalFinishTime.getTime()

  // Calculate adjusted subsequent shifts if finish time changed
  let adjustedShifts: LineSamplingRecord[] = []
  if (finishTimeChanged) {
    adjustedShifts = await calculateAdjustedSubsequentShifts(index, finishDate)
    
    // Validate no overlap after adjustment
    if (!validateShiftsAfterAdjustment(index, startDate, finishDate, adjustedShifts)) {
      toast.error('This shift overlaps with another shift after adjustment. Please adjust the times.')
      return
    }
    
    // Validate sampler restrictions for adjusted shifts
    for (let i = 0; i < adjustedShifts.length; i++) {
      const adjustedShift = adjustedShifts[i]
      if (adjustedShift.who) {
        const adjStart = new Date(adjustedShift.startLineSamplingRaw)
        const adjEnd = new Date(adjustedShift.finishLineSamplingRaw)
        
        const adjValidation = await validateSamplerRestrictions(
          adjustedShift.who,
          adjStart,
          adjEnd,
          index + 1 + i // This shift will be at this index after adjustment
        )
        
        if (!adjValidation.valid) {
          toast.error(`Shift ${index + 2 + i}: ${adjValidation.reason}`)
          return
        }
      }
    }
  } else {
    // If finish time didn't change, validate normally
    if (!validateShiftOverlap(index, startDate, finishDate)) {
      toast.error('This shift overlaps with another shift. Please adjust the times.')
      return
    }
  }

  // Update the record
  lineSamplingData.value[index] = {
    who: editingLineData.value.who || currentRecord.who,
    startLineSampling: formatDateTimeForTable(startDate.toISOString()),
    startLineSamplingRaw: startDate.toISOString(),
    finishLineSampling: formatDateTimeForTable(finishDate.toISOString()),
    finishLineSamplingRaw: finishDate.toISOString(),
    hours: `${hours.toFixed(2)} hrs`
  }

  // If finish time was manually changed, apply adjusted shifts
  if (finishTimeChanged && adjustedShifts.length > 0) {
    // Count how many existing shifts were adjusted vs new shifts added
    const existingShiftsCount = Math.min(adjustedShifts.length, lineSamplingData.value.length - index - 1)
    const newShiftsCount = Math.max(0, adjustedShifts.length - existingShiftsCount)
    
    // Apply adjusted shifts (replace existing ones)
    for (let i = 0; i < existingShiftsCount; i++) {
      const shiftIndex = index + 1 + i
      if (shiftIndex < lineSamplingData.value.length) {
        lineSamplingData.value[shiftIndex] = adjustedShifts[i]
      }
    }
    
    // Add new shifts if there are any
    if (newShiftsCount > 0) {
      const newShifts = adjustedShifts.slice(existingShiftsCount)
      for (const newShift of newShifts) {
        lineSamplingData.value.push(newShift)
      }
    }
    
    // Remove any remaining shifts that come after the adjusted shifts
    const firstShiftToRemove = index + 1 + adjustedShifts.length
    if (firstShiftToRemove < lineSamplingData.value.length) {
      const removedCount = lineSamplingData.value.length - firstShiftToRemove
      lineSamplingData.value.splice(firstShiftToRemove)
      
      if (newShiftsCount > 0 && removedCount > 0) {
        toast.success(`Line Sampling record updated, ${existingShiftsCount} shift(s) adjusted, ${newShiftsCount} shift(s) added, and ${removedCount} shift(s) removed`)
      } else if (newShiftsCount > 0) {
        toast.success(`Line Sampling record updated, ${existingShiftsCount} shift(s) adjusted, and ${newShiftsCount} shift(s) added to reach ETC`)
      } else if (removedCount > 0) {
        toast.success(`Line Sampling record updated, ${existingShiftsCount} shift(s) adjusted, and ${removedCount} shift(s) removed (ETC reached)`)
      } else {
        toast.success('Line Sampling record updated and subsequent shifts adjusted')
      }
    } else if (newShiftsCount > 0) {
      toast.success(`Line Sampling record updated, ${existingShiftsCount} shift(s) adjusted, and ${newShiftsCount} shift(s) added to reach ETC`)
    } else {
      toast.success('Line Sampling record updated and subsequent shifts adjusted')
    }
  } else {
    toast.success('Line Sampling record updated successfully')
  }

  // Exit edit mode
  editingLineIndex.value = null
  editingLineData.value = {
    who: '',
    startLineSampling: '',
    finishLineSampling: '',
    hours: ''
  }
}

// Cancel editing Line Sampling
const cancelLineSamplingEdit = () => {
  editingLineIndex.value = null
  editingLineData.value = {
    who: '',
    startLineSampling: '',
    finishLineSampling: '',
    hours: ''
  }
}

// Auto generate state
const isGenerating = ref(false)

// Handle auto generate
const handleAutoGenerate = async () => {
  if (!formData.value.startDischarge || formData.value.dischargeTimeHours === null || formData.value.dischargeTimeHours === undefined) {
    toast.warning('Please fill in Start Discharge and Discharge Time (Hrs)')
    return
  }

  isGenerating.value = true

  try {
    // Get Office Sampling data if available
    const officeSamplingRecord = officeSamplingData.value.length > 0 
      ? officeSamplingData.value[0] 
      : undefined
    
    const officeSamplingFinish = officeSamplingRecord?.finishSamplingRaw
    const officeSamplingSampler = officeSamplingRecord?.who
    const officeSamplingStart = officeSamplingRecord?.startOfficeRaw

    // Convert startDischarge from flatpickr format (Y-m-d H:i) to ISO string
    // If it's already in ISO format, use as is, otherwise parse it
    let startDischargeISO: string
    if (formData.value.startDischarge.includes('T') || formData.value.startDischarge.includes('Z')) {
      startDischargeISO = formData.value.startDischarge
    } else {
      // Parse 'Y-m-d H:i' format
      const startDate = new Date(formData.value.startDischarge.replace(' ', 'T'))
      startDischargeISO = startDate.toISOString()
    }

    // Call autogenerate service
    const result = await autogenerateLineSampling(
      startDischargeISO,
      formData.value.dischargeTimeHours,
      officeSamplingFinish,
      lineSamplingData.value.length > 0 ? lineSamplingData.value : undefined,
      officeSamplingSampler,
      officeSamplingStart
    )

    if (result.success && result.data) {
      lineSamplingData.value = result.data
      
      // Show warnings if any
      if (result.warnings && result.warnings.length > 0) {
        toast.warning(`${result.warnings.length} warning(s): ${result.warnings[0]}`)
      }
      
      // Log audit log to console
      if (result.auditLog) {
        console.log('=== Autogenerate Audit Log ===')
        result.auditLog.forEach(log => console.log(log))
        console.log('=== End Audit Log ===')
      }
      
      toast.success(`Generated ${result.data.length} shift(s)`)
    } else {
      // Show errors
      const errorMessage = result.errors && result.errors.length > 0
        ? result.errors[0]
        : 'Failed to generate shifts'
      
      toast.error(errorMessage)
      
      // Still populate shifts without samplers if data exists
      if (result.data) {
        lineSamplingData.value = result.data
        toast.warning('Some shifts could not be assigned to samplers. Please assign manually.')
      }
      
      // Log audit log to console
      if (result.auditLog) {
        console.error('=== Autogenerate Audit Log (Errors) ===')
        result.auditLog.forEach(log => console.error(log))
        console.error('=== End Audit Log ===')
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Auto generate error:', error)
    toast.error(`Auto generate failed: ${errorMessage}`)
  } finally {
    isGenerating.value = false
  }
}

// Clear Line Sampling data
const clearLineSampling = () => {
  if (confirm('Are you sure you want to clear all Line Sampling shifts?')) {
    lineSamplingData.value = []
    editingLineIndex.value = null
    editingLineData.value = {
      who: '',
      startLineSampling: '',
      finishLineSampling: '',
      hours: ''
    }
    toast.success('Line Sampling data cleared')
  }
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
  populateOfficeSamplingTable(ship)

  // Close dropdown and clear search
  showDropdown.value = false
  searchQuery.value = `${ship.vesselName} - ${ship.amspecReference}`

  toast.success('Form filled with ship nomination data')
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
  altFormat: 'F j, Y at H:i',
  time_24hr: true,
  minuteIncrement: 15,
  locale: { firstDayOfWeek: 1 }
}

// Surveyor options (loaded from service)
const surveyorOptions = ref<string[]>([])

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
  } catch {
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
    surveyorOptions.value = surveyorsResponse.data.map((s: { name: string }) => s.name)
  }

  // Load sampler options for Office Sampling dropdown
  const samplersResponse = await dropdownService.getSamplers(true)
  if (samplersResponse.success && samplersResponse.data) {
    samplerOptions.value = samplersResponse.data.map((s: { name: string }) => s.name)
  }
})
</script>
