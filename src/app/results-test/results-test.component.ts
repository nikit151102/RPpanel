import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../evirement';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results-test',
  imports: [CommonModule],
  templateUrl: './results-test.component.html',
  styleUrl: './results-test.component.scss'
})
export class ResultsTestComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  dataTestResult: any;

  ngOnInit(): void {
    // Получаем параметр id из URL
    const resultId = this.route.snapshot.paramMap.get('id');
    if (resultId) {
      this.cardView(resultId);
    }
  }

  
  cardView(resultId: string) {
    this.http.get(`${environment.apiUrlHR}/results/result/${resultId}`).subscribe(
      (response) => {
        this.dataTestResult = response;
      },
      (error) => {
        console.error('Ошибка при загрузке результатов:', error);
      }
    );
  }

  // Новые методы для кнопок
  goBack() {
    window.history.back();
  }

  exportResults() {
    console.log('Экспорт результатов в PDF...');
    // Реализация экспорта в PDF
  }
}
