import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
    {
        path: '', component: AuthComponent
    },
    {
        path: 'resultsTest/:id', loadChildren: () => import('./results-test/results-test.module').then(m => m.ResultsTestModule),
    },
    {
        path: 'profile', loadChildren: () => import('./pages/profile/profile-router-module').then(m => m.ProfileRoutingModule),
    }
];
