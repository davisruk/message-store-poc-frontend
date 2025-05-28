import { ColumnField } from "./column-fields";

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
    formatUrl: string;
    formattedPayload: string;
}

export type SortDirection = 'asc' | 'desc';

export interface ColumnState {
    filter: string;
    sortDirection?: SortDirection;
    sortOrder?: number;
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
    selectedMessages: Message[];
    query: string;
    includePayload: boolean;
    columnSearch: Record<string, ColumnState>;
}

const initialPaginatedMessagesState: PaginatedMessageSummary = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    pageSize: 3
}

const initialColumnState: Record<ColumnField, ColumnState> = 
    Object.values(ColumnField).reduce((acc, field) => {
        acc[field] = { filter: '' };
        return acc;
    }, {} as Record<ColumnField, ColumnState>);


export const initialMessageState: MessageState = {
    paginatedMessages: initialPaginatedMessagesState,
    loading: false,
    error: null,
    selectedMessages: [],
    query: '',
    includePayload: false,
    columnSearch: initialColumnState,
}
