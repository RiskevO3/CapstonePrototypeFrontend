<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk, mdiOfficeBuilding } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useMainStore } from '@/stores/main'
import toast from '@/composables/toast'

const mainStore = useMainStore()
const form = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  companyId: 0,
})

const router = useRouter()
const companyList = ref([])
const submit = async () => {
  form.companyId = parseInt(form.companyId.id)
  if(form.email == '' || form.password == '' || form.firstName == '' || form.lastName == '' || form.companyId == 0) {
    toast.error('Please fill all fields')
    return
  }
  const loginRes = await mainStore.registerHandler(form)
  if (loginRes == '') {
    toast.success('Login success!')
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
    return
  }
  toast.error(loginRes)
  return
}

onMounted(async () => {
  const res = await mainStore.useApi('Auth/company', 'GET', {})
  if (typeof res == 'string') {
    toast.error(res)
    return
  }
  form.companyId = res.data[0].id
  companyList.value = res.data
})
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Email" help="Please enter your Email">
          <FormControl v-model="form.email" :icon="mdiAccount" type="email" name="Register" />
        </FormField>
        <FormField label="First Name" help="Please enter your First Name">
          <FormControl v-model="form.firstName" :icon="mdiAccount" name="First Name" />
        </FormField>
        <FormField label="Last Name" help="Please enter your Last Name">
          <FormControl v-model="form.lastName" :icon="mdiAccount" name="Last Name" />
        </FormField>
        <FormField label="Company" help="Please select your company">
          <FormControl
            v-model="form.companyId"
            :icon="mdiOfficeBuilding"
            type="select"
            name="Company"
            :options="companyList"
          />
        </FormField>
        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Register" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
