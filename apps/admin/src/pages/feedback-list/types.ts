export type FeedbackListPageProps = {
    user: {
        role: string;
        firstName: string;
        lastName: string | null | undefined;
        middleName: string | null | undefined;
        phone: string | null | undefined;
        social: string | null | undefined;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
        banned: boolean | null | undefined;
        banReason?: string | null | undefined;
        banExpires?: Date | null | undefined;
    } | undefined
}

export type ProjectRecord = {
    id: number;
    title: string;
    latitude: number;
    longitude: number;
    year_of_completion: number;
    administrative_unit_id: number;
    created_at: string;
    administrative_unit: string;
    administrative_unit_type: string;
};
