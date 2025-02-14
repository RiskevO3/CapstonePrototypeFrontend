<template>
    <div>
      <CardBoxModal v-model="value" title="Rfq Bid Form">
        <CardBox :is-form="true" @submit.prevent="submitBid">
          <FormControl v-model="localItemDetail.id" hidden/>
          <FormField label="Amount Request">
            <FormControl v-model="localItemDetail.amount"  type="number" :icon="mdiCurrencyUsd" />
          </FormField>
          <FormField label="Description">
            <FormControl v-model="description" type="textarea" />
          </FormField>
          <FormField label="Order Deadline">
            <FormControl v-model="localItemDetail.orderDeadline" type="date" :icon="mdiCalendarRange" />
          </FormField>
            <FormField label="Expected Arrival">
                <FormControl v-model="localItemDetail.expectedArrival" type="date" :icon="mdiCalendarRange" />
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
    mdiCurrencyUsd,
    mdiCalendarRange,
  } from '@mdi/js'
  import CardBox from '@/components/CardBox.vue'
  import BaseButton from '@/components/BaseButton.vue'
  import CardBoxModal from '@/components/CardBoxModal.vue'
  import FormField from '@/components/FormField.vue'
  import FormControl from '@/components/FormControl.vue'
  import BaseButtons from '@/components/BaseButtons.vue'
  import { defineProps, defineEmits, computed, ref, watchEffect } from 'vue'
  import { useMainStore } from '@/stores/main'
  import toast from '@/composables/toast'
  const mainStore = useMainStore()
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
  const emit = defineEmits(['update:modelValue','cancel','confirm','update:itemDetail'])
  const value = computed({
    get:()=>props.modelValue,
    set:(val)=>emit('update:modelValue',val)
  })
  const localItemDetail = computed({
    get:()=>props.itemDetail,
    set:(val)=>emit('update:itemDetail',val)
  })
  const description = ref('')
  const submitBid = async ()=>
  {
    try
    {
        const formToSubmit = {
            rfqId:localItemDetail.value.id,
            amount:localItemDetail.value.amount,
            description:description.value,
            orderDeadline:localItemDetail.value.orderDeadline,
            expectedArrival:localItemDetail.value.expectedArrival
        }
        // check if there is any empty field
        for(const key in formToSubmit)
        {
            console.log(key)
            console.log(key != 'description')
            if((formToSubmit[key] === '' || formToSubmit[key] === null) && key != 'description')
            {
                toast.error('Please fill all the fields')
                return;
            }
        }
        const res = await mainStore.useApi('RfqBid/add','POST',formToSubmit)
        if(typeof res != 'object')
        {
            toast.error('Failed to submit bid')
            return;
        }
        toast.success('Bid submitted successfully')
        setTimeout(() => {
            window.location.reload()
        }, 500);
    }
    catch(e)
    {
      toast.error(e.response.data.message || "Failed to submit bid")
    }
  }
  </script>
  
  <style lang="scss" scoped></style>
  