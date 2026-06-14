import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsTestComponent } from './results-test.component';

const routes: Routes = [
    {
        path: '',
        component: ResultsTestComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ResultsTestRoutingModule { }
