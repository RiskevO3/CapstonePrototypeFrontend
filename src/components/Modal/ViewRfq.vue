<template>
    <div>
      <CardBoxModal v-model="value" title="Rfq Form">
        <CardBox :is-form="true">

          <FormField label="Title">
            <FormControl
              v-model="localForm.title"
              :icon="mdiShape"
              placeholder="input request rfq title here"
            />
          </FormField>
          <FormField v-if="localForm.category.length > 0" label="Selected Category">
            <div class="flex flex-wrap items-center gap-2">
              <ChipComp
                v-for="category in localForm.category"
                :key="category.id"
              >
                {{ category.name }}
              </ChipComp>
            </div>
          </FormField>
          <FormField v-if="localForm.purchasedProducts.length > 0" label="Added Item">
            <template v-for="(item, index) in localForm.purchasedProducts" :key="item.id">
              <FormField
                :label="`Added Item-${index + 1}`"
                class="bg-slate-800 px-4 py-2 rounded-md text-white my-2"
                :is-expandable="true"
              >
                <FormControl v-model="item.name" :disabled="true" :icon="mdiDatabasePlus" />
                <FormControl v-model="item.description" :disabled="true" :icon="mdiDatabasePlus" />
                <FormControl
                  v-model="item.unitPrice"
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
                  v-model="item.amount"
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
          <FormField label="Order Deadline & Expected Arrival Date">
            <FormControl v-model="localForm.orderDeadline" type="date" :icon="mdiCalendarRange" disabled />
            <FormControl v-model="localForm.expectedArrival" type="date" :icon="mdiCalendarRange" disabled />
          </FormField>
          <FormField
            label="Additional Explanation"
            help="Write here if there is additional information."
          >
            <FormControl
              v-model="localForm.description"
              type="textarea"
              placeholder="Describe in advance for the items u want to request."
              disabled
            />
          </FormField>
          <template #footer>
            <BaseButtons>
              <BaseButton 
              type="button" 
              color="success" 
              label="Close"
              @click="value = false"
              />
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
  import BaseButtons from '@/components/BaseButtons.vue'
  import { defineProps, defineEmits, computed, ref, watchEffect } from 'vue'
  import ChipComp from '../ChipComp.vue'
  import { useMainStore } from '@/stores/main'
  import toast from '@/composables/toast'
  
  const mainStore = useMainStore()
  
  const props = defineProps({
    modelValue: {
      type: [String, Number, Boolean],
      default: null
    },
    form: {
      type: Object,
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
  console.log("localForm",localForm)
  const listItem = ref([])
  const removeItemFromlistItem = (id) => {
    listItem.value = listItem.value.filter((item) => item.id !== id)
  }
  
  
  const listCategory = ref([])
  const removeItemFromCategoryList = (id) => {
    listCategory.value = listCategory.value.filter((category) => category.id !== id)
  }
  </script>
  
  <style lang="scss" scoped></style>
  