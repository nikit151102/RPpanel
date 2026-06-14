import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import * as XLSX from "xlsx";
import { CheckboxModule } from 'primeng/checkbox';
import { environment } from '../../../../../../../../evirement';

@Component({
  selector: 'app-test-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    CheckboxModule
  ],
  templateUrl: './test-modal.component.html',
  styleUrl: './test-modal.component.scss'
})
export class TestModalComponent implements OnInit {
  showDialog = false;
  editingTestId: string | null = null;
  dialogTitle = 'Создание теста';
  managers: any;
  @Output() refresh = new EventEmitter<void>();

  testForm: FormGroup;

  questionTypes = [
    { label: 'Один вариант', value: 0 },
    { label: 'Несколько вариантов', value: 1 }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.testForm = this.fb.group({
      name: ['', Validators.required],
      description: [' '],
      candidate_not_suitable: [],
      candidate_consider: [],
      candidate_suitable: [],
      is_open: [''],
      manager: [null],
      is_interview: [true],  
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.http.get<any>(`${environment.apiUrlHR}/managers/`).subscribe(response => {
      this.managers = response;
      console.log('response', response)
    })

  }

  get questions(): FormArray {
    return this.testForm.get('questions') as FormArray;
  }

  openForCreate() {
    this.dialogTitle = 'Создание теста';
    this.testForm.reset();
    this.questions.clear();
    this.editingTestId = null;
    this.showDialog = true;

    this.addQuestion();
  }

  getAnswers(qIndex: number): FormArray {
    return (this.questions.at(qIndex).get('answerOptions') as FormArray);
  }

  addQuestion() {
    const question = this.fb.group({
      id: [null],
      text: ['', Validators.required],
      question_type: [0],
      answerOptions: this.fb.array([
        this.fb.group({
          id: [null],
          text: [''],
          score: [0]
        })
      ])
    });
    this.questions.push(question);
  }

  removeQuestion(index: number): void {
    const qGroup = this.questions.at(index);
    if (!qGroup) { return; }

    const id = qGroup.get('id')?.value;
    if (id) {                       // был сохранённый вопрос
      this.deletedQuestionIds.push(id);
    }
    this.questions.removeAt(index);
  }

  removeAnswer(qIndex: number, aIndex: number): void {
    const answers = this.getAnswers(qIndex);
    const aGroup = answers.at(aIndex);

    const id = aGroup.get('id')?.value;
    if (id) {
      this.deletedAnswerIds.push(id);
    }
    answers.removeAt(aIndex);
  }


  addAnswer(qIndex: number) {
    this.getAnswers(qIndex).push(
      this.fb.group({
        id: [null],
        text: [''],
        score: [0]
      })
    );
  }

  openForEdit(test: any) {
    this.dialogTitle = `Редактирование теста "${test.name}"`;
    this.editingTestId = test.id;

    // Загружаем тест целиком
    this.http.get<any>(`${environment.apiUrlHR}/tests/${test.id}/full`).subscribe(fullTest => {
      const managerObj = this.managers.find((m: any) => m.name === fullTest.manager);
      this.testForm.patchValue({
        name: fullTest.name,
        description: fullTest.description,
        is_open: fullTest.is_open,
        manager: managerObj || null,
        is_interview: !!fullTest.is_interview,
        candidate_not_suitable: fullTest.candidate_not_suitable,
        candidate_consider: fullTest.candidate_consider,
        candidate_suitable: fullTest.candidate_suitable,
      });

      this.questions.clear();

      fullTest.questions.forEach((q: any) => {
        const answerOptions = this.fb.array(
          q.options.map((a: any) =>
            this.fb.group({
              id: [a.id],
              text: [a.text],
              score: [a.score]
            })
          )
        );

        const qGroup = this.fb.group({
          id: [q.id],
          text: [q.text],
          question_type: [q.question_type],
          answerOptions
        });

        this.questions.push(qGroup);
      });

      this.showDialog = true;
    });
  }

  deletedQuestionIds: string[] = [];
  deletedAnswerIds: string[] = [];

  onSubmit(): void {
    /* ---------- 1. собираем данные теста ---------- */
    console.log('this.testForm.value',this.testForm.value)
    const testData = {
      name: this.testForm.value.name,
      description: ' ',
      candidate_not_suitable: this.testForm.value.candidate_not_suitable,
      candidate_consider: this.testForm.value.candidate_consider,
      candidate_suitable: this.questions.length,
      manager: this.testForm.value.manager?.name ?? null,
      is_open:
        this.testForm.value.is_open !== true &&
          this.testForm.value.is_open !== false
          ? true
          : this.testForm.value.is_open
    };

    /* ---------- 2. удаляем то, что пользователь стёр ---------- */
    const deleteRequests = [
      ...this.deletedAnswerIds.map(id =>
        this.http.delete(`${environment.apiUrlHR}/answeroption/${id}/`).toPromise()
      ),
      ...this.deletedQuestionIds.map(id =>
        this.http.delete(`${environment.apiUrlHR}/questions/${id}/`).toPromise()
      )
    ];

    Promise.all(deleteRequests)
      .then(() => this.saveOrUpdateTest(testData))   // далее – обычный upsert
      .catch(err => {
        console.error('Ошибка при удалении данных', err);
      });
  }

  /* ---------- 3. создаём / обновляем сам тест ---------- */
  private saveOrUpdateTest(testData: any): void {
    console.log('testData',testData)
    const req$ = this.editingTestId
      ? this.http.put(`${environment.apiUrlHR}/tests/${this.editingTestId}`, testData)
      : this.http.post(`${environment.apiUrlHR}/tests/`, testData);

    req$.subscribe({
      next: (savedTest: any) => this.upsertQuestionsAndAnswers(savedTest.id ?? this.editingTestId),
      error: err => console.error('Ошибка при сохранении теста', err)
    });
  }

  /* ---------- 4. upsert вопросов и ответов ---------- */
  private upsertQuestionsAndAnswers(testId: string): void {
    const questionPromises = this.questions.controls.map(qGroup => {
      const qId = qGroup.value.id;
      const qData = {
        text: qGroup.value.text,
        question_type: 0,
        test_id: testId
      };

      const qReq$ = qId
        ? this.http.put(`${environment.apiUrlHR}/questions/${qId}/`, qData)
        : this.http.post(`${environment.apiUrlHR}/questions/`, qData);

      return qReq$.toPromise().then((qResp: any) => {
        const questionId = qResp.id ?? qId;
        const answerPromises = qGroup.value.answerOptions.map((ans: any) => {
          const aId = ans.id;
          const aData = {
            text: ans.text,
            score: ans.score,
            question_id: questionId
          };
          const aReq$ = aId
            ? this.http.put(`${environment.apiUrlHR}/answeroption/${aId}/`, aData)
            : this.http.post(`${environment.apiUrlHR}/answeroption/`, aData);
          return aReq$.toPromise();
        });
        return Promise.all(answerPromises);
      });
    });

    Promise.all(questionPromises)
      .then(() => this.finalizeSave())
      .catch(err => console.error('Ошибка при сохранении вопросов/ответов', err));
  }

  /* ---------- 5. завершаем: чистим форму и корзины ---------- */
  private finalizeSave(): void {
    this.deletedQuestionIds = [];
    this.deletedAnswerIds = [];

    this.refresh.emit();
    this.testForm.reset();
    this.questions.clear();
    this.showDialog = false;
    this.editingTestId = null;
  }


  @ViewChild("excelInput") excelInput!: ElementRef<HTMLInputElement>;


  /* ---------------------------- excel helpers ---------------------------- */
  onCreateFromExcelClick(): void {
    // Programmatically trigger hidden file input
    this.excelInput.nativeElement.value = ""; // reset same-file selection
    this.excelInput.nativeElement.click();
  }

  onExcelFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: (string | number)[][] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        blankrows: false,
      });

      if (json.length < 2) {
        alert("В файле недостаточно данных");
        return;
      }

      // 1‑я строка — шапка с метаданными
      const [name, description, notSuit, consider, suit, isOpen] = json[0] as string[];

      this.openForCreate();
      this.testForm.patchValue({
        name: name ?? "",
        description: description ?? " ",
        candidate_not_suitable: notSuit ?? "",
        candidate_consider: consider ?? "",
        candidate_suitable: suit ?? "",
        is_open: isOpen?.toString().toLowerCase() === "false" ? false : true,
      });

      // Удаляем созданный по‑умолчанию вопрос, будем загружать из файла
      this.questions.clear();

      // Начиная со второй строки — вопросы
      json.slice(1).forEach((row) => {
        if (!row || row.length === 0) return;

        const [qText, ...rest] = row;
        if (!qText) return;

        const answersArr: any[] = [];
        for (let i = 0; i < rest.length; i += 2) {
          const ansText = rest[i];
          const ansScore = rest[i + 1];
          if (ansText === undefined || ansText === "") continue;
          answersArr.push(
            this.fb.group({
              id: [null],
              text: [ansText as string],
              score: [Number(ansScore) || 0],
            })
          );
        }

        const qGroup = this.fb.group({
          id: [null],
          text: [qText as string, Validators.required],
          question_type: [0], // По умолчанию один вариант
          answerOptions: this.fb.array(answersArr.length ? answersArr : [
            this.fb.group({ id: [null], text: [""], score: [0] }),
          ]),
        });

        this.questions.push(qGroup);
      });
    };

    reader.readAsArrayBuffer(file);
  }
}
