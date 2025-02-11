import { ConflictError } from "@backstage/errors";
import { ApplicationItem, ApplicationService } from "./types";

export async function createApplicationService(): Promise<ApplicationService> {
    const storedApplications = new Array<ApplicationItem>(
        {
            ApplicationName: "Aplicação Mariano - Node",
            Technology: "Node"
        },
        {
            ApplicationName: "Aplicação Mariano - Go",
            Technology: "Go"
        }
    );
    
    return{
        async listApplications(){
            return storedApplications;
        },

        async createApplication(input){
            const {ApplicationName, Technology} = input;
            const existingApplication = storedApplications.find(
                app => app.ApplicationName.toLowerCase() === ApplicationName.toLowerCase()
            );

            if(existingApplication){
                throw new ConflictError(`Application with name ${ApplicationName} already exists`);
            }

            storedApplications.push({ApplicationName, Technology});
            return {ApplicationName, Technology};
        }
    }
}