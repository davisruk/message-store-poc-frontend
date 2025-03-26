export interface MessageSummary {
    id: string;
    sourceSystem: string;
    destinationAddress: string;
    messageId: string;
    correlationId: string;
    messageRenderTechnology: string;
}

export interface Message extends MessageSummary {
    payload: string;
}

export interface PaginatedMessageSummary {
    content: MessageSummary[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
}

export interface MessageState {
    paginatedMessages: PaginatedMessageSummary | null;
    loading: boolean;
    error: string | null;
}

export const initialMessageState: MessageState = {
    paginatedMessages: null,
    loading: false,
    error: null
}
