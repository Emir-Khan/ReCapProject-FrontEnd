import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users:User[]
  page:number = 1
  dataLoaded:boolean = false
  
  constructor(
    private userService:UserService
  ) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.userService.getUsers().subscribe(response=>{
      this.users=response.data
      this.dataLoaded=true
    })
  }

  handlePageChange(event: number) {
    this.page = event;
  }
}
