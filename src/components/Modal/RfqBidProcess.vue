<template>
    <div>
      <CardBoxModal v-model="value" title="Submitted Rfq Bid">
        <CardBox :is-form="true">
          <FormControl v-model="localItemDetail.id" hidden/>
          <FormField label="Amount Request">
            <FormControl v-model="localItemDetail.amount"  type="number" :icon="mdiCurrencyUsd" disabled />
          </FormField>
          <FormField label="Description">
            <FormControl v-model="localItemDetail.description" type="textarea" disabled />
          </FormField>
          <FormField label="Order Deadline">
            <FormControl v-model="localItemDetail.orderDeadline" type="date" :icon="mdiCalendarRange" disabled />
          </FormField>
          <FormField label="Expected Arrival">
              <FormControl v-model="localItemDetail.expectedArrival" type="date" :icon="mdiCalendarRange" disabled />
          </FormField>
          <FormField label="Action">
            <FormControl v-model="localItemDetail.status" type="select" :options="actionList" disabled />
          </FormField>
          <FormField v-if="localItemDetail.isApproved" :label="!localItemDetail.fileUrl ? 'Upload Invoice' : 'See Invoice'" class="w-full">
            <template v-if="!localItemDetail.fileUrl">
              <FormFilePicker v-model="files" label="Upload" accept="application/pdf" />
            </template>
            <template v-else>
              <BaseButton as="a" color="info" label="Download" :href="localItemDetail.fileUrl" target="_blank" :icon="mdiFileDocument" />
            </template>
          </FormField>
          <FormField v-if="localItemDetail.filePaymentUrl" label="Proof of Payment">
            <BaseButton
              as="a"
              color="info"
              label="Download"
              :href="localItemDetail.filePaymentUrl"
              target="_blank"
              :icon="mdiFileDocument"
            />
          </FormField>
          <FormField label="No Resi">
            <FormControl v-model="localItemDetail.resi" type="text" :disabled="localItemDetail.isResiFilled" />
          </FormField>
          <template #footer>
            <BaseButtons>
              <BaseButton type="button" color="info" label="Submit" @click="submitAction" />
            </BaseButtons>
          </template>
        </CardBox>
      </CardBoxModal>
    </div>
  </template>
  
  <script setup>
  import {
    mdiCurrencyUsd,
    mdiCalendarRange,
    mdiFileDocument
  } from '@mdi/js'
  import CardBox from '@/components/CardBox.vue'
  import BaseButton from '@/components/BaseButton.vue'
  import CardBoxModal from '@/components/CardBoxModal.vue'
  import FormField from '@/components/FormField.vue'
  import FormControl from '@/components/FormControl.vue'
  import BaseButtons from '@/components/BaseButtons.vue'
  import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import toast from '@/composables/toast'
import FormFilePicker from '../FormFilePicker.vue'

  const mainStore = useMainStore()
  const files = ref()
  watch(files, (value) => {
    console.log(value)
  })
  const props = defineProps({
    modelValue:{
        type:[String,Number,Boolean],
        default:null
    },
    itemDetail:{
        type:Object,
        required:true
    }
  })
  const actionList = [
  'Approved',
  'Reject'
  ]
  const selectedAction = ref('Approved')
  const emit = defineEmits(['update:modelValue','cancel','confirm','update:itemDetail'])
  const value = computed({
    get:()=>props.modelValue,
    set:(val)=>emit('update:modelValue',val)
  })
  const localItemDetail = computed({
    get:()=>props.itemDetail,
    set:(val)=>emit('update:itemDetail',val)
  })
  const submitAction = async () =>
  {
    const formData = {
      rfqBidId:localItemDetail.value.id,
      fileUrl:files.value?.base64 ?? "",
      resi:localItemDetail.value.resi,
    }
    const res = await mainStore.useApi('RfqBid/invoice-or-resid', 'POST', formData)
    if (typeof res == 'string') {
      toast.error(res)
      return
    }
    toast.success(res.message || 'Success')
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }
  </script>
  
  <style lang="scss" scoped></style>
  