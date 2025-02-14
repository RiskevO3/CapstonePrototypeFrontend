<script setup>
import { mdiHomeEdit, mdiCreationOutline } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import { onMounted, ref } from 'vue'
import CreateRfq from '@/components/Modal/CreateRfq.vue'
import RfqTable from '@/components/RfqTable.vue'
import { useMainStore } from '@/stores/main'
import toast from '@/composables/toast'
import CardBoxComponentLoading from '@/components/CardBoxComponentLoading.vue'
import RfqRequestBidTable from '@/components/RfqRequestBidTable.vue'

const mainStore = useMainStore()

const isOwnedRfqLoading = ref(true)
const ownedRfq = ref()
const ownedResRfqBid = ref([])
const clickBtn = () => {
  isCreateModalActive.value = true
}
const isCreateModalActive = ref(false)

const selectOptions = [
  { id: 1, label: 'Business development' },
  { id: 2, label: 'Marketing' },
  { id: 3, label: 'Sales' }
]

const selectVendorOptions = [
  { id: 1, label: 'all vendor' },
  { id: 2, label: 'specific vendor' }
]

const form = ref({
  title: '',
  name: '',
  description: '',
  amount: 0,
  quantity: 0,
  total: 0,
  department: selectOptions[0],
  selectedSchema: selectVendorOptions[0],
  vendorName: '',
  categoryName: '',
  subject: '',
  describe: '',
  orderDeadline: '',
  expectDate: '',
  itemId: 0
})

onMounted(async () => {
  const resBidResult = await mainStore.useApi('RfqBid/rfq-company-bids','GET',{})
  if(typeof resBidResult == 'string'){
    toast.error(resBidResult)
    return
  }
  ownedResRfqBid.value = resBidResult.data
  console.log('ownedResRfqBid',ownedResRfqBid.value)
  const resOwnedRfq = await mainStore.useApi('Rfq/owned-rfqs', 'GET', {
    page: 1,
    pageSize: 10,
    category: ''
  })
  if (typeof resOwnedRfq == 'string') {
    toast.error(resOwnedRfq)
    return
  }
  ownedRfq.value = resOwnedRfq.data
  isOwnedRfqLoading.value = false
})

const submit = () => {
  console.log('submit', form)
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CreateRfq
        v-model="isCreateModalActive"
        :submit="submit"
        :form="form"
        :select-options="selectOptions"
        :select-vendor-options="selectVendorOptions"
      />
      <SectionTitleLineWithButton :icon="mdiHomeEdit" title="Create Rfq" main>
        <BaseButton
          :icon="mdiCreationOutline"
          label="Create Rfq"
          color="info"
          rounded-full
          small
          @click="clickBtn"
        />
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" :has-table="isOwnedRfqLoading ? false : true">
        <CardBoxComponentLoading v-if="isOwnedRfqLoading" />
        <CardBoxComponentEmpty v-else-if="ownedRfq.data.length < 1" />
        <RfqTable v-else :rfq-data="ownedRfq.data" :is-edit-disabled="true" />
      </CardBox>
      <div class="mt-32">
        <SectionTitleLineWithButton :icon="mdiHomeEdit" title="Rfq Bids" main>
        </SectionTitleLineWithButton>
        <CardBox :has-table="isOwnedRfqLoading ? false : true">
          <CardBoxComponentLoading v-if="isOwnedRfqLoading" />
          <CardBoxComponentEmpty v-else-if="ownedResRfqBid.length < 1" />
          <RfqRequestBidTable v-else :rfq-data="ownedResRfqBid" />
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
