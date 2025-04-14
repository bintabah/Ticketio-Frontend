import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TopBarComponent } from './components/layout/top-bar/top-bar.component';
import { SideBarComponent } from './components/layout/side-bar/side-bar.component';
import { MainContentComponent } from './components/layout/main-content/main-content.component';
import { FooterComponent } from './components/layout/footer/footer.component';

@NgModule({
    imports: [
        BrowserModule,
        AppComponent,
        TopBarComponent,
        SideBarComponent,
        MainContentComponent,
        FooterComponent
    ],
    providers: []
})
export class AppModule { } 