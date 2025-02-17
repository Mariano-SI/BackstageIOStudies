import axios from "axios";

const api = axios.create({
  baseURL: process.env.AZURE_DEVOPS_API_BASE_URL, 
  headers: {
    'Authorization': `Basic ${Buffer.from(`:${process.env.AZURE_DEVOPS_PAT}`).toString('base64')}`,
    'Content-Type': 'application/json',
  },
});
export default api;