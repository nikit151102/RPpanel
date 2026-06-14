import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from './truncate.pipe';
import { JobOpeningService } from './job-opening.service';


interface JobOpening {
  id: string;
  title: string;
  salary_from: number;
  salary_to: number;
  description: string;
  category: string;
  additional_sections: AdditionalSection[];
}

interface AdditionalSection {
  title: string;
  content: string;
}

@Component({
  selector: 'app-vacancies-jobs',
  imports: [CommonModule, FormsModule, TruncatePipe],
  templateUrl: './vacancies-jobs.component.html',
  styleUrls: ['./vacancies-jobs.component.scss']
})
export class VacanciesJobsComponent implements OnInit {
  jobOpenings: JobOpening[] = [];
  selectedJobOpening: JobOpening | null = null;
  newJobOpening: JobOpening = { 
    id: '', 
    title: '', 
    salary_from: 0, 
    salary_to: 0, 
    description: '', 
    category: '', 
    additional_sections: [] 
  };
  
  isDialogVisible: boolean = false;
  isEditMode: boolean = false;
  
  categories: any[] = [
    { name: 'Офис', code: 'Офис' },
    { name: 'Склад', code: 'Склад' },
    { name: 'Магазин', code: 'Магазин' }
  ];

  constructor(
    private jobOpeningService: JobOpeningService
  ) { }

  ngOnInit(): void {
    this.loadJobOpenings();
  }

  loadJobOpenings(): void {
    this.jobOpeningService.getJobOpenings().subscribe(
      (data) => {
        this.jobOpenings = data;
      },
      (error) => {
        this.showNotification('Ошибка загрузки вакансий', 'error');
      }
    );
  }

  openNewJobOpeningDialog(): void {
    this.isEditMode = false;
    this.newJobOpening = { 
      id: '', 
      title: '', 
      salary_from: 0, 
      salary_to: 0, 
      category: "", 
      description: '', 
      additional_sections: [] 
    };
    this.isDialogVisible = true;
  }

  openDialog(job: JobOpening): void {
    this.isEditMode = true;
    this.selectedJobOpening = { ...job };
    this.newJobOpening = { ...this.selectedJobOpening };
    this.isDialogVisible = true;
  }

  closeDialog(): void {
    this.isDialogVisible = false;
    this.selectedJobOpening = null;
  }

  isFormValid(): boolean {
    return !!this.newJobOpening.title && 
           !!this.newJobOpening.category && 
           this.newJobOpening.salary_from > 0 && 
           this.newJobOpening.salary_to > 0 && 
           !!this.newJobOpening.description;
  }

  saveJobOpening(): void {
    if (!this.isFormValid()) {
      this.showNotification('Заполните все обязательные поля', 'error');
      return;
    }

    if (this.isEditMode) {
      const formattedSections = this.newJobOpening.additional_sections.map(section => {
        section.content = section.content.replace(/\n/g, '<br>');
        return section;
      });

      const jobOpeningToSend = {
        job_opening_data: {
          title: this.newJobOpening.title,
          salary_from: this.newJobOpening.salary_from,
          salary_to: this.newJobOpening.salary_to,
          category: this.newJobOpening.category,
          description: this.newJobOpening.description,
          additional_sections: []
        },
        sections_data: formattedSections
      };

      this.jobOpeningService.updateJobOpening(this.selectedJobOpening!.id, jobOpeningToSend).subscribe(
        (data) => {
          this.loadJobOpenings();
          this.showNotification('Вакансия успешно обновлена', 'success');
          this.closeDialog();
        },
        (error) => {
          this.showNotification('Ошибка обновления вакансии', 'error');
        }
      );

    } else {
      this.newJobOpening.additional_sections = this.newJobOpening.additional_sections.map(section => {
        section.content = section.content.replace(/\n/g, '<br>');
        return section;
      });

      const jobOpeningToSend = { ...this.newJobOpening };
      jobOpeningToSend.category = this.newJobOpening.category;

      this.jobOpeningService.createJobOpening(jobOpeningToSend).subscribe(
        (data) => {
          this.loadJobOpenings();
          this.showNotification('Вакансия успешно создана', 'success');
          this.closeDialog();
        },
        (error) => {
          this.showNotification('Ошибка создания вакансии', 'error');
        }
      );
    }
  }

  addAdditionalSection(): void {
    this.newJobOpening.additional_sections.push({ title: '', content: '' });
  }

  removeAdditionalSection(index: number): void {
    this.newJobOpening.additional_sections.splice(index, 1);
  }

  deleteJobOpening(id: string): void {
    if (confirm('Вы уверены, что хотите удалить эту вакансию?')) {
      this.jobOpeningService.deleteJobOpening(id).subscribe(
        (data) => {
          this.jobOpenings = this.jobOpenings.filter((job) => job.id !== id);
          this.showNotification('Вакансия успешно удалена', 'success');
        },
        (error) => {
          this.showNotification('Ошибка удаления вакансии', 'error');
        }
      );
    }
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success') {
    // Можно реализовать кастомные уведомления
    if (type === 'success') {
      alert(`✅ ${message}`);
    } else {
      alert(`❌ ${message}`);
    }
  }
}