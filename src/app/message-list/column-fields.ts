export enum ColumnField {
    ID = 'messageId',
    SOURCE = 'sourceSystem',
    DESTINATION = 'destinationAddress',
    CORRELATION = 'correlationId',
    MESSAGE_RENDER_TECHNOLOGY = 'messageRenderTechnology',
}

export const HandsetColumns = [ColumnField.ID, ColumnField.SOURCE, ColumnField.CORRELATION];
export const TabletColumns = [ColumnField.ID, ColumnField.SOURCE, ColumnField.DESTINATION, ColumnField.CORRELATION];
export const DesktopColumns = [ColumnField.ID, ColumnField.SOURCE, ColumnField.DESTINATION, ColumnField.CORRELATION, ColumnField.MESSAGE_RENDER_TECHNOLOGY];