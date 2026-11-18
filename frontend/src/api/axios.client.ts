import axios from "axios"


export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://rutalimpia-api-camilo-hfh7c6bxbcfue8f6.eastus2-01.azurewebsites.net'
})

axiosClient.interceptors.request.use(
  (config) => {
    const storageData = localStorage.getItem('auth-storage')
    if (storageData) {
      try {
        const parsed = JSON.parse(storageData)
        const token = parsed?.state?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (err) {
        console.error('Error al leer el token de autenticación:', err)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)