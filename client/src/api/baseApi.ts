import axios from 'axios'
import { LocalStorageKey } from '../enums'

export default axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    Authorization: `bearer ${localStorage.getItem(LocalStorageKey.AccessToken)}`,
  },
})
