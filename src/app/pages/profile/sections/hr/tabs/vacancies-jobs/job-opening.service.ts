import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../evirement';

export interface JobOpening {
  id: string;
  title: string;
  salary_from: number;
  salary_to: number;
  description: string;
  category: string;
  additional_sections: Array<{ title: string, content: string }>;
}


@Injectable({
  providedIn: 'root'
})
export class JobOpeningService {
  private apiUrl = `${environment.apiUrl}/job`; 

  constructor(private http: HttpClient) {}

  getJobOpenings(skip: number = 0, limit: number = 10): Observable<JobOpening[]> {
    return this.http.get<JobOpening[]>(`${this.apiUrl}/job-openings/?skip=${skip}&limit=${limit}`);
  }

  getJobOpeningById(id: string): Observable<JobOpening> {
    return this.http.get<JobOpening>(`${this.apiUrl}/job-openings/${id}`);
  }

  createJobOpening(jobOpening: JobOpening): Observable<JobOpening> {
    return this.http.post<JobOpening>(`${this.apiUrl}/job-openings/`, jobOpening);
  }

  updateJobOpening(id: string, jobOpening: any): Observable<JobOpening> {
    return this.http.put<JobOpening>(`${this.apiUrl}/job_openings_with_section/${id}`, jobOpening);
  }

  deleteJobOpening(id: string): Observable<JobOpening> {
    return this.http.delete<JobOpening>(`${this.apiUrl}/job-openings/${id}`);
  }
}