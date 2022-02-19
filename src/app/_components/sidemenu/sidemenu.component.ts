import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

  menuType: string = 'dashboard';

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (localStorage.hasOwnProperty('selectedMenu')) {
      this.menuType = localStorage.getItem('selectedMenu');
    }
  }

  onLogout() {
    localStorage.clear();
    window.location.reload();
  }

  onClickLeftMenu(menyType: string) {
    this.menuType = menyType;
    localStorage.setItem('selectedMenu', menyType);
    this.router.navigate([menyType]);
  }

}
