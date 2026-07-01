import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopsComponent } from './shops.component';
import { DiscountQrComponent } from './tabs/discount-qr/discount-qr.component';
import { FranchiseComponent } from './tabs/franchise/franchise.component';
import { WholesaleRequestsComponent } from './tabs/wholesale-requests/wholesale-requests.component';
import { ReferenceComponent } from '../../common/components/reference/reference.component';
import { REFERENCES_CONFIG } from './tabs/configs/references-menu.config';
import { referenceConfig } from './tabs/configs/ReferenceConf';
import { ShopsManagementComponent } from './tabs/shops-management/shops-management.component';
import { StorePlanComponent } from './tabs/store-plan/store-plan.component';
import { SignatureComponent } from './tabs/signature/signature.component';
import { CollectionComponent } from './tabs/collection/collection.component';


const routes: Routes = [
    {
        path: '',
        component: ShopsComponent,
        children: [
            { path: 'franchise', component: FranchiseComponent },
            { path: 'wholesale-requests', component: WholesaleRequestsComponent },
            { path: 'discount-qr', component: DiscountQrComponent },
            { path: 'monthly-plans', component: StorePlanComponent },
            { path: 'management', component: ShopsManagementComponent },
            { path: 'collection', component: CollectionComponent },
            { path: 'signature/:id', component: SignatureComponent },
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
            { path: '', redirectTo: 'franchise', pathMatch: 'full' },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShopsComponentRoutingModule { }
