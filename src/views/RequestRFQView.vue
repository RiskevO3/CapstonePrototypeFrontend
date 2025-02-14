<script setup>
import { mdiHomeEdit } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import { onMounted, ref } from 'vue'
import RfqTable from '@/components/RfqTable.vue'
import { useMainStore } from '@/stores/main'
import toast from '@/composables/toast'
import CardBoxComponentLoading from '@/components/CardBoxComponentLoading.vue'
import RfqBidTable from '@/components/RfqBidTable.vue'

const mainStore = useMainStore()

const isOwnedRfqLoading = ref(true)
const ownedRfq = ref()
const ownedRfqBid = ref()



onMounted(async () => {
  const resOwnedRfq = await mainStore.useApi('Rfq/auth-category-rfqs', 'GET', {
    page: 1,
    pageSize: 10,
    category: ''
  })
  const resOwnedRfqBid = await mainStore.useApi('Rfq/owned-rfq-bids', 'GET', {
    page: 1,
    pageSize: 10,
    category: ''
  })
  if (typeof resOwnedRfq == 'string' || typeof resOwnedRfqBid == 'string') {
    toast.error(resOwnedRfq)
    isOwnedRfqLoading.value = false
    return
  }
  ownedRfq.value = resOwnedRfq.data
  ownedRfqBid.value = resOwnedRfqBid.data
  isOwnedRfqLoading.value = false
})

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiHomeEdit" title="Rfq List" main>
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" :has-table="isOwnedRfqLoading ? false : true">
        <CardBoxComponentLoading v-if="isOwnedRfqLoading" />
        <CardBoxComponentEmpty v-else-if="ownedRfq.data.length < 1" />
        <RfqTable v-else :rfq-data="ownedRfq.data" />
      </CardBox>
      <div class="mt-32">
        <SectionTitleLineWithButton :icon="mdiHomeEdit" title="Bids Status List" main>
        </SectionTitleLineWithButton>
        <CardBox :has-table="isOwnedRfqLoading ? false : true">
          <CardBoxComponentLoading v-if="isOwnedRfqLoading" />
          <CardBoxComponentEmpty v-else-if="ownedRfqBid.length < 1" />
          <RfqBidTable v-else :rfq-data="ownedRfqBid" />
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
