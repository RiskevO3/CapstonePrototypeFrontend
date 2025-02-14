import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export const useMainStore = defineStore('main', () => {
  const baseApiUrl = 'http://localhost:5173/api'
  const userName = ref('')
  const userEmail = ref('')
  const accessToken = ref('')
  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  )

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const history = ref([])

  const loginHandler = async (email, password) => {
    try {
      const req = await axios.post(`${baseApiUrl}/Auth/login`, { email, password })
      if (req.status == 200) {
        console.log(req)
        localStorage.setItem('accessToken', req.data.data.accessToken)
        await isLoggedIn()
        return ''
      }
    } catch (error) {
      console.log('error', error)
      return error.response.data.message ?? 'An error occurred'
    }
  }

  const registerHandler = async (registerForm)=>
  {
    try
    {
      const req = await axios.post(`${baseApiUrl}/Auth/register`, {...registerForm})
      if(req.status == 200)
      {
        localStorage.setItem('accessToken', req.data.data.accessToken)
        await isLoggedIn()
        return ''
      }
      return req.data.message ?? 'An error occurred'
    }
    catch(error)
    {
      console.log('error', error)
      return error.response.data.message ?? 'An error occurred'
    }
  }

  const isLoggedIn = async () => {
    let accessTokenStorage = localStorage.getItem('accessToken')
    if (accessTokenStorage) {
      const decodedJwt = jwtDecode(accessTokenStorage)
      if (Date.now() >= decodedJwt.exp * 1000) {
        console.log('Token expired')
        localStorage.removeItem('accessToken')
        return false
      }
      userName.value = decodedJwt.firstName
      userEmail.value = decodedJwt.email
      console.log('decodedJwt', decodedJwt)
      accessToken.value = accessTokenStorage
      return true
    }
    console.log('No token found')
    return false
  }

  const setAccessToken = (token) => {
    accessToken.value = token
    localStorage.setItem('accessToken', token)
  }

  const removeAccessToken = () => {
    accessToken.value = ''
    localStorage.removeItem('accessToken')
  }

  const useApi = async (path, method, data) => {
    try {
      const config = {
        method: method,
        url: `${baseApiUrl}/${path}`,
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      }
      console.log("config", config)

      if (method.toUpperCase() === 'GET' && data) {
        config.params = data
      } else if (data) {
        config.data = data
      }

      const req = await axios(config)

      if (req.status === 200) {
        return req.data
      }
    } catch (error) {
      console.log('error', error)
      return error.response?.data?.message ?? 'An error occurred'
    }
  }

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    accessToken,
    loginHandler,
    setUser,
    fetchSampleClients,
    fetchSampleHistory,
    isLoggedIn,
    setAccessToken,
    removeAccessToken,
    useApi,
    registerHandler
  }
})
