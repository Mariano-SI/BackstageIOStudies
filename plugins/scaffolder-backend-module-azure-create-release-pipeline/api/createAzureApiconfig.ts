import axios from "axios";


function createAzureApiConfig(baseUrl: string) {
  return axios.create({
    baseURL: baseUrl, 
    headers: {
      'Authorization': `Basic ${Buffer.from(`:${process.env.AZURE_DEVOPS_PAT}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
  })
}

export default createAzureApiConfig;