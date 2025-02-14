<script setup>
import { computed, ref } from 'vue'
import { mdiEye,mdiFileEdit } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import CreateRfqBid from './Modal/CreateRfqBid.vue'
import { useMainStore } from '@/stores/main'
import toast from '@/composables/toast'
import ViewRfq from './Modal/ViewRfq.vue'

const mainStore = useMainStore()

const props = defineProps({
  rfqData:{
    type:Array,
    required:true
  },
  isEditDisabled:{
    type:Boolean,
    default:false
  }
})

const items = computed(() => props.rfqData)

const isModalActive = ref(false)
const isModalDetailActive = ref(false)
const isModalDangerActive = ref(false)

const perPage = ref(5)

const currentPage = ref(0)

const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))
const selectedItem = ref({
  id:0,
  title:'',
  companyName:'',
  amount:10000,
  orderDeadline:'2021-09-01',
  expectedArrival:'2021-09-01'
})
const detailItem = ref({
  bidType:"",
  category:[],
  companyName:"",
  createdAt:"2024-12-16",
  description:"",
  expectedArrival:"2024-12-16",
  id:0,
  orderDeadline:"2024-12-16",
  purchasedProducts:[],
  title:"",
  updatedAt:"2024-12-16",
})
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

const openDetailModal = async (item)=>
{
  const res = await mainStore.useApi(`Rfq/rfq/${item.id}`, 'GET',{})
  if(typeof res != 'object')
  {
    toast.error(res)
    return;
  }
  detailItem.value = res.data
  detailItem.value.category = [detailItem.value.category]
  detailItem.value.orderDeadline = detailItem.value.orderDeadline.split('T')[0]
  detailItem.value.expectedArrival = detailItem.value.expectedArrival.split('T')[0]
  console.log(detailItem.value)
  isModalDetailActive.value = true
}
const openActionModal = (item)=>
{
  // parse the date to string with format yyyy-mm-dd
  const tempItem = item
  tempItem.orderDeadline = item.orderDeadline.split('T')[0]
  tempItem.expectedArrival = item.expectedArrival.split('T')[0]
  selectedItem.value = tempItem
  isModalActive.value = true
}
</script>

<template>
  <ViewRfq v-model="isModalDetailActive" :form="detailItem" />
  <CreateRfqBid v-model="isModalActive" :item-detail="selectedItem" />
  <CardBoxModal v-model="isModalDangerActive" title="Please confirm" button="danger" has-cancel>
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th>Company Name</th>
        <th>Title</th>
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
        <td data-label="Title">
          {{ item.title }}
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
        <BaseButton class="w-full" label="Pending" color="info" type="button"/>
        </td>
        <td class="before:hidden lg:w-1">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton 
            color="info" 
            :icon="mdiEye"  
            @click="openDetailModal(item)"
             />
            <BaseButton
              v-if="!props.isEditDisabled"
              color="success"
              :icon="mdiFileEdit"
              @click="openActionModal(item)"
            />
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
