import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriversComponent } from './tabs/drivers/drivers.component';
import { RoutesComponent } from './tabs/routes/routes.component';
import { DirectoriesComponent } from './tabs/directories/directories.component';
import { DriverComponent } from './driver.component';
import { LogisticsReportComponent } from './tabs/logistics-report/logistics-report.component';
import { ReferenceComponent } from '../../common/components/reference/reference.component';
import { referenceConfig } from './configs/ReferenceConf';
import { REFERENCES_CONFIG } from './configs/references-menu.config';
import { MapComponent } from './tabs/map/map.component';

const routes: Routes = [
    {
        path: '',
        component: DriverComponent,
        children: [
            { path: 'drivers', component: DriversComponent },
            { path: 'routes', component: RoutesComponent },
            { path: 'map', component: MapComponent },
            {
                path: 'directories', component: ReferenceComponent, data: {
                    config: {
                        references_menu: REFERENCES_CONFIG,
                        config: referenceConfig,
                        permissions: ['view_directories'],
                        defaultReference: '030521'
                    }
                }
            },
            { path: 'cityDriversReport', component: LogisticsReportComponent },

            { path: '', redirectTo: 'drivers', pathMatch: 'full' },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DriverComponentRoutingModule { }
