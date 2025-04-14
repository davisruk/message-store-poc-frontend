import { Routes } from '@angular/router';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { MessageListPageComponent } from './message-list-page/message-list-page.component';


export const MESSAGE_DETAIL_PATH = 'message-detail';
export const APP_PATH = '';
export const MESSAGE_LIST_PAGE_PATH = 'message-list-page';

export const routes: Routes = [
    {path:APP_PATH, redirectTo: MESSAGE_LIST_PAGE_PATH, pathMatch: 'full'},
    {path:MESSAGE_DETAIL_PATH, component: MessageDetailComponent},
    {path: MESSAGE_LIST_PAGE_PATH, component: MessageListPageComponent},
];
