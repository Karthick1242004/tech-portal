// Frontend TypeScript types for Report Job feature

export interface Equipment {
    id: string;
    description: string;
    status?: number;
    context?: number;
}

export interface ProcessFunction {
    id: string;
    description: string;
    status?: number;
    context?: number;
}

export interface WorkOrderType {
    id: string;
    description: string;
    status?: number;
    context?: number;
}

export interface ReportJobPayload {
    description: string;
    reporterText: string;
    context?: string;
    equipmentId: string;
    processFunctionId: string;
    workOrderTypeId: string;
    siteId?: string;
    specId?: string;
    reportDate: string; // ISO 8601 format
    imageFile1?: string;
    imageFile2?: string;
    imageFile3?: string;
    imageFile4?: string;
    imageFile5?: string;
    imageFile6?: string;
    imageFileBase64_1?: string;
    imageFileBase64_2?: string;
    imageFileBase64_3?: string;
    imageFileBase64_4?: string;
    imageFileBase64_5?: string;
    imageFileBase64_6?: string;
    imageFileName1?: string;
    imageFileName2?: string;
    imageFileName3?: string;
    imageFileName4?: string;
    imageFileName5?: string;
    imageFileName6?: string;
}

export interface ReportJobResponse {
    message?: string;
    successStatus?: string;
    jobId?: string;
}
