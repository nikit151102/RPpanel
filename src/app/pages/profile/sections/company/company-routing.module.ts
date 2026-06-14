import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';
import { UsersManagementComponent } from './tabs/users-management/users-management.component';
import { RolesManagementComponent } from './tabs/roles-management/roles-management.component';
import { VacationManagementComponent } from './tabs/vacations/vacations.component';


const routes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        children: [
            { path: 'users', component: UsersManagementComponent },
            { path: 'access', component: RolesManagementComponent },
            { path: 'vacations', component: VacationManagementComponent },
            // { path: 'directories', component: DirectoriesComponent },
            // { path: '', redirectTo: 'drivers', pathMatch: 'full' },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }
