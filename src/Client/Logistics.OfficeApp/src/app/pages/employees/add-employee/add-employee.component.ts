import {Component, OnInit, inject} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {SelectModule} from "primeng/select";
import {ToastModule} from "primeng/toast";
import {ApiService} from "@/core/api";
import {
  CreateEmployeeCommand,
  RoleDto,
  SalaryType,
  UserDto,
  salaryTypeOptions,
} from "@/core/api/models";
import {ToastService} from "@/core/services";
import {ValidationSummary} from "@/shared/components";
import {UserService} from "../services";

@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrl: "./add-employee.component.css",
  imports: [
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    ProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    SelectModule,
    ButtonModule,
    RouterLink,
    ValidationSummary,
  ],
  providers: [UserService],
})
export class AddEmployeeComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);

  public suggestedUsers: UserDto[] = [];
  public form: FormGroup<CreateEmployeeForm>;
  public roles: RoleDto[] = [];
  public salaryTypes = salaryTypeOptions;
  public isLoading = false;

  constructor() {
    this.form = new FormGroup<CreateEmployeeForm>({
      user: new FormControl(null, {validators: Validators.required}),
      role: new FormControl(null),
      salary: new FormControl<number>(0, {validators: Validators.required, nonNullable: true}),
      salaryType: new FormControl<SalaryType>(SalaryType.None, {
        validators: Validators.required,
        nonNullable: true,
      }),
    });
  }

  ngOnInit(): void {
    this.fetchRoles();
  }

  searchUser(event: {query: string}) {
    this.userService.searchUser(event.query).subscribe((users) => {
      if (users) {
        this.suggestedUsers = users;
      }
    });
  }

  clearSelctedRole() {
    this.form.patchValue({
      role: null,
    });
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    const user = this.form.value.user as UserDto;

    if (!user) {
      this.toastService.showError("Select user");
      return;
    }

    const newEmployee: CreateEmployeeCommand = {
      userId: user.id,
      role: this.form.value.role?.name,
      salary: this.form.value.salary ?? 0,
      salaryType: this.form.value.salaryType ?? SalaryType.None,
    };

    this.isLoading = true;
    this.apiService.createEmployee(newEmployee).subscribe((result) => {
      if (result.success) {
        this.toastService.showSuccess("New employee has been added successfully");
        this.form.reset();
      }

      this.isLoading = false;
    });
  }

  isShareOfGrossSalary() {
    return this.form.value.salaryType === SalaryType.ShareOfGross;
  }

  isNoneSalary() {
    return this.form.value.salaryType === SalaryType.None;
  }

  private fetchRoles() {
    this.isLoading = true;

    this.userService.fetchRoles().subscribe((roles) => {
      if (roles) {
        this.roles = roles;
      }

      this.isLoading = false;
    });
  }
}

interface CreateEmployeeForm {
  user: FormControl<UserDto | null>;
  role: FormControl<RoleDto | null>;
  salary: FormControl<number>;
  salaryType: FormControl<SalaryType>;
}
