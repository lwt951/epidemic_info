import axios from "axios"
export async function getData(path) {
  const result = await axios.get(path)
  if (result.status === 200) {
      return result.data
  }
  return false
}