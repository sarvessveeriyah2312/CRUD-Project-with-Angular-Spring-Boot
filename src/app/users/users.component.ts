import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

export class Users {
  constructor(
    public id: number,
    public name: string,
    public email: string
  ) {}
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Users[] = [];
  closeResult!: string;
  newUser: Users = new Users(0, '', '');
  selectedUser: Users = new Users(0, '', '');
  @ViewChild('f') userForm!: NgForm;
  currentPage = 1;
  itemsPerPage = 5;
  searchTerm = '';

  constructor(private httpClient: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.httpClient.get<Users[]>('http://localhost:8080/api/users').subscribe(
      response => {
        console.log(response);
        this.users = response;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  get filteredUsers(): Users[] {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get pages(): number[] {
    const pageCount = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.pages.length) {
      this.currentPage = page;
    }
  }

  get paginatedUsers(): Users[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8080/api/users';
    this.httpClient.post(url, f.value)
      .subscribe(() => {
        this.getUsers();
        Swal.fire('Success', 'User added successfully!', 'success');
      });
    this.modalService.dismissAll();
  }

  openDetails(targetModal: any, user: Users) {
    if (targetModal) {
      this.modalService.open(targetModal, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      });

      // Assuming you have input elements with id 'name' and 'email' in your modal
      const nameElement = document.getElementById('name') as HTMLInputElement;
      const emailElement = document.getElementById('email') as HTMLInputElement;

      if (nameElement) {
        nameElement.value = user.name;
      }

      if (emailElement) {
        emailElement.value = user.email;
      }
    }
  }

  openEdit(contentEdit: any, user: Users) {
    if (contentEdit) {
      this.selectedUser = { ...user };
      this.modalService.open(contentEdit, {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      });

      const nameControl = this.userForm.controls['updateName'];
      const emailControl = this.userForm.controls['updateEmail'];

      if (nameControl) {
        nameControl.setValue(user.name);
      }

      if (emailControl) {
        emailControl.setValue(user.email);
      }
    }
  }

  onUpdateSubmit(f: NgForm) {
    const url = `http://localhost:8080/api/users/${this.selectedUser.id}`;
    const updatedUser = {
      name: f.value.updateName,
      email: f.value.updateEmail
    };
  
    this.httpClient.put(url, updatedUser).subscribe(
      () => {
        console.log('User updated successfully');
        this.getUsers();
        Swal.fire('Success', 'User updated successfully!', 'success');
      },
      (error) => {
        console.error('Error updating user:', error);
        Swal.fire('Error', 'Failed to update user', 'error');
      }
    );
  
    this.modalService.dismissAll();
  }
  

  deleteUser(userId: number) {
    // Use SweetAlert2 for confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpClient.delete(`http://localhost:8080/api/users/${userId}`).subscribe(() => {
          this.getUsers();
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        });
      }
    });
  }
}
