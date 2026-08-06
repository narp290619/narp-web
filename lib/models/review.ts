export interface ReviewReply {

    id: number;

    senderId: string;

    message: string;

    isDeleted: boolean;

    createdAt?: number | null;

    deletedAt?: number | null;

}

export interface Review {

    id: string;

    bookingId: string;

    freelancerId: string;

    clientId: string;

    skillId: string;

    rating: number;

    comment: string;

    autoReplied?: boolean;

    replies?: ReviewReply[];

    createdAt?: Date | null;

}