import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.30.193:8000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout")
    }
    return Promise.reject(error)
  },
)

export const fetchItems = async (params = {}) => {
  try {
    console.log("Fetching items with params:", params)
    const response = await api.get("/items/", { params })
    console.log("API Response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error fetching items:", error)
    throw error
  }
}

export const fetchItemDetail = async (id) => {
  try {
    const response = await api.get(`/items/${id}/`)
    return response.data
  } catch (error) {
    console.error("Error fetching item detail:", error)
    throw error
  }
}

export const fetchTipos = async () => {
  try {
    const response = await api.get("/tipos/")
    return response.data
  } catch (error) {
    console.error("Error fetching tipos:", error)
    throw error
  }
}

export const fetchUltimos = async () => {
  try {
    const response = await api.get("/ultimos/")
    return response.data
  } catch (error) {
    console.error("Error fetching ultimos:", error)
    throw error
  }
}

export const fetchEstadisticas = async () => {
  try {
    const response = await api.get("/estadisticas/")
    return response.data
  } catch (error) {
    console.error("Error fetching estadisticas:", error)
    throw error
  }
}

export const fetchItemsPorFechaHora = async (fecha, hora, variable = null) => {
  try {
    const params = { fecha, hora }
    if (variable) params.variable = variable

    const response = await api.get("/items/fecha-hora/", { params })
    return response.data
  } catch (error) {
    console.error("Error fetching items por fecha/hora:", error)
    throw error
  }
}

export const fetchImagenDinamica = async ({ proyecto, fecha, hora, variable, offset }) => {
  try {
    const params = { proyecto, fecha, hora, variable, offset }
    const response = await api.get("/imagen-dinamica/", { params })
    return response.data.url
  } catch (error) {
    console.error("Error fetching imagen dinamica:", error)
    throw error
  }
}

export default api
