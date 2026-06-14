import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
    id?: number;
    username: string;
    first_name: string;
    last_name: string;
    middle_name?: string;
    rate?: number;
    password?: string;
}

export interface RoutePoint {
    id?: number;
    doc: string;
    payment: number;
    counterparty: string;
    address: string;
    note?: string;
}


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'https://xn--o1ab.xn--80akonecy.xn--p1ai/drivers';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.baseUrl}/users/`);
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/users/${id}`);
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.baseUrl}/users/`, user);
    }

    // Новый метод для создания точки маршрута
    createRoutePointForUser(userId: number, point: RoutePoint): Observable<RoutePoint> {
        const params = new URLSearchParams();
        params.set('doc', point.doc);
        params.set('payment', point.payment.toString());
        params.set('counterparty', point.counterparty);
        params.set('address', point.address);
        if (point.note) params.set('note', point.note);

        return this.http.post<RoutePoint>(
            `${this.baseUrl}/routes/users/${userId}/points?${params.toString()}`,
            {}
        );
    }

    addVehicleForUser(userId: number, vehicle: { plate_number: string; model: string }) {
        return this.http.post<any>(`${this.baseUrl}/vehicles/users/${userId}`, vehicle);
    }

  clearDatabase(): Observable<any> {
    return this.http.post(`${this.baseUrl}/clear_database`, {});
  }

}