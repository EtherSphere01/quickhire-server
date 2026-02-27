export type JobQueryParams = {
    search?: string;
    location?: string;
    category?: string;
};

export type CreateJobPayload = {
    title: string;
    company: string;
    location: string;
    category: string;
    job_type?:
        | "FULL_TIME"
        | "PART_TIME"
        | "CONTRACT"
        | "INTERNSHIP"
        | "FREELANCE";
    salary?: number;
    description: string;
    company_logo?: string;
};

export type UpdateJobPayload = Partial<CreateJobPayload>;
