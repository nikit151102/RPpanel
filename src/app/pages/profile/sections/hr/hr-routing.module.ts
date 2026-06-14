import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HrComponent } from './hr.component';
import { ResumesJobsComponent } from './tabs/resumes-jobs/resumes-jobs.component';
import { VacanciesJobsComponent } from './tabs/vacancies-jobs/vacancies-jobs.component';
import { FeedbackComponent } from './tabs/feedback/feedback.component';
import { TelegramBotHHComponent } from './tabs/telegram-bot-hh/telegram-bot-hh.component';


const routes: Routes = [
    {
        path: '',
        component: HrComponent,
        children: [
            { path: 'telegramBot', component: TelegramBotHHComponent },
            { path: 'vacancies', component: VacanciesJobsComponent },
            { path: 'resumes', component: ResumesJobsComponent },
            { path: 'feedback', component: FeedbackComponent },
            // { path: '', redirectTo: 'drivers', pathMatch: 'full' },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HrComponentRoutingModule { }
