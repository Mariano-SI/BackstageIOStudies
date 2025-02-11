export interface ApplicationItem {
    ApplicationName: string;
    Technology: string;
};

export interface ApplicationService {
    listApplications(): Promise<ApplicationItem[]>;
    createApplication(input: ApplicationItem): Promise<ApplicationItem>;
}