import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ResumesService } from './resumes.service';
import { environment } from '../../../../../../../evirement';

export interface Resume {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  socials: string;
  goal: string;
  skills: string;
  additionalInfo: string;
  education: Education[];
  workExperience: WorkExperience[];
}

export interface Education {
  school: string;
  specialty: string;
  city: string;
  startYear: string;
  endYear: string;
}

export interface WorkExperience {
  company: string;
  workCity: string;
  workStartYear: string;
  workEndYear: string;
  responsibilities: string;
}


@Component({
  selector: 'app-resumes-jobs',
imports: [CommonModule,  FormsModule, ReactiveFormsModule,],
  templateUrl: './resumes-jobs.component.html',
  styleUrl: './resumes-jobs.component.scss'
})
export class ResumesJobsComponent implements OnInit {
  resumes: any[] = [];
  filterResume: any[] = [];

  resumeForm!: FormGroup;
  displayDialog: boolean = false;
  selectedResume: any | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private resumesService:ResumesService
  ) { }

  selectedCategories: any[] = [];

  statuses = [
    { name: 'Первичный контакт', code: 'initial_contact' },
    { name: 'Подумать', code: 'thinking' },
    { name: 'Тестовое задание', code: 'test_task' },
    { name: 'Собеседование', code: 'interview' },
    { name: 'Повторное собеседование с руководителем', code: 'second_interview' },
    { name: 'Одобрен руководителем', code: 'approved_by_manager' },
    { name: 'Направлен на стажировку', code: 'internship' },
    { name: 'Предложение о работе', code: 'job_offer' },
    { name: 'Не подходит', code: 'not_suitable' },
    { name: 'Кандидат отказался', code: 'candidate_refused' },
    { name: 'Не выходит на связь', code: 'no_contact' },
    { name: 'Резерв', code: 'reserve' }
  ];

  selectedStatus: string = '';
  dropdownOpen: boolean = false;

  dropdownStates: { [key: string]: boolean } = {};
  selectedStatuses: { [key: string]: string } = {};

  currentPage: number = 1;
  rowsPerPage: number = 5;
  totalPages: number = 1;
  multiselectOpen: boolean = false;

  get paginatedResumes() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filterResume.slice(start, end);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filterResume.length / this.rowsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Методы для мультиселекта
  toggleMultiselect() {
    this.multiselectOpen = !this.multiselectOpen;
  }

  onCategoryChange(statusCode: string, event: any) {
    if (event.target.checked) {
      this.selectedCategories.push(statusCode);
    } else {
      this.selectedCategories = this.selectedCategories.filter(code => code !== statusCode);
    }
    this.filterResumes();
  }

  // Обновляем filterResumes для использования с пагинацией
  filterResumes() {
    if (this.selectedCategories.length > 0) {
      this.filterResume = this.resumes.filter(resume =>
        this.selectedCategories.includes(resume.status)
      );
    } else {
      this.filterResume = this.resumes;
    }
    this.updatePagination();
  }

  // Закрытие диалога
  closeDialog() {
    this.displayDialog = false;
  }

  toggleDropdown(resumeId: string) {
    Object.keys(this.dropdownStates).forEach(id => {
      if (id !== resumeId) {
        this.dropdownStates[id] = false;
      }
    });
    this.dropdownStates[resumeId] = !this.dropdownStates[resumeId];
  }

  selectStatus(resume: any, status: any) {

    if(resume.full_name){
      this.resumesService.setResumeStatus(resume.id, status.code).subscribe((value: any) =>{
        this.selectedStatuses[resume.id] = status.name;
        this.dropdownStates[resume.id] = false; 
      })
    }else if(resume.fio){
      this.resumesService.setResumeWithFileStatus(resume.id, status.code).subscribe((value: any) =>{
        this.selectedStatuses[resume.id] = status.name;
        this.dropdownStates[resume.id] = false; 
      })
    }
  }


  ngOnInit(): void {
    this.getResumes();

    this.resumeForm = this.fb.group({
      full_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      socials: [''],
      goal: [''],
      skills: [''],
      additionalInfo: [''],
      education: this.fb.array([]),
      workExperience: this.fb.array([]),
    });
  }


  getResumes() {
    this.http.get<any[]>(`${environment.apiUrl}/resume/resumes/`).subscribe(
      (data) => {
        this.resumes = data;
        // this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить резюме.' });
        this.resumes.forEach((resume) => {
          if (resume.status) {
            const status = this.statuses.find(s => s.code === resume.status);
            if (status) {
              this.selectedStatuses[resume.id] = status.name;
            } else {
              this.selectedStatuses[resume.id] = ''; 
            }
          } else {
            this.selectedStatuses[resume.id] = '';
          }
        });
        this.filterResume = this.resumes;
        this.filterResumes();
        this.resumesService.getResumesWithFiles().subscribe((value: any[]) => {
          let data = value.map((resume: any) => {
            if (resume.status) {
              const status = this.statuses.find(s => s.code === resume.status);
              if (status) {
                this.selectedStatuses[resume.id] = status.name;
              } else {
                this.selectedStatuses[resume.id] = ''; 
              }
            } else {
              this.selectedStatuses[resume.id] = '';
            }
            return resume;
          });
  
          this.filterResume = [...this.filterResume, ...data];
        });
      },
      (error) => {
        // this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить резюме.' });
      }
    );
  }
  

  openDialog(resume: any | null = null) {
    if (resume) {
      this.selectedResume = { ...resume };

      this.resumeForm.patchValue({
        full_name: resume.full_name,
        phone: resume.phone,
        email: resume.email,
        address: resume.address,
        socials: resume.socials,
        goal: resume.goal,
        skills: resume.skills,
        additionalInfo: resume.additional_info
      });

      const educationArray = this.resumeForm.get('education') as FormArray;
      const workExperienceArray = this.resumeForm.get('workExperience') as FormArray;

      educationArray.clear();
      workExperienceArray.clear();

      if (resume.education) {
        resume.education.forEach((edu: any) => {
          educationArray.push(this.fb.group({
            school: [edu.school, Validators.required],
            specialty: [edu.specialty, Validators.required],
            city: [edu.city, Validators.required],
            startYear: [edu.startYear, Validators.required],
            endYear: [edu.endYear, Validators.required]
          }));
        });
      }

      if (resume.work_experience) {
        resume.work_experience.forEach((work: any) => {
          workExperienceArray.push(this.fb.group({
            company: [work.company, Validators.required],
            workCity: [work.workCity, Validators.required],
            workStartYear: [work.workStartYear, Validators.required],
            workEndYear: [work.workEndYear, Validators.required],
            responsibilities: [work.responsibilities, Validators.required]
          }));
        });
      }

    } else {
      this.resumeForm.reset();
    }

    this.displayDialog = true;
  }

  
  downloadDocument(resume: any) {
    const fileId = resume.file_id; 

    this.resumesService.downloadFile(fileId).subscribe(
      (fileBlob) => {
        const blob = fileBlob;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = resume.file_id + '_passwords.docx'; 
        link.click();
      },
      (error) => {
        console.error('Ошибка при скачивании файла', error);
      }
    );
  }

  deleteResume(resumeId: string) {
    this.http.delete(`${environment.apiUrl}/resume/resumes/${resumeId}`).subscribe(
      (response) => {
        // this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Резюме удалено.' });
        this.getResumes();
      },
      (error) => {
        // this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить резюме.' });
      }
    );
  }

  get educationControls() {
    return (this.resumeForm.get('education') as FormArray).controls;
  }

  get workExperienceControls() {
    return (this.resumeForm.get('workExperience') as FormArray).controls;
  }

}
