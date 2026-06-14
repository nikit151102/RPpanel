import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../evirement';


@Injectable({
  providedIn: 'root'
})
export class ResumesService {

  private apiUrl = `${environment.apiUrl}/resume`;

  constructor(private http: HttpClient) { }

  setResumeStatus(resumeId: string, value: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/resumes/${resumeId}/status?status=${value}`, {});
  }

  setResumeWithFileStatus(resumeId: string, value: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/resumes/${resumeId}/status`, {
      status: value
    });
  }

  getResumesWithFiles() {
    return this.http.get<any>(`${this.apiUrl}/resumes`,);
  }

  downloadFile(fileId: string): Observable<Blob> {
    const url = `${environment.apiUrl}/resume/${fileId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

}