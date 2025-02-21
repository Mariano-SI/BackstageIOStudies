import axios from "axios";

const azureVSRMApi = axios.create({
    baseURL: process.env.AZURE_DEVOPS_VSRM_API_BASE_URL,
    headers: {
        'Authorization': `Basic ${Buffer.from(`:${process.env.AZURE_DEVOPS_PAT}`).toString('base64')}`,
        'Content-Type': 'application/json',
    },
})

export default azureVSRMApi;