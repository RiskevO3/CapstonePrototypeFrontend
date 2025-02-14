<template>
  <div>
    <CardBoxModal v-model="value" title="Rfq Form">
      <CardBox :is-form="true" @submit.prevent="submitRfq">
        <FormField label="Rfq Vendor">
          <FormControl v-model="localForm.selectedSchema" :options="props.selectVendorOptions"/>
        </FormField>
        <FormField
          v-if="localForm.selectedSchema.label == 'specific vendor' && listVendor.length > 0"
          label="Selected Vendor"
        >
          <div class="flex flex-wrap items-center gap-2">
            <ChipComp
              v-for="vendor in listVendor"
              :key="vendor.id"
              @click="removeItemFromVendorList(vendor.id)"
            >
              {{ vendor.name }}
            </ChipComp>
          </div>
        </FormField>
        <FormField v-if="localForm.selectedSchema.label == 'specific vendor'" label="Add Vendor">
          <div class="flex flex-col w-full">
            <FormControl
              v-model="localForm.vendorName"
              :icon="mdiDatabasePlus"
              placeholder="input request vendor name here"
              class="w-full"
              @keyup.enter="addVendorToList"
            />
            <div
              class="max-h-56 bg-slate-500 rounded-b-md py-2 px-4 overflow-y-auto"
              :class="{
                'flex items-center justify-center': isSearchVendorLoading,
                hidden: localForm.vendorName.length < 3
              }"
            >
              <LoadingComp v-if="isSearchVendorLoading" />
              <template v-else>
                <template v-if="searchVendorResult.length == 0">
                  <p class="text-white text-center">no result...</p>
                </template>
                <template v-else>
                  <template v-for="vendor in searchVendorResult" :key="vendor.id">
                    <BaseButton
                      class="w-full my-1 truncate"
                      type="button"
                      color="info"
                      :label="vendor.name"
                    />
                  </template>
                </template>
              </template>
            </div>
          </div>
        </FormField>

        <BaseDivider />
        
        <FormField label="Title">
          <FormControl
            v-model="localForm.title"
            :icon="mdiShape"
            placeholder="input request rfq title here"
          />
        </FormField>
        <FormField v-if="listCategory.length > 0" label="Selected Category">
          <div class="flex flex-wrap items-center gap-2">
            <ChipComp
              v-for="category in listCategory"
              :key="category.id"
              @click="removeItemFromCategoryList(category.id)"
            >
              {{ category.name }}
            </ChipComp>
          </div>
        </FormField>
        <FormField label="Category">
          <div class="flex flex-col w-full">
            <FormControl
              v-model="localForm.categoryName"
              :icon="mdiShape"
              placeholder="input request category name here"
              class="w-full"
            />
            <div
              class="max-h-56 bg-slate-500 rounded-b-md py-2 px-4 overflow-y-auto"
              :class="{
                'flex items-center justify-center': isSearchCategoryLoading,
                hidden: localForm.categoryName.length < 3
              }"
            >
              <LoadingComp v-if="isSearchCategoryLoading" />
              <template v-else>
                <template v-if="searchCategoryResult.length == 0">
                  <p class="text-white text-center">no result...</p>
                </template>
                <template v-else>
                  <template v-for="category in searchCategoryResult" :key="category.id">
                    <BaseButton
                      class="w-full my-1 truncate"
                      type="button"
                      color="info"
                      :label="category.name"
                      @click="addCategoryToList(category)"
                    />
                  </template>
                </template>
              </template>
            </div>
          </div>
        </FormField>

        <BaseDivider />

        <FormField v-if="listItem.length > 0" label="Added Item">
          <template v-for="(item, index) in listItem" :key="item.id">
            <FormField
              :label="`Added Item-${index + 1}`"
              class="bg-slate-800 px-4 py-2 rounded-md text-white my-2"
              :is-expandable="true"
            >
              <FormControl v-model="item.name" :disabled="true" :icon="mdiDatabasePlus" />
              <FormControl v-model="item.description" :disabled="true" :icon="mdiDatabasePlus" />
              <FormControl
                v-model="item.amount"
                type="number"
                :disabled="true"
                :icon="mdiDatabaseOutline"
              />
              <FormControl
                v-model="item.quantity"
                type="number"
                :disabled="true"
                :icon="mdiCurrencyUsd"
              />
              <FormControl
                v-model="item.total"
                type="number"
                :disabled="true"
                :icon="mdiCurrencyUsd"
              />
              <BaseButton
                type="button"
                color="danger"
                label="Remove"
                @click="removeItemFromlistItem(item.id)"
              />
            </FormField>
          </template>
        </FormField>
        <FormField label="Add Item">
          <FormControl v-model="localForm.itemId" class="hidden" />
          <div class="flex flex-col w-full">
            <FormControl
              v-model="localForm.name"
              :icon="mdiDatabasePlus"
              placeholder="input ur item name here"
              :disabled="isAddItemLoading"
            />
            <div
              class="max-h-56 bg-slate-500 rounded-b-md py-2 px-4 overflow-y-auto"
              :class="{
                'flex items-center justify-center': isSearchItemLoading,
                hidden:
                  localForm.name.length < 3 ||
                  (searchItemResult.length == 0 && !isSearchItemLoading)
              }"
            >
              <LoadingComp v-if="isSearchItemLoading" />
              <template v-else>
                <!-- <template v-if="searchItemResult.length == 0">
                  <p class="text-white text-center">no result...</p>
                </template> -->
                <template v-if="searchItemResult.length > 0">
                  <template v-for="itm in searchItemResult" :key="itm.id">
                    <BaseButton
                      class="w-full my-1 truncate"
                      type="button"
                      color="info"
                      :label="itm.name"
                      @click="fillItemForm(itm)"
                    />
                  </template>
                </template>
              </template>
            </div>
          </div>
          <FormControl
            v-model="localForm.description"
            type="textarea"
            :icon="mdiDatabasePlus"
            placeholder="input ur description item here"
            :disabled="isAddItemLoading"
          />
          <FormControl
            v-model="localForm.amount"
            type="number"
            :icon="mdiDatabaseOutline"
            :disabled="isAddItemLoading"
          />
          <FormControl
            v-model="localForm.quantity"
            type="number"
            :icon="mdiCurrencyUsd"
            :disabled="isAddItemLoading"
          />
          <BaseButton
            type="button"
            color="info"
            label="Add"
            :disabled="isAddItemLoading"
            :is-loading="isAddItemLoading"
            @click="addItemTolistItem"
          />
        </FormField>

        <BaseDivider />

        <FormField label="Order Deadline & Expected Arrival Date">
          <FormControl v-model="localForm.orderDeadline" type="date" :icon="mdiCalendarRange" />
          <FormControl v-model="localForm.expectDate" type="date" :icon="mdiCalendarRange" />
        </FormField>

        <FormField
          label="Additional Explanation"
          help="Write here if there is additional information."
        >
          <FormControl
            v-model="localForm.describe"
            type="textarea"
            placeholder="Describe in advance for the items u want to request."
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" />
          </BaseButtons>
        </template>
      </CardBox>
    </CardBoxModal>
  </div>
</template>

<script setup>
import {
  mdiDatabaseOutline,
  mdiCurrencyUsd,
  mdiDatabasePlus,
  mdiCalendarRange,
  mdiShape
} from '@mdi/js'
import CardBox from '@/components/CardBox.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import { defineProps, defineEmits, computed, ref, watchEffect } from 'vue'
import ChipComp from '../ChipComp.vue'
import LoadingComp from '../LoadingComp.vue'
import { useMainStore } from '@/stores/main'
import toast from '@/composables/toast'

const mainStore = useMainStore()

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  submit: {
    type: Function,
    required: true
  },
  form: {
    type: Object,
    required: true
  },
  selectOptions: {
    type: Array,
    required: true
  },
  selectVendorOptions: {
    type: Array,
    required: true
  }
})
const emit = defineEmits(['update:modelValue', 'cancel', 'confirm', 'update:form'])
const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Create a local reactive copy of the form prop
const localForm = computed({
  get: () => props.form,
  set: (value) => emit('update:form', value)
})

const listItem = ref([])
const searchItemResult = ref([])
const isSearchItemLoading = ref(false)
const isAddItemLoading = ref(false)
const isFromAddedItem = ref(false)
const fillItemForm = (item) => {
  localForm.value.itemId = item.id
  localForm.value.name = item.name
  localForm.value.description = item.description
  isFromAddedItem.value = true
}
const addItemTolistItem = async () => {
  try {
    if (
      localForm.value.name == '' ||
      localForm.value.amount == 0 ||
      localForm.value.quantity == 0
    ) {
      toast.error('Please fill all the form')
      return
    }
    let theItemId
    isAddItemLoading.value = true
    if (localForm.value.itemId == 0) {
      const res = await mainStore.useApi(`Product/add`, 'POST', {
        name: localForm.value.name,
        description: localForm.value.description
      })
      if (typeof res != 'object') {
        toast.error(res)
        isAddItemLoading.value = false
        return
      }
      theItemId = res.data.id
    }
    listItem.value.push({
      id: theItemId ?? localForm.value.itemId,
      name: localForm.value.name,
      description: localForm.value.description,
      amount: localForm.value.amount,
      quantity: localForm.value.quantity,
      total: localForm.value.amount * localForm.value.quantity
    })
    localForm.value.itemId = 0
    localForm.value.name = ''
    localForm.value.description = ''
    localForm.value.amount = 0
    localForm.value.quantity = 0
    isAddItemLoading.value = false
    toast.success('Item added')
  } catch (e) {
    toast.error(e.response.data.message ?? 'Failed to add item')
  }
}
const removeItemFromlistItem = (id) => {
  listItem.value = listItem.value.filter((item) => item.id !== id)
}
let searchItemTimeout
watchEffect(() => {
  if (localForm.value.name.length >= 3) {
    clearTimeout(searchItemTimeout)
    searchItemResult.value = []
    if (isFromAddedItem.value) {
      isFromAddedItem.value = false
      return
    }
    localForm.value.itemId = ''
    isSearchItemLoading.value = true
    searchItemTimeout = setTimeout(async () => {
      const res = await mainStore.useApi(`Product/search/${localForm.value.name}`, 'GET', {})
      if (typeof res == 'object') {
        searchItemResult.value = res.data
      }
      isSearchItemLoading.value = false
    }, 500)
  }
})

const listVendor = ref([])
const searchVendorResult = ref([])
const isSearchVendorLoading = ref(false)
const addVendorToList = () => {
  listVendor.value.push({
    id: listVendor.value.length + 1,
    name: localForm.value.vendorName
  })
  localForm.value.vendorName = ''
}
const removeItemFromVendorList = (id) => {
  listVendor.value = listVendor.value.filter((vendor) => vendor.id !== id)
}

const listCategory = ref([])
const searchCategoryResult = ref([])
const isSearchCategoryLoading = ref(false)
let searchCategoryTimeout
watchEffect(() => {
  if (localForm.value.categoryName.length >= 3) {
    clearTimeout(searchCategoryTimeout)
    searchCategoryResult.value = []
    isSearchCategoryLoading.value = true
    searchCategoryTimeout = setTimeout(async () => {
      const res = await mainStore.useApi('Rfq/category-search', 'GET', {
        search: localForm.value.categoryName
      })
      if (typeof res == 'object') {
        searchCategoryResult.value = res.data
      }
      isSearchCategoryLoading.value = false
    }, 500)
  }
})
const addCategoryToList = (category) => {
  listCategory.value.push(category)
  localForm.value.categoryName = ''
}
const removeItemFromCategoryList = (id) => {
  listCategory.value = listCategory.value.filter((category) => category.id !== id)
}

const submitRfq = async () => {
  try {
    if (
      listCategory.value.length == 0 ||
      localForm.value.title == '' ||
      localForm.value.orderDeadline == '' ||
      localForm.value.expectDate == '' ||
      listItem.value.length == 0 ||
      localForm.value.describe == ''
    ) {
      console.log('listCategory', listCategory.value)
      console.log('localForm', localForm.value)
      console.log('listItem', listItem.value)
      toast.error('Please fill all the form')
      return
    }
    const submittedData = {
      compCategoryId: listCategory.value[0].id,
      title: localForm.value.title,
      bidType: 'all',
      description: localForm.value.describe,
      orderDeadline: localForm.value.orderDeadline,
      expectedArrival: localForm.value.expectDate,
      purchasedProducts: listItem.value.map((item) => {
        return {
          productId: item.id,
          unitPrice: item.amount,
          quantity: item.quantity,
          total: item.total
        }
      })
    }
    const res = await mainStore.useApi('Rfq/add','POST',submittedData)
    if (typeof res != 'object') {
      toast.error(res)
      return
    }
    toast.success('Rfq submitted')
    setTimeout(() => {
      window.location.reload()
    }, 500)
  } catch (e) {
    toast.error(e.response.data.message ?? 'Failed to submit rfq')
  }
}
</script>

<style lang="scss" scoped></style>
