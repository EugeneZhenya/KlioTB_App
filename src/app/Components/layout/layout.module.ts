import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UserComponent } from './Pages/user/user.component';
import { CategoryComponent } from './Pages/category/category.component';
import { ChannelComponent } from './Pages/channel/channel.component';
import { CountryComponent } from './Pages/country/country.component';
import { LanguageComponent } from './Pages/language/language.component';
import { PlaylistComponent } from './Pages/playlist/playlist.component';

import { SharedModule } from 'src/app/Reusable/shared/shared.module';
import { ModalUserComponent } from './Modals/modal-user/modal-user.component';
import { ModalCountryComponent } from './Modals/modal-country/modal-country.component';
import { ModalLanguageComponent } from './Modals/modal-language/modal-language.component';
import { ModalChannelComponent } from './Modals/modal-channel/modal-channel.component';
import { ModalStreamComponent } from './Modals/modal-stream/modal-stream.component';
import { StreamPreviewComponent } from './Modals/stream-preview/stream-preview.component';

@NgModule({
  declarations: [
    DashBoardComponent,
    UserComponent,
    CategoryComponent,
    ChannelComponent,
    CountryComponent,
    LanguageComponent,
    PlaylistComponent,
    ModalUserComponent,
    ModalCountryComponent,
    ModalLanguageComponent,
    ModalChannelComponent,
    ModalStreamComponent,
    StreamPreviewComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,

    SharedModule
  ]
})
export class LayoutModule { }
