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
    pageSize: number;
}

export interface MessageState {
    paginatedMessages: PaginatedMessageSummary | null;
    loading: boolean;
    error: string | null;
    selectedMessage: Message | null;
}

const initialPaginatedMessagesState: PaginatedMessageSummary = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    pageSize: 3
}
export const initialMessageState: MessageState = {
    paginatedMessages: initialPaginatedMessagesState,
    loading: false,
    error: null,
    selectedMessage: null
}
