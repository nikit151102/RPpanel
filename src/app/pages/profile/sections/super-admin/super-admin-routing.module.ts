import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';


const routes: Routes = [
    {
        path: '',
        component: SuperAdminComponent,
        children: [
            // { path: 'drivers', component: DriversComponent },
            // { path: 'routes', component: RoutesComponent },
            // { path: 'directories', component: DirectoriesComponent },
            // { path: '', redirectTo: 'drivers', pathMatch: 'full' },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
