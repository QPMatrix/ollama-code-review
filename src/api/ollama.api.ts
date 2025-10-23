import { OllamaModel, OllamaModelSchema } from "@/schemas";
import axios, { AxiosInstance } from "axios";

export class OllamaAPI{
    private baseUrl:string
    private axiosInstance: AxiosInstance
    constructor(baseUrl:string = 'http://localhost:11434'){
        this.baseUrl = baseUrl
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
        })
    }

      setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  async getModels():Promise<OllamaModel[]>{
    try {
        const response = await this.axiosInstance.get<{models:OllamaModel[]}>('/api/tags')
        if(response.data){
            return response.data.models.map((model)=> OllamaModelSchema.parse(model))
        }
        throw new Error(`Failed to fetch models`)
    } catch (error) {
        console.error(`Error fetching Ollama models:`,error)
        throw error
        
    }
  }
}