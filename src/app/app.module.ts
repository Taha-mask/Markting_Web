import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
@NgModule({
  imports: [
    BrowserModule, // Required for running Angular in the browser
    NavbarComponent // Import your standalone NavbarComponent
  ],
  declarations: [
    AppComponent // Declare the AppComponent (root component)
  ],
  bootstrap: [AppComponent] // Bootstrap the root component
})
export class AppModule {}
