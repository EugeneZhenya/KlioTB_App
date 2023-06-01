import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { CategoryComponent } from './Pages/category/category.component';
import { ChannelComponent } from './Pages/channel/channel.component';
import { CountryComponent } from './Pages/country/country.component';
import { LanguageComponent } from './Pages/language/language.component';
import { PlaylistComponent } from './Pages/playlist/playlist.component';
import { UserComponent } from './Pages/user/user.component';

const routes: Routes = [{
  path: '', component: LayoutComponent,
  children: [
    { path: 'dashboard', component: DashBoardComponent },
    { path: 'users', component: UserComponent },
    { path: 'categories', component: CategoryComponent },
    { path: 'channels', component: ChannelComponent },
    { path: 'countries', component: CountryComponent },
    { path: 'languages', component: LanguageComponent },
    { path: 'playlists', component: PlaylistComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
