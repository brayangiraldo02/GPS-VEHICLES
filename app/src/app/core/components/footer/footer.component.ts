import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  logoURL =
    'https://media.licdn.com/dms/image/C4E0BAQFN9RPjAJAIdA/company-logo_200_200/0/1631324563752?e=2147483647&v=beta&t=wArf89ExUKjZh0xk-BOPfnLhlvSw5F-fHyf4wC8uK4Y';
  currentYear = new Date().getFullYear();
}
