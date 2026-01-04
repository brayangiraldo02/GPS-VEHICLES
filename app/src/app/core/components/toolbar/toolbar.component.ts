import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  logoURL =
    'https://media.licdn.com/dms/image/C4E0BAQFN9RPjAJAIdA/company-logo_200_200/0/1631324563752?e=2147483647&v=beta&t=wArf89ExUKjZh0xk-BOPfnLhlvSw5F-fHyf4wC8uK4Y';
}
