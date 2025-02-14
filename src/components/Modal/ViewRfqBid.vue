<template>
  <div>
    <CardBoxModal v-model="value" title="Rfq Bid View">
      <CardBox :is-form="true">
        <FormControl v-model="localItemDetail.id" hidden />
        <FormField label="Amount Request">
          <FormControl
            v-model="localItemDetail.amount"
            type="number"
            :icon="mdiCurrencyUsd"
            disabled
          />
        </FormField>
        <FormField label="Description">
          <FormControl v-model="localItemDetail.description" type="textarea" disabled />
        </FormField>
        <FormField label="Order Deadline">
          <FormControl
            v-model="localItemDetail.orderDeadline"
            type="date"
            :icon="mdiCalendarRange"
            disabled
          />
        </FormField>
        <FormField label="Expected Arrival">
          <FormControl
            v-model="localItemDetail.expectedArrival"
            type="date"
            :icon="mdiCalendarRange"
            disabled
          />
        </FormField>
        <FormField label="Action">
          <FormControl
            v-model="selectedAction"
            type="select"
            :options="actionList"
            :disabled="localItemDetail.isBidFilled"
          />
        </FormField>
        <template v-if="localItemDetail.isApproved && localItemDetail.fileUrl">
          <FormField
            :label="!localItemDetail.fileUrl ? 'Upload Invoice' : 'See Invoice'"
            class="w-full"
          >
            <BaseButton
              as="a"
              color="info"
              label="Download"
              :href="localItemDetail.fileUrl"
              target="_blank"
              :icon="mdiFileDocument"
            />
          </FormField>
          <FormField v-if="!localItemDetail.filePaymentUrl" label="Upload Proof of Payment">
            <FormFilePicker
              v-model="files"
              label="Upload"
              accept="image/*"
              :icon="mdiFileDocumentPlus"
            />
          </FormField>
          <FormField v-else label="Proof of Payment">
            <BaseButton
              as="a"
              color="info"
              label="Download"
              :href="localItemDetail.filePaymentUrl"
              target="_blank"
              :icon="mdiFileDocument"
            />
          </FormField>
          <FormField v-if="localItemDetail.resi" label="No Resi">
            <FormControl
              v-model="localItemDetail.resi"
              type="text"
              disabled
            />
          </FormField>
        </template>
        <template #footer>
          <BaseButtons v-if="!localItemDetail.resi">
            <BaseButton type="button" color="info" label="Submit" @click="submitAction" />
          </BaseButtons>
          <BaseButtons v-if="localItemDetail.resi && !localItemDetail.isCompleted">
            <BaseButton type="button" color="success" label="Order Received" @click="completeRfqBid" />
          </BaseButtons>
        </template>
      </CardBox>
    </CardBoxModal>
  </div>
</template>

<script setup>
import { mdiCurrencyUsd, mdiCalendarRange, mdiFileDocument, mdiFileDocumentPlus } from '@mdi/js'
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
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  itemDetail: {
    type: Object,
    required: true
  }
})
const actionList = ['Approved', 'Reject']
const selectedAction = ref('Approved')
const emit = defineEmits(['update:modelValue', 'cancel', 'confirm', 'update:itemDetail'])
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const localItemDetail = computed({
  get: () => props.itemDetail,
  set: (val) => emit('update:itemDetail', val)
})
const submitAction = async () => {
  if (!localItemDetail.value.isBidFilled) {
    const formToSubmit = {
      rfqBidId: localItemDetail.value.id,
      status: selectedAction.value
    }
    const res = await mainStore.useApi('RfqBid/change-status', 'POST', formToSubmit)
    if (typeof res == 'string') {
      toast.error(res)
      return
    }
    toast.success(res.message || 'Success')
    setTimeout(() => {
      window.location.reload()
    }, 500)
    return;
  }
  if(!files.value || !files.value.base64) {
    toast.error('Please upload proof of payment')
    return
  }
  if(!localItemDetail.value.id) {
    toast.error('Please select a bid')
    return
  }
  const formData = {
    rfqBidId: localItemDetail.value.id,
    imageUrl: files.value?.base64 ?? '',
  }
  const res = await mainStore.useApi('RfqBid/upload-image', 'POST', formData)
  if (typeof res == 'string') {
    toast.error(res)
    return
  }
  toast.success(res.message || 'Success')
  setTimeout(() => {
    window.location.reload()
  }, 500)
}

const completeRfqBid = async () =>
{
  const res = await mainStore.useApi(`RfqBid/complete/${localItemDetail.value.id}`, 'PATCH',{})
  if(typeof res == 'string')
  {
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
