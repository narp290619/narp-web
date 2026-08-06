export interface ChatMessage {

    id: string;

    senderId: string;

    receiverId: string;

    senderName?: string;

    message?: string;

    imageUrl?: string;

    audioUrl?: string;

    readStatus?: string;

    timestamp?: any;

}