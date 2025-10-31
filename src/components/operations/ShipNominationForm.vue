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
          @blur="validateAmspecReference()"
          type="text"
          required
          class="w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          :class="amspecRefError ? 'border-red-500 focus:ring-red-500/20 dark:border-red-600' : 'border-gray-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700'"
          placeholder="Enter AmSpec reference number"
        />
        <p v-if="amspecRefError" class="mt-1 text-xs text-red-600 dark:text-red-400">{{ amspecRefError }}</p>
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
      <Button type="submit" variant="primary" size="md" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
        <span v-else>{{ isEditing ? 'Update Nomination' : 'Submit Nomination' }}</span>
      </Button>
      <Button type="button" variant="outline" size="md" @click="handleReset">
        Reset
      </Button>
      <Button v-if="isEditing" type="button" variant="outline" size="md" @click="handleReset">
        Cancel Edit
      </Button>
    </div>
  </form>

  <!-- Nominations Table -->
  <div class="mt-8 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Nominations</h3>
      <button
        @click="loadNominations"
        class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
      >
        Refresh
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingNominations" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-r-transparent"></div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="nominations.length === 0"
      class="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800"
    >
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-4 text-sm font-medium text-gray-900 dark:text-white">No nominations</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating a new nomination.
      </p>
    </div>

    <!-- Table -->
    <div
      v-else
      class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <!-- Table header controls -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span>Rows per page:</span>
          <select
            class="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            v-model.number="rowsPerPage"
            @change="onRowsPerPageChange"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span>
            Showing {{ pageStart }}–{{ pageEnd }} of {{ totalItems }}
          </span>
          <div class="flex items-center gap-1">
            <button
              class="rounded-md px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              :disabled="currentPage === 1"
              @click="goToPrevPage"
              aria-label="Previous Page"
            >
              ‹
            </button>
            <span class="px-2">Page {{ currentPage }} / {{ totalPages }}</span>
            <button
              class="rounded-md px-2 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              :disabled="currentPage === totalPages || totalPages === 0"
              @click="goToNextPage"
              aria-label="Next Page"
            >
              ›
            </button>
          </div>
        </div>
      </div>
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              AmSpec Ref
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Vessel Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Clients
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Product Types
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              <button
                type="button"
                class="inline-flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400"
                @click="toggleEtbSort"
                title="Sort by ETB"
              >
                <span>ETB</span>
                <svg v-if="sortBy === 'etb' && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 12a1 1 0 011.707-.707L9 15.586V4a1 1 0 112 0v11.586l4.293-4.293A1 1 0 1116.707 12l-6 6a1 1 0 01-1.414 0l-6-6A1 1 0 013 12z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="sortBy === 'etb' && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M17 8a1 1 0 01-1.707.707L11 4.414V16a1 1 0 11-2 0V4.414L4.707 8.707A1 1 0 113.293 7.293l6-6a1 1 0 011.414 0l6 6A1 1 0 0117 8z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 15l5 5 5-5M7 9l5-5 5 5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          <tr
            v-for="nomination in nominations"
            :key="nomination._id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
              {{ nomination.amspecReference }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
              {{ nomination.vesselName }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(client, index) in nomination.clients"
                  :key="index"
                  class="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {{ client }}
                </span>
                <span v-if="!nomination.clients || nomination.clients.length === 0" class="text-gray-400">-</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="(productType, index) in nomination.productTypes"
                  :key="index"
                  class="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
                >
                  {{ productType }}
                </span>
              </div>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
              {{ nomination.etb ? formatDate(nomination.etb) : '-' }}
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span
                class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                :class="
                  nomination.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                "
              >
                {{ nomination.status || 'pending' }}
              </span>
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-sm">
              <div class="flex items-center gap-2">
                <button
                  @click="viewNomination(nomination)"
                  class="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
                  title="View"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  @click="editNomination(nomination)"
                  class="rounded-lg p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 transition-all duration-200"
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
                  @click="deleteNomination(nomination)"
                  class="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200"
                  title="Delete"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

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

  <!-- View Nomination Modal -->
  <ViewNominationModal
    :isOpen="showViewModal"
    :nomination="selectedNomination"
    @close="showViewModal = false"
  />

  <!-- Confirmation Modal for Delete -->
  <ConfirmationModal
    :isOpen="showDeleteConfirm"
    :title="'Delete Nomination'"
    :message="`Are you sure you want to delete this nomination?\n\nVessel: ${selectedNomination?.vesselName}\nReference: ${selectedNomination?.amspecReference}\n\nThis action cannot be undone.`"
    variant="danger"
    confirmText="Yes, delete"
    @confirm="executeDelete"
    @close="showDeleteConfirm = false"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MultipleSelect from '@/components/forms/FormElements/MultipleSelect.vue'
import Button from '@/components/ui/Button.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { createShipNomination, getAllShipNominations, updateShipNomination, deleteShipNomination, checkAmspecReference, type ShipNominationData, type ShipNomination } from '@/services/shipNominationService'
import dropdownService from '@/services/dropdownService'
import ManageDropdownModal from './ManageDropdownModal.vue'
import ManageSamplerModal from './ManageSamplerModal.vue'
import ViewNominationModal from './ViewNominationModal.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import { useToast } from 'vue-toastification'

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

// AmSpec Reference input state
const amspecRefError = ref('')
const originalRefWhenEditing = ref<string | null>(null)

const validateAmspecReference = async () => {
  amspecRefError.value = ''
  const value = formData.value.amspecReference?.trim()
  if (!value) {
    amspecRefError.value = 'AmSpec Reference is required'
    return
  }
  // If editing and not changed, skip uniqueness check
  if (isEditing.value && originalRefWhenEditing.value === value) {
    return
  }
  try {
    const res = await checkAmspecReference(value)
    if (res.success && res.exists) {
      amspecRefError.value = 'This AmSpec Reference already exists'
    }
  } catch {
    // ignore network errors here; server will validate on submit
  }
}

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

// Load nominations from API
const currentPage = ref(1)
const rowsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)

const pageStart = computed(() => (totalItems.value === 0 ? 0 : (currentPage.value - 1) * rowsPerPage.value + 1))
const pageEnd = computed(() => Math.min(currentPage.value * rowsPerPage.value, totalItems.value))

const sortBy = ref<'createdAt' | 'etb'>('etb')
const sortOrder = ref<'asc' | 'desc'>('desc')

const loadNominations = async () => {
  isLoadingNominations.value = true
  try {
    const response = await getAllShipNominations({
      page: currentPage.value,
      limit: rowsPerPage.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    })
    if (response.success && response.data) {
      nominations.value = response.data
      totalItems.value = response.total ?? response.count ?? response.data.length
      totalPages.value = response.pages ?? Math.ceil((response.total ?? response.data.length) / rowsPerPage.value)
    }
  } catch (error) {
    console.error('Error loading nominations:', error)
  } finally {
    isLoadingNominations.value = false
  }
}

const onRowsPerPageChange = () => {
  currentPage.value = 1
  loadNominations()
}

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
    loadNominations()
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
    loadNominations()
  }
}

const toggleEtbSort = () => {
  if (sortBy.value !== 'etb') {
    sortBy.value = 'etb'
    sortOrder.value = 'asc'
  } else {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  currentPage.value = 1
  loadNominations()
}

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Load dropdown data on component mount
onMounted(() => {
  loadDropdownData()
  loadNominations()
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

// Initialize toast
const toast = useToast()

// Loading state
const isSubmitting = ref(false)
const isLoadingNominations = ref(false)
const nominations = ref<ShipNomination[]>([])

// Edit and Delete state
const showViewModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedNomination = ref<ShipNomination | null>(null)
const isEditing = ref(false)

// Form handlers
const handleSubmit = async () => {
  // Validate required fields
  if (!formData.value.vesselName || !formData.value.amspecReference || formData.value.productTypes.length === 0) {
    toast.warning('Please fill in all required fields: Vessel Name, AmSpec Reference #, and Product Types')
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

    // Validate AmSpec Reference uniqueness before submit
    await validateAmspecReference()
    if (amspecRefError.value) {
      toast.error(amspecRefError.value)
      return
    }

    // Check if editing or creating
    let response
    if (isEditing.value && selectedNomination.value) {
      // Update existing nomination
      response = await updateShipNomination(selectedNomination.value._id, nominationData)
    } else {
      // Create new nomination
      response = await createShipNomination(nominationData)
    }

    if (response.success) {
      // Show success toast
      const action = isEditing.value ? 'updated' : 'created'
      toast.success(`Ship Nomination ${action} successfully! Reference: ${response.data?.amspecReference}`)

      // Reset form after successful submission
      handleReset()
      
      // Reload nominations to show the changes
      loadNominations()
    } else {
      toast.error(response.message || 'Failed to create nomination')
    }
  } catch (error: unknown) {
    console.error('Error submitting form:', error)

    // Handle specific error types
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { errors?: string[]; message?: string } } }
      const errorData = axiosError.response?.data
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        toast.error(`Validation Errors: ${errorData.errors.join(', ')}`)
      } else {
        toast.error(errorData?.message || 'Failed to create nomination')
      }
    } else {
      toast.error('Network error. Please make sure the backend server is running on port 5000.')
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
  
  // Reset edit state
  isEditing.value = false
  selectedNomination.value = null
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

// View nomination - show details modal
const viewNomination = (nomination: ShipNomination) => {
  selectedNomination.value = nomination
  showViewModal.value = true
}

// Edit nomination - load data into form
const editNomination = (nomination: ShipNomination) => {
  isEditing.value = true
  selectedNomination.value = nomination
  originalRefWhenEditing.value = nomination.amspecReference
  
  // Load data into form
  formData.value.vesselName = nomination.vesselName
  formData.value.amspecReference = nomination.amspecReference
  formData.value.clientReference = nomination.clientReference || ''
  
  // Convert clients to multiselect format
  formData.value.clients = nomination.clients?.map(client => ({ value: client, label: client })) || []
  
  // Convert product types to multiselect format
  formData.value.productTypes = nomination.productTypes?.map(pt => ({ value: pt, label: pt })) || []
  
  formData.value.agent = nomination.agent || ''
  formData.value.pilotOnBoard = nomination.pilotOnBoard || ''
  formData.value.etb = nomination.etb || ''
  formData.value.etc = nomination.etc || ''
  formData.value.terminal = nomination.terminal || ''
  formData.value.berth = nomination.berth || ''
  formData.value.surveyor = nomination.surveyor || ''
  formData.value.sampler = nomination.sampler || ''
  formData.value.chemist = nomination.chemist || ''
  
  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  toast.info('Nomination loaded for editing')
}

// Delete nomination - show confirmation modal
const deleteNomination = (nomination: ShipNomination) => {
  selectedNomination.value = nomination
  showDeleteConfirm.value = true
}

// Execute delete after confirmation
const executeDelete = async () => {
  if (!selectedNomination.value) return
  
  try {
    const response = await deleteShipNomination(selectedNomination.value._id)
    if (response.success) {
      toast.success('Nomination deleted successfully')
      loadNominations()
      selectedNomination.value = null
    } else {
      toast.error(response.message || 'Failed to delete nomination')
    }
  } catch (error) {
    console.error('Error deleting nomination:', error)
    toast.error('Failed to delete nomination')
  } finally {
    showDeleteConfirm.value = false
  }
}
</script>
