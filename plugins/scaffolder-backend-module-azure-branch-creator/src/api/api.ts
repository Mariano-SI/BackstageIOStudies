import axios from "axios";

const api = axios.create({
  baseURL: 'https://dev.azure.com', 
  headers: {
    'Authorization': `Basic ${Buffer.from(`:${process.env.AZURE_DEVOPS_PAT}`).toString('base64')}`,
    'Content-Type': 'application/json',
  },
});
export default api;