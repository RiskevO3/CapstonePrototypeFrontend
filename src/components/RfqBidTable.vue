<script setup>
import { computed, ref } from 'vue'
import { mdiEye } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useMainStore } from '@/stores/main'
import toast from '@/composables/toast'
import RfqBidProcess from './Modal/RfqBidProcess.vue'

const mainStore = useMainStore()

const props = defineProps({
  rfqData:{
    type:Array,
    required:true
  }
})
const items = computed(() => props.rfqData)

const isModalActive = ref(false)
const isModalDangerActive = ref(false)

const perPage = ref(5)

const currentPage = ref(0)

const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const toIdr = (value) => {
  return value.toLocaleString('id-ID')
}

const formatDate = (date) => {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

const rfqItemDetail = ref({
  id:0,
  amount:0,
  description:"",
  expectedArrival:'2024-12-16',
  orderDeadline:'2024-12-16',
  rfqId:0,
  isBidFilled:false,
  isApproved:false,
  fileUrl:"",
  resi:"",
  status:"",
  filePaymentUrl:"",
  isResiFilled:false
})

const getRfqBidDetails = async (id)=>
{
  const res = await mainStore.useApi(`RfqBid/rfq-bid/${id}`, 'GET',{})
  if(typeof res != 'object')
  {
    toast.error(res)
    return;
  }
  rfqItemDetail.value = res.data
  rfqItemDetail.value.id = id
  rfqItemDetail.value.expectedArrival = rfqItemDetail.value.expectedArrival.split('T')[0]
  rfqItemDetail.value.orderDeadline = rfqItemDetail.value.orderDeadline.split('T')[0]
  rfqItemDetail.value.isBidFilled = rfqItemDetail.value.status != 'Pending'
  rfqItemDetail.value.isApproved = rfqItemDetail.value.status == 'Approved'
  rfqItemDetail.value.fileUrl = rfqItemDetail.value.fileUrl ?? ""
  rfqItemDetail.value.isResiFilled = rfqItemDetail.value.resi != ""
  isModalActive.value = true
}
</script>

<template>
  <RfqBidProcess v-model="isModalActive" :item-detail="rfqItemDetail" />
  <CardBoxModal v-model="isModalDangerActive" title="Please confirm" button="danger" has-cancel>
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th>Company Name</th>
        <th>Name</th>
        <th>Category</th>
        <th>Order Deadline</th>
        <th>E.Arrival</th>
        <th>Amount</th>
        <th class="text-center">Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in itemsPaginated" :key="item.id">
        <td data-label="Company Name">
          {{ item.companyName }}
        </td>
        <td data-label="Name">
          {{ item.name }}
        </td>
        <td data-label="Category">
          {{ item.category }}
        </td>
        <td data-label="Order Deadline">
          {{formatDate(item.orderDeadline)}}
        </td>
        <td data-label="E.Arrival" class="lg:w-1 whitespace-nowrap">
            {{ formatDate(item.expectedArrival) }}
        </td>
        <td class="lg:w-1 whitespace-nowrap" data-label="Amount">
           Rp.{{toIdr(item.amount)}}
        </td>
        <td class="before:hidden">
        <BaseButton class="w-full" :label="item.status" :color="item.status == 'Pending' ? 'info':item.status == 'Approved' ? 'success' : 'danger'" type="button"/>
        </td>
        <td class="before:hidden lg:w-1">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton 
            color="info" 
            :icon="mdiEye"  
            @click="getRfqBidDetails(item.id)" />
            <!-- <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              @click="isModalDangerActive = true"
            /> -->
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
