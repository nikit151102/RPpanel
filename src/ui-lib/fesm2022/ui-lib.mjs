import * as i0 from '@angular/core';
import { Injectable, Component, EventEmitter, HostListener, Output, Input, ChangeDetectionStrategy, ViewChild, forwardRef } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import * as i2 from '@angular/forms';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i1$1 from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { v4 } from 'uuid';

class UiLibService {
    constructor() { }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UiLibService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UiLibService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UiLibService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

class UiLibComponent {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UiLibComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: UiLibComponent, isStandalone: true, selector: "lib-ui-lib", ngImport: i0, template: `
    <p>
      ui-lib works!
    </p>
  `, isInline: true, styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UiLibComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-ui-lib', imports: [], template: `
    <p>
      ui-lib works!
    </p>
  ` }]
        }] });

/**
 * Компонент боковой панели (Sidebar) с поддержкой адаптивного поведения.
 *
 * Используется для отображения меню с иконками, бейджами, кнопкой сворачивания,
 * логотипом и кастомными стилями. Адаптивен для мобильных, планшетов и десктопов.
 *
 * Пример использования:
 * ```html
 * <lib-sidebar
 *   [menu]="menuItems"
 *   [logoUrl]="'assets/logo.png'"
 *   [customClasses]="customClasses"
 *   [customStyles]="customStyles"
 *   [responsiveConfig]="responsiveConfig"
 *   (collapsedChange)="onCollapsedChange($event)">
 * </lib-sidebar>
 * ```
 */
class SidebarComponent {
    /**
   * Массив элементов меню для sidebar.
   * Каждый элемент содержит label, icon, router, badge и кастомные стили/классы.
   */
    menu = [];
    /**
     * Флаг свёрнутости sidebar.
     * На мобильных устройствах может меняться автоматически.
     */
    isCollapsed = false;
    /**
     * URL логотипа, отображаемого в заголовке sidebar
     */
    logoUrl = 'logo.png';
    /**
     * Кастомные CSS-классы для элементов sidebar (sidebar, header, toggleButton и т.д.)
     */
    customClasses = {};
    /**
     * Кастомные CSS-стили для элементов sidebar (sidebar, header, toggleButton и т.д.)
     */
    customStyles = {};
    /**
     * Конфигурация адаптивности sidebar
     */
    responsiveConfig = {
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1440
        },
        widths: {
            mobile: '0px',
            tablet: '65px',
            desktop: '200px'
        }
    };
    /**
     * Событие, генерируемое при изменении состояния свёрнутости sidebar
     */
    collapsedChange = new EventEmitter();
    currentWidth = this.responsiveConfig.widths.desktop;
    isMiniSidebar = false;
    constructor() {
        const screenWidth = window.innerWidth;
        const { mobile, tablet, desktop } = this.responsiveConfig.breakpoints;
        if (screenWidth <= mobile) {
            this.isCollapsed = true;
        }
        else {
            this.isCollapsed = false;
        }
        this.updateSidebarWidth();
    }
    getSidebarStyles() {
        return {
            width: this.currentWidth,
            ...(this.customStyles.sidebar || {})
        };
    }
    getToggleButtonStyles() {
        const widthValue = parseInt(this.currentWidth, 10);
        const leftValue = widthValue + 10;
        return {
            ...this.customStyles.toggleButton,
            left: `${leftValue}px`,
            position: 'absolute',
            top: '20px',
        };
    }
    get toggleButtonClasses() {
        const screenWidth = window.innerWidth;
        const { mobile } = this.responsiveConfig.breakpoints;
        if (screenWidth <= mobile) {
            return {
                'active': !this.isCollapsed,
                ...(this.customClasses.toggleButton || {})
            };
        }
        else {
            return {
                'active': this.isCollapsed,
                ...(this.customClasses.toggleButton || {})
            };
        }
    }
    onResize() {
        this.updateSidebarWidth();
    }
    updateSidebarWidth() {
        const screenWidth = window.innerWidth;
        const { mobile, tablet, desktop } = this.responsiveConfig.breakpoints;
        const { mobile: mobileW, tablet: tabletW, desktop: desktopW } = this.responsiveConfig.widths;
        if (screenWidth <= mobile) {
            this.currentWidth = this.isCollapsed ? mobileW : '200px';
        }
        else if (screenWidth <= tablet) {
            this.currentWidth = this.isCollapsed ? '200px' : tabletW;
        }
        else {
            if (!this.currentWidth || this.currentWidth === '0px') {
                this.currentWidth = desktopW;
            }
        }
        const widthValue = parseInt(this.currentWidth);
        this.isMiniSidebar = widthValue < 150;
    }
    get isDesktop() {
        return window.innerWidth > 768;
    }
    toggleCollapse() {
        const screenWidth = window.innerWidth;
        if (this.isDesktop) {
            this.currentWidth = this.currentWidth === this.responsiveConfig.widths.desktop ? '65px' : this.responsiveConfig.widths.desktop;
        }
        else {
            this.isCollapsed = !this.isCollapsed;
            this.updateSidebarWidth();
        }
        this.collapsedChange.emit(this.isCollapsed);
    }
    getItemClasses(item) {
        return {
            'menu-item': true,
            ...item.customClasses
        };
    }
    getItemStyles(item) {
        return {
            ...item.customStyles
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: SidebarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: SidebarComponent, isStandalone: true, selector: "lib-sidebar", inputs: { menu: "menu", isCollapsed: "isCollapsed", logoUrl: "logoUrl", customClasses: "customClasses", customStyles: "customStyles", responsiveConfig: "responsiveConfig" }, outputs: { collapsedChange: "collapsedChange" }, host: { listeners: { "window:resize": "onResize()" } }, ngImport: i0, template: "<div class=\"sidebar-container\">\r\n\r\n    <div class=\"sidebar\" [class.collapsed]=\"isCollapsed\" [ngClass]=\"customClasses.sidebar\"\r\n        [ngStyle]=\"getSidebarStyles()\">\r\n        <div class=\"sidebar-header\" [ngClass]=\"customClasses.header\" [ngStyle]=\"customStyles.header\">\r\n            <span *ngIf=\"!isCollapsed\" class=\"brand\" [ngClass]=\"customClasses.brand\">\r\n                <img [src]=\"logoUrl\" alt=\"logo\" />\r\n            </span>\r\n        </div>\r\n\r\n        <nav class=\"menu\">\r\n            <button *ngFor=\"let item of menu\" class=\"menu-item\" [ngClass]=\"getItemClasses(item)\"\r\n                [ngStyle]=\"getItemStyles(item)\" [routerLink]=\"item.router\" routerLinkActive=\"active\"\r\n                [routerLinkActiveOptions]=\"{ exact: true }\">\r\n                <span class=\"icon\" [innerHTML]=\"item.icon\"></span>\r\n                <span class=\"label\" *ngIf=\"!isCollapsed && !isMiniSidebar\">{{ item.label }}</span>\r\n                <span *ngIf=\"item.badge && !isCollapsed && !isMiniSidebar\" class=\"badge\">{{ item.badge }}</span>\r\n            </button>\r\n        </nav>\r\n    </div>\r\n\r\n    <button class=\"sidebar-toggle\" (click)=\"toggleCollapse()\" [ngClass]=\"toggleButtonClasses \"\r\n        [ngStyle]=\"getToggleButtonStyles()\">\r\n        <span></span>\r\n        <span></span>\r\n        <span></span>\r\n    </button>\r\n\r\n</div>", styles: ["@charset \"UTF-8\";.sidebar-container{display:flex;flex-direction:row}.sidebar-container .sidebar-toggle{top:20px;z-index:1100;width:40px;height:36px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;background:#16a34a;border:none;border-radius:8px;cursor:pointer;transition:all .3s ease}.sidebar-container .sidebar-toggle span{width:22px;height:2px;background-color:#fff;border-radius:2px;transition:all .3s ease}.sidebar-container .sidebar-toggle:hover{background-color:#2ba357;transform:scale(1.05)}.sidebar-container .sidebar-toggle.active span:nth-child(1){transform:translateY(7px) rotate(45deg)}.sidebar-container .sidebar-toggle.active span:nth-child(2){opacity:0}.sidebar-container .sidebar-toggle.active span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}.sidebar-container .sidebar{position:fixed;top:0;left:0;height:100vh;display:flex;flex-direction:column;transition:width .3s ease}.sidebar-container .sidebar .brand img{width:160px;transition:transform .3s}.sidebar-container .sidebar.collapsed .label,.sidebar-container .sidebar.collapsed .badge,.sidebar-container .sidebar.collapsed .brand{display:none}.sidebar-container .sidebar .sidebar-header{display:flex;align-items:center;justify-content:center;padding:1.2rem;font-size:1.25rem;font-weight:700;border-bottom:1px solid #f3f4f6;background-color:#f9fafb;transition:background .3s}.sidebar-container .sidebar .menu{flex:1;display:flex;flex-direction:column;margin-top:1rem}.sidebar-container .sidebar .menu .menu-item{display:flex;align-items:center;gap:1rem;padding:.75rem 1rem;background:#fff;border:none;cursor:pointer;color:#1f2937;font-size:1rem;transition:all .3s ease;position:relative;border-radius:12px;margin:.25rem 0;box-shadow:0 2px 6px #0000000d}.sidebar-container .sidebar .menu .menu-item:hover{background-color:#2ba357cc;color:#fff;transform:translate(5px)}.sidebar-container .sidebar .menu .menu-item:hover .icon{color:#fff}.sidebar-container .sidebar .menu .menu-item.active{background-color:#16a34a;color:#fff;box-shadow:0 4px 12px #16a34a4d}.sidebar-container .sidebar .menu .menu-item.active .icon{color:#fff}.sidebar-container .sidebar .menu .menu-item .icon{display:flex;align-items:center;justify-content:center;width:28px;height:28px;color:#16a34a;transition:color .3s}.sidebar-container .sidebar .menu .menu-item .label{flex:1;white-space:nowrap;font-weight:500}.sidebar-container .sidebar .menu .menu-item .badge{background-color:#f87171;color:#fff;font-size:.75rem;padding:.2rem .6rem;border-radius:9999px;font-weight:600}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: SidebarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-sidebar', imports: [CommonModule, RouterLink, RouterLinkActive], template: "<div class=\"sidebar-container\">\r\n\r\n    <div class=\"sidebar\" [class.collapsed]=\"isCollapsed\" [ngClass]=\"customClasses.sidebar\"\r\n        [ngStyle]=\"getSidebarStyles()\">\r\n        <div class=\"sidebar-header\" [ngClass]=\"customClasses.header\" [ngStyle]=\"customStyles.header\">\r\n            <span *ngIf=\"!isCollapsed\" class=\"brand\" [ngClass]=\"customClasses.brand\">\r\n                <img [src]=\"logoUrl\" alt=\"logo\" />\r\n            </span>\r\n        </div>\r\n\r\n        <nav class=\"menu\">\r\n            <button *ngFor=\"let item of menu\" class=\"menu-item\" [ngClass]=\"getItemClasses(item)\"\r\n                [ngStyle]=\"getItemStyles(item)\" [routerLink]=\"item.router\" routerLinkActive=\"active\"\r\n                [routerLinkActiveOptions]=\"{ exact: true }\">\r\n                <span class=\"icon\" [innerHTML]=\"item.icon\"></span>\r\n                <span class=\"label\" *ngIf=\"!isCollapsed && !isMiniSidebar\">{{ item.label }}</span>\r\n                <span *ngIf=\"item.badge && !isCollapsed && !isMiniSidebar\" class=\"badge\">{{ item.badge }}</span>\r\n            </button>\r\n        </nav>\r\n    </div>\r\n\r\n    <button class=\"sidebar-toggle\" (click)=\"toggleCollapse()\" [ngClass]=\"toggleButtonClasses \"\r\n        [ngStyle]=\"getToggleButtonStyles()\">\r\n        <span></span>\r\n        <span></span>\r\n        <span></span>\r\n    </button>\r\n\r\n</div>", styles: ["@charset \"UTF-8\";.sidebar-container{display:flex;flex-direction:row}.sidebar-container .sidebar-toggle{top:20px;z-index:1100;width:40px;height:36px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:5px;background:#16a34a;border:none;border-radius:8px;cursor:pointer;transition:all .3s ease}.sidebar-container .sidebar-toggle span{width:22px;height:2px;background-color:#fff;border-radius:2px;transition:all .3s ease}.sidebar-container .sidebar-toggle:hover{background-color:#2ba357;transform:scale(1.05)}.sidebar-container .sidebar-toggle.active span:nth-child(1){transform:translateY(7px) rotate(45deg)}.sidebar-container .sidebar-toggle.active span:nth-child(2){opacity:0}.sidebar-container .sidebar-toggle.active span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}.sidebar-container .sidebar{position:fixed;top:0;left:0;height:100vh;display:flex;flex-direction:column;transition:width .3s ease}.sidebar-container .sidebar .brand img{width:160px;transition:transform .3s}.sidebar-container .sidebar.collapsed .label,.sidebar-container .sidebar.collapsed .badge,.sidebar-container .sidebar.collapsed .brand{display:none}.sidebar-container .sidebar .sidebar-header{display:flex;align-items:center;justify-content:center;padding:1.2rem;font-size:1.25rem;font-weight:700;border-bottom:1px solid #f3f4f6;background-color:#f9fafb;transition:background .3s}.sidebar-container .sidebar .menu{flex:1;display:flex;flex-direction:column;margin-top:1rem}.sidebar-container .sidebar .menu .menu-item{display:flex;align-items:center;gap:1rem;padding:.75rem 1rem;background:#fff;border:none;cursor:pointer;color:#1f2937;font-size:1rem;transition:all .3s ease;position:relative;border-radius:12px;margin:.25rem 0;box-shadow:0 2px 6px #0000000d}.sidebar-container .sidebar .menu .menu-item:hover{background-color:#2ba357cc;color:#fff;transform:translate(5px)}.sidebar-container .sidebar .menu .menu-item:hover .icon{color:#fff}.sidebar-container .sidebar .menu .menu-item.active{background-color:#16a34a;color:#fff;box-shadow:0 4px 12px #16a34a4d}.sidebar-container .sidebar .menu .menu-item.active .icon{color:#fff}.sidebar-container .sidebar .menu .menu-item .icon{display:flex;align-items:center;justify-content:center;width:28px;height:28px;color:#16a34a;transition:color .3s}.sidebar-container .sidebar .menu .menu-item .label{flex:1;white-space:nowrap;font-weight:500}.sidebar-container .sidebar .menu .menu-item .badge{background-color:#f87171;color:#fff;font-size:.75rem;padding:.2rem .6rem;border-radius:9999px;font-weight:600}\n"] }]
        }], ctorParameters: () => [], propDecorators: { menu: [{
                type: Input
            }], isCollapsed: [{
                type: Input
            }], logoUrl: [{
                type: Input
            }], customClasses: [{
                type: Input
            }], customStyles: [{
                type: Input
            }], responsiveConfig: [{
                type: Input
            }], collapsedChange: [{
                type: Output
            }], onResize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });

class NavBarComponent {
    /**
     * Элементы меню (текст, иконка, маршрут, бейдж и т.п.)
     */
    menu = [];
    /**
     * Свёрнутое состояние меню (например, для мобильной версии)
     */
    isCollapsed = false;
    /**
     * Кастомные CSS-классы для элементов меню
     */
    customClasses = {};
    /**
     * Кастомные inline-стили для элементов меню
     */
    customStyles = {};
    /**
     * Событие изменения состояния (свёрнуто/развёрнуто)
     */
    collapsedChange = new EventEmitter();
    /** Флаг мобильного режима */
    isMobile = false;
    constructor() {
        this.updateScreenSize();
    }
    /** Отслеживает изменение ширины окна */
    updateScreenSize() {
        this.isMobile = window.innerWidth <= 768;
        if (!this.isMobile) {
            this.isCollapsed = false;
        }
    }
    /** Переключение состояния меню (бургер) */
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.collapsedChange.emit(this.isCollapsed);
    }
    /** Получить стили контейнера меню */
    getMenuStyles() {
        return { ...(this.customStyles.menuWrapper || {}) };
    }
    /** Получить классы для конкретного пункта меню */
    getItemClasses(item) {
        return {
            [this.customClasses.item || '']: true,
            ...(item.customClasses || {})
        };
    }
    /** Получить inline-стили для конкретного пункта */
    getItemStyles(item) {
        return {
            ...(this.customStyles.item || {}),
            ...(item.customStyles?.item || {})
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: NavBarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: NavBarComponent, isStandalone: true, selector: "lib-nav-bar", inputs: { menu: "menu", isCollapsed: "isCollapsed", customClasses: "customClasses", customStyles: "customStyles" }, outputs: { collapsedChange: "collapsedChange" }, host: { listeners: { "window:resize": "updateScreenSize()" } }, ngImport: i0, template: "<div class=\"horizontal-menu-container\">\r\n\r\n  <div class=\"menu-wrapper\" [ngClass]=\"{'collapsed': isCollapsed}\" [ngStyle]=\"getMenuStyles()\">\r\n\r\n    <button class=\"menu-toggle\" *ngIf=\"isMobile\" (click)=\"toggleCollapse()\">\r\n      <span></span>\r\n      <span></span>\r\n      <span></span>\r\n    </button>\r\n\r\n    <nav class=\"menu-items\" [ngClass]=\"{'show': !isCollapsed || !isMobile}\">\r\n      <a *ngFor=\"let item of menu\"\r\n         [routerLink]=\"item.router\"\r\n         routerLinkActive=\"active\"\r\n         [routerLinkActiveOptions]=\"{exact:true}\"\r\n         class=\"menu-item\"\r\n         [ngClass]=\"getItemClasses(item)\"\r\n         [ngStyle]=\"getItemStyles(item)\">\r\n        <span class=\"icon\" [innerHTML]=\"item.icon\"></span>\r\n        <span class=\"label\" *ngIf=\"!isCollapsed || !isMobile\">{{ item.label }}</span>\r\n        <span class=\"badge\" *ngIf=\"item.badge && (!isCollapsed || !isMobile)\">{{ item.badge }}</span>\r\n      </a>\r\n    </nav>\r\n  </div>\r\n\r\n</div>\r\n", styles: [".horizontal-menu-container{border-radius:10px;padding:5px;width:100%;background-color:#fff;box-shadow:0 2px 6px #0000001a;display:flex;align-items:center;justify-content:center;position:relative}.horizontal-menu-container .menu-wrapper{display:flex;align-items:center;width:100%;max-width:1200px;position:relative}.horizontal-menu-container .menu-wrapper .menu-toggle{display:none;flex-direction:column;justify-content:center;align-items:center;width:40px;height:36px;gap:5px;background:#16a34a;border:none;border-radius:8px;cursor:pointer;margin-right:1rem}.horizontal-menu-container .menu-wrapper .menu-toggle span{width:22px;height:2px;background-color:#fff;border-radius:2px;transition:all .3s ease}.horizontal-menu-container .menu-wrapper .menu-items{display:flex;flex-direction:row;gap:1rem}.horizontal-menu-container .menu-wrapper .menu-items .menu-item{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:8px;text-decoration:none;color:#1f2937;font-weight:500;transition:all .3s ease;padding:5px 10px}.horizontal-menu-container .menu-wrapper .menu-items .menu-item:hover,.horizontal-menu-container .menu-wrapper .menu-items .menu-item.active{background-color:#16a34a;color:#fff}.horizontal-menu-container .menu-wrapper .menu-items .menu-item:hover .icon,.horizontal-menu-container .menu-wrapper .menu-items .menu-item.active .icon{color:#fff}.horizontal-menu-container .menu-wrapper .menu-items .menu-item .icon{width:24px;height:24px;color:#16a34a;display:flex;align-items:center;justify-content:center}.horizontal-menu-container .menu-wrapper .menu-items .menu-item .label{white-space:nowrap}.horizontal-menu-container .menu-wrapper .menu-items .menu-item .badge{background-color:#f87171;color:#fff;font-size:.7rem;padding:.2rem .5rem;border-radius:9999px;font-weight:600}.horizontal-menu-container .menu-wrapper.collapsed .menu-items{display:none}@media (max-width: 768px){.horizontal-menu-container .menu-wrapper .menu-toggle{display:flex}.horizontal-menu-container .menu-wrapper .menu-items{flex-direction:column;background:#fff;position:absolute;top:50px;left:0;width:100%;padding:.5rem 0;box-shadow:0 4px 12px #00000026}}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: NavBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-nav-bar', standalone: true, imports: [CommonModule, RouterLink, RouterLinkActive], template: "<div class=\"horizontal-menu-container\">\r\n\r\n  <div class=\"menu-wrapper\" [ngClass]=\"{'collapsed': isCollapsed}\" [ngStyle]=\"getMenuStyles()\">\r\n\r\n    <button class=\"menu-toggle\" *ngIf=\"isMobile\" (click)=\"toggleCollapse()\">\r\n      <span></span>\r\n      <span></span>\r\n      <span></span>\r\n    </button>\r\n\r\n    <nav class=\"menu-items\" [ngClass]=\"{'show': !isCollapsed || !isMobile}\">\r\n      <a *ngFor=\"let item of menu\"\r\n         [routerLink]=\"item.router\"\r\n         routerLinkActive=\"active\"\r\n         [routerLinkActiveOptions]=\"{exact:true}\"\r\n         class=\"menu-item\"\r\n         [ngClass]=\"getItemClasses(item)\"\r\n         [ngStyle]=\"getItemStyles(item)\">\r\n        <span class=\"icon\" [innerHTML]=\"item.icon\"></span>\r\n        <span class=\"label\" *ngIf=\"!isCollapsed || !isMobile\">{{ item.label }}</span>\r\n        <span class=\"badge\" *ngIf=\"item.badge && (!isCollapsed || !isMobile)\">{{ item.badge }}</span>\r\n      </a>\r\n    </nav>\r\n  </div>\r\n\r\n</div>\r\n", styles: [".horizontal-menu-container{border-radius:10px;padding:5px;width:100%;background-color:#fff;box-shadow:0 2px 6px #0000001a;display:flex;align-items:center;justify-content:center;position:relative}.horizontal-menu-container .menu-wrapper{display:flex;align-items:center;width:100%;max-width:1200px;position:relative}.horizontal-menu-container .menu-wrapper .menu-toggle{display:none;flex-direction:column;justify-content:center;align-items:center;width:40px;height:36px;gap:5px;background:#16a34a;border:none;border-radius:8px;cursor:pointer;margin-right:1rem}.horizontal-menu-container .menu-wrapper .menu-toggle span{width:22px;height:2px;background-color:#fff;border-radius:2px;transition:all .3s ease}.horizontal-menu-container .menu-wrapper .menu-items{display:flex;flex-direction:row;gap:1rem}.horizontal-menu-container .menu-wrapper .menu-items .menu-item{display:flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:8px;text-decoration:none;color:#1f2937;font-weight:500;transition:all .3s ease;padding:5px 10px}.horizontal-menu-container .menu-wrapper .menu-items .menu-item:hover,.horizontal-menu-container .menu-wrapper .menu-items .menu-item.active{background-color:#16a34a;color:#fff}.horizontal-menu-container .menu-wrapper .menu-items .menu-item:hover .icon,.horizontal-menu-container .menu-wrapper .menu-items .menu-item.active .icon{color:#fff}.horizontal-menu-container .menu-wrapper .menu-items .menu-item .icon{width:24px;height:24px;color:#16a34a;display:flex;align-items:center;justify-content:center}.horizontal-menu-container .menu-wrapper .menu-items .menu-item .label{white-space:nowrap}.horizontal-menu-container .menu-wrapper .menu-items .menu-item .badge{background-color:#f87171;color:#fff;font-size:.7rem;padding:.2rem .5rem;border-radius:9999px;font-weight:600}.horizontal-menu-container .menu-wrapper.collapsed .menu-items{display:none}@media (max-width: 768px){.horizontal-menu-container .menu-wrapper .menu-toggle{display:flex}.horizontal-menu-container .menu-wrapper .menu-items{flex-direction:column;background:#fff;position:absolute;top:50px;left:0;width:100%;padding:.5rem 0;box-shadow:0 4px 12px #00000026}}\n"] }]
        }], ctorParameters: () => [], propDecorators: { menu: [{
                type: Input
            }], isCollapsed: [{
                type: Input
            }], customClasses: [{
                type: Input
            }], customStyles: [{
                type: Input
            }], collapsedChange: [{
                type: Output
            }], updateScreenSize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });

class DateFilterSortComponent {
    elementRef;
    filterField = ''; // Название поля для фильтрации
    selectedFilter = ''; // Выбранный тип фильтра (например, "Равно")
    selectedDate = ''; // Основное поле для отображения даты/диапазона
    dateValue = ''; // Храним одну дату (для "Равно", "До даты", "После даты")
    startDate = ''; // Начало диапазона для "Между датами"
    endDate = ''; // Конец диапазона для "Между датами"
    showCalendar = false; // Показать календарь
    isFilterOpen = false;
    sortOrder = 'asc'; // Направление сортировки
    filterChange = new EventEmitter();
    sortChange = new EventEmitter();
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    toggleFilter() {
        this.isFilterOpen = !this.isFilterOpen;
    }
    inputWidth = '30px';
    bgColor = 'transparent';
    borderStyle = 'none';
    isSearchOpen = false;
    toggleSearch(isFocused) {
        if (isFocused) {
            this.inputWidth = '200px';
            this.bgColor = '#ffffff';
            this.borderStyle = '1px solid #007BFF';
            this.isSearchOpen = true;
        }
        else {
            setTimeout(() => {
                this.inputWidth = '30px';
                this.bgColor = 'transparent';
                this.borderStyle = 'none';
                this.isSearchOpen = false;
            }, 200);
        }
    }
    toggleSort() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        const sortDto = {
            field: this.filterField,
            sortType: this.sortOrder === 'asc' ? 0 : 1
        };
        this.sortChange.emit(sortDto);
    }
    onFilterChange(filter) {
        this.selectedFilter = filter;
        this.selectedDate = '';
        this.dateValue = '';
        this.startDate = '';
        this.endDate = '';
        this.showCalendar = true;
        // this.emitFilterChange();
    }
    onDateChange() {
        const filterDto = {
            field: this.filterField,
            values: [],
            type: this.getDateFilterType()
        };
        if (this.selectedFilter === 'Между датами') {
            filterDto.values = [this.startDate, this.endDate];
        }
        else {
            filterDto.values = [this.dateValue];
        }
        this.filterChange.emit(filterDto);
        this.selectedDate = this.formatDateDisplay();
    }
    getDateFilterType() {
        switch (this.selectedFilter) {
            case 'Равно': return 6;
            case 'До даты': return 7;
            case 'После даты': return 8;
            case 'Между датами': return 9;
            default: return 6;
        }
    }
    formatDateDisplay() {
        if (this.selectedFilter === 'Между датами') {
            return `${this.startDate} - ${this.endDate}`;
        }
        return this.dateValue;
    }
    emitFilterChange() {
        const filterDto = {
            field: this.filterField,
            values: this.selectedFilter === 'Между датами' ? [this.startDate, this.endDate] : [this.dateValue],
            type: this.getDateFilterType()
        };
        this.filterChange.emit(filterDto);
    }
    openDatePicker(input) {
        input.showPicker();
    }
    resetFilter() {
        this.selectedFilter = ''; // Сбрасываем выбранный фильтр
        this.selectedDate = ''; // Сбрасываем выбранную дату
        this.dateValue = ''; // Сбрасываем значение даты
        this.startDate = ''; // Сбрасываем начальную дату диапазона
        this.endDate = ''; // Сбрасываем конечную дату диапазона
        this.showCalendar = false; // Скрываем календарь
        this.emitFilterChange(); // Эмитируем изменение фильтра (передаем пустой фильтр)
    }
    onClickOutside(event) {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isFilterOpen = false;
        }
        if (!clickedInside && this.inputWidth != '30px') {
            this.inputWidth = '30px';
            this.bgColor = 'transparent';
            this.borderStyle = 'none';
            this.isSearchOpen = false;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: DateFilterSortComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: DateFilterSortComponent, isStandalone: true, selector: "app-date-filter", inputs: { filterField: "filterField" }, outputs: { filterChange: "filterChange", sortChange: "sortChange" }, host: { listeners: { "document:click": "onClickOutside($event)" } }, ngImport: i0, template: "<div class=\"date-filter-sort\">\r\n    <!-- \u041F\u043E\u043B\u0435 \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u0434\u0430\u0442\u044B -->\r\n    <div class=\"date-box\">\r\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\" (click)=\"toggleSearch(true)\">\r\n            <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\r\n                d=\"M9.591 9.591a4 4 0 10-5.657-5.657 4 4 0 005.657 5.657zm1.06-6.717a5.502 5.502 0 01.915 6.57l2.732 2.733a1.5 1.5 0 11-2.121 2.12l-2.732-2.73a5.5 5.5 0 111.207-8.692z\"\r\n                fill=\"#000\"></path>\r\n        </svg>\r\n\r\n        <input type=\"text\" [(ngModel)]=\"selectedDate\" (focus)=\"toggleFilter()\" placeholder=\"\"\r\n            readonly #dateInput \r\n            [ngStyle]=\"{'width': inputWidth, 'background': bgColor, 'border': borderStyle, 'transition': 'all 0.3s ease'}\"\r\n            [ngClass]=\"{'search-expanded': isSearchOpen}\"/>\r\n            \r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\">\r\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 44.023 44.023\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\" enable-background=\"new 0 0 44.023 44.023\"\r\n                style=\"width: 15px;\">\r\n                <g>\r\n                    <g>\r\n                        <path\r\n                            d=\"m43.729,.29c-0.219-0.22-0.513-0.303-0.799-0.276h-41.831c-0.286-0.026-0.579,0.057-0.798,0.276-0.09,0.09-0.155,0.195-0.203,0.306-0.059,0.128-0.098,0.268-0.098,0.418 0,0.292 0.129,0.549 0.329,0.731l14.671,20.539v20.662c-0.008,0.152 0.015,0.304 0.077,0.446 0.149,0.364 0.505,0.621 0.923,0.621 0.303,0 0.565-0.142 0.749-0.354l11.98-11.953c0.227-0.227 0.307-0.533 0.271-0.828v-8.589l14.729-20.583c0.392-0.391 0.392-1.025 0-1.416zm-16.445,20.998c-0.209,0.209-0.298,0.485-0.284,0.759v8.553l-10,9.977v-18.53c0.014-0.273-0.075-0.55-0.284-0.759l-13.767-19.274h38.128l-13.793,19.274z\" />\r\n                    </g>\r\n                </g>\r\n            </svg>\r\n        </button>\r\n    </div>\r\n\r\n\r\n    <div *ngIf=\"isFilterOpen\" style=\"display: flex; gap: 10px;\">\r\n        <!-- \u0412\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0442\u0438\u043F\u043E\u0432 \u0444\u0438\u043B\u044C\u0442\u0440\u0430 -->\r\n        <div class=\"filter-dropdown\">\r\n            <div>\r\n                <label *ngFor=\"let filter of ['\u0420\u0430\u0432\u043D\u043E', '\u0414\u043E \u0434\u0430\u0442\u044B', '\u041F\u043E\u0441\u043B\u0435 \u0434\u0430\u0442\u044B', '\u041C\u0435\u0436\u0434\u0443 \u0434\u0430\u0442\u0430\u043C\u0438']\">\r\n                    <input type=\"radio\" [checked]=\"selectedFilter === filter\" (change)=\"onFilterChange(filter)\" />\r\n                    {{ filter }}\r\n                </label>\r\n\r\n            </div>\r\n\r\n            <!-- \u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C \u0438\u043B\u0438 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0430 -->\r\n            <div class=\"calendar-container\" *ngIf=\"showCalendar\">\r\n                <ng-container [ngSwitch]=\"selectedFilter\">\r\n                    <!-- \u0420\u0430\u0432\u043D\u043E -->\r\n                    <div *ngSwitchCase=\"'\u0420\u0430\u0432\u043D\u043E'\">\r\n                        <input type=\"date\" [(ngModel)]=\"dateValue\" (change)=\"onDateChange()\" #dateInput\r\n                            (click)=\"openDatePicker(dateInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u0414\u043E \u0434\u0430\u0442\u044B -->\r\n                    <div *ngSwitchCase=\"'\u0414\u043E \u0434\u0430\u0442\u044B'\">\r\n                        <input type=\"date\" [(ngModel)]=\"dateValue\" (change)=\"onDateChange()\" #dateInput\r\n                            (click)=\"openDatePicker(dateInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u041F\u043E\u0441\u043B\u0435 \u0434\u0430\u0442\u044B -->\r\n                    <div *ngSwitchCase=\"'\u041F\u043E\u0441\u043B\u0435 \u0434\u0430\u0442\u044B'\">\r\n                        <input type=\"date\" [(ngModel)]=\"dateValue\" (change)=\"onDateChange()\" #dateInput\r\n                            (click)=\"openDatePicker(dateInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u041C\u0435\u0436\u0434\u0443 \u0434\u0430\u0442\u0430\u043C\u0438 -->\r\n                    <div *ngSwitchCase=\"'\u041C\u0435\u0436\u0434\u0443 \u0434\u0430\u0442\u0430\u043C\u0438'\">\r\n                        <input type=\"date\" [(ngModel)]=\"startDate\" (change)=\"onDateChange()\" #startDateInput\r\n                            (click)=\"openDatePicker(startDateInput)\" />\r\n                        <span>\u043F\u043E</span>\r\n                        <input type=\"date\" [(ngModel)]=\"endDate\" (change)=\"onDateChange()\" #endDateInput\r\n                            (click)=\"openDatePicker(endDateInput)\" />\r\n                    </div>\r\n                </ng-container>\r\n            </div>\r\n        </div>\r\n\r\n\r\n\r\n\r\n    </div>\r\n\r\n\r\n    <!-- \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438 -->\r\n    <button class=\"sort-btn\" (click)=\"toggleSort()\">\r\n        <svg *ngIf=\"sortOrder === 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M8,5.70710678 L8,19.508331 C8,19.7844734 7.77614237,20.008331 7.5,20.008331 C7.22385763,20.008331 7,19.7844734 7,19.508331 L7,5.70710678 L4.85355339,7.85355339 C4.65829124,8.04881554 4.34170876,8.04881554 4.14644661,7.85355339 C3.95118446,7.65829124 3.95118446,7.34170876 4.14644661,7.14644661 L7.14644661,4.14644661 C7.34170876,3.95118446 7.65829124,3.95118446 7.85355339,4.14644661 L10.8535534,7.14644661 C11.0488155,7.34170876 11.0488155,7.65829124 10.8535534,7.85355339 C10.6582912,8.04881554 10.3417088,8.04881554 10.1464466,7.85355339 L8,5.70710678 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n\r\n        <svg *ngIf=\"sortOrder != 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M6.90365714,19.8034496 C6.81268627,19.9276666 6.66576323,20.008331 6.5,20.008331 C6.33423677,20.008331 6.18731373,19.9276666 6.09634286,19.8034496 L3.14644661,16.8535534 C2.95118446,16.6582912 2.95118446,16.3417088 3.14644661,16.1464466 C3.34170876,15.9511845 3.65829124,15.9511845 3.85355339,16.1464466 L6,18.2928932 L6,4.5 C6,4.22385763 6.22385763,4 6.5,4 C6.77614237,4 7,4.22385763 7,4.5 L7,18.2928932 L9.14644661,16.1464466 C9.34170876,15.9511845 9.65829124,15.9511845 9.85355339,16.1464466 C10.0488155,16.3417088 10.0488155,16.6582912 9.85355339,16.8535534 L6.90365714,19.8034496 L6.90365714,19.8034496 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n    </button>\r\n</div>\r\n\r\n<button *ngIf=\"selectedFilter\" class=\"btn-clear-filter\" (click)=\"resetFilter()\">\r\n    \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\r\n</button>", styles: ["@charset \"UTF-8\";.date-filter-sort{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border-radius:8px;background:#f9f9f9;box-shadow:0 2px 8px #0000001a;position:relative}.date-box{display:flex;align-items:center;justify-content:space-between;position:relative}.date-box input{width:100%;padding:12px;font-size:14px;border:1px solid #ddd;border-radius:8px;background-color:#fafafa;color:#333;cursor:pointer;transition:all .3s ease}.date-box input:focus{border-color:#007bff;box-shadow:0 0 8px #007bff80}.filter-btn{position:absolute;right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:#666;transition:color .3s ease-in-out}.filter-btn:hover{color:#007bff}.filter-dropdown{margin-top:10px;background-color:#f7f7f7;border-radius:8px;box-shadow:0 4px 10px #0000001a;padding:15px;position:absolute;top:100%;left:0;max-width:325px;z-index:999;display:flex;flex-direction:row;gap:5px}.filter-dropdown label{display:flex;align-items:center;font-size:14px;padding:8px;cursor:pointer;transition:background-color .3s ease;border-radius:5px;color:#101010}.filter-dropdown label:hover{background-color:#e9ecef}.calendar-container{display:flex;flex-direction:column;gap:12px}.calendar-container input[type=date]{width:100%;padding:12px;font-size:14px;border:1px solid #ddd;border-radius:8px;background-color:#fafafa;color:#333;cursor:pointer;transition:all .3s ease}.calendar-container input[type=date]:focus{border-color:#007bff;box-shadow:0 0 8px #007bff80}.calendar-container span{font-size:14px;font-weight:700;text-align:center}.sort-btn{background:transparent;border:none;border-radius:6px;padding:4px;font-size:16px;cursor:pointer;color:#666;transition:all .3s ease-in-out;margin-left:8px}.sort-btn:hover{background:#007bff36;color:#fff}@media (max-width: 600px){.date-filter-sort{padding:15px;margin:10px}.date-box input,.calendar-container input[type=date],.sort-btn,.filter-btn{font-size:16px;padding:12px}.filter-dropdown{padding:12px}.filter-dropdown label{padding:10px}}.btn-clear-filter{padding:5px;background:transparent;color:#1b506a;font-size:13px;border:none;margin-top:10px}.input-container{position:relative;width:100%}.input-container svg{position:absolute;left:10px;top:50%;transform:translateY(-50%)}.input-container input{padding-left:30px}input{color:#101010}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: DateFilterSortComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-date-filter', imports: [CommonModule, FormsModule], standalone: true, template: "<div class=\"date-filter-sort\">\r\n    <!-- \u041F\u043E\u043B\u0435 \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u0434\u0430\u0442\u044B -->\r\n    <div class=\"date-box\">\r\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\" (click)=\"toggleSearch(true)\">\r\n            <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\r\n                d=\"M9.591 9.591a4 4 0 10-5.657-5.657 4 4 0 005.657 5.657zm1.06-6.717a5.502 5.502 0 01.915 6.57l2.732 2.733a1.5 1.5 0 11-2.121 2.12l-2.732-2.73a5.5 5.5 0 111.207-8.692z\"\r\n                fill=\"#000\"></path>\r\n        </svg>\r\n\r\n        <input type=\"text\" [(ngModel)]=\"selectedDate\" (focus)=\"toggleFilter()\" placeholder=\"\"\r\n            readonly #dateInput \r\n            [ngStyle]=\"{'width': inputWidth, 'background': bgColor, 'border': borderStyle, 'transition': 'all 0.3s ease'}\"\r\n            [ngClass]=\"{'search-expanded': isSearchOpen}\"/>\r\n            \r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\">\r\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 44.023 44.023\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\" enable-background=\"new 0 0 44.023 44.023\"\r\n                style=\"width: 15px;\">\r\n                <g>\r\n                    <g>\r\n                        <path\r\n                            d=\"m43.729,.29c-0.219-0.22-0.513-0.303-0.799-0.276h-41.831c-0.286-0.026-0.579,0.057-0.798,0.276-0.09,0.09-0.155,0.195-0.203,0.306-0.059,0.128-0.098,0.268-0.098,0.418 0,0.292 0.129,0.549 0.329,0.731l14.671,20.539v20.662c-0.008,0.152 0.015,0.304 0.077,0.446 0.149,0.364 0.505,0.621 0.923,0.621 0.303,0 0.565-0.142 0.749-0.354l11.98-11.953c0.227-0.227 0.307-0.533 0.271-0.828v-8.589l14.729-20.583c0.392-0.391 0.392-1.025 0-1.416zm-16.445,20.998c-0.209,0.209-0.298,0.485-0.284,0.759v8.553l-10,9.977v-18.53c0.014-0.273-0.075-0.55-0.284-0.759l-13.767-19.274h38.128l-13.793,19.274z\" />\r\n                    </g>\r\n                </g>\r\n            </svg>\r\n        </button>\r\n    </div>\r\n\r\n\r\n    <div *ngIf=\"isFilterOpen\" style=\"display: flex; gap: 10px;\">\r\n        <!-- \u0412\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0442\u0438\u043F\u043E\u0432 \u0444\u0438\u043B\u044C\u0442\u0440\u0430 -->\r\n        <div class=\"filter-dropdown\">\r\n            <div>\r\n                <label *ngFor=\"let filter of ['\u0420\u0430\u0432\u043D\u043E', '\u0414\u043E \u0434\u0430\u0442\u044B', '\u041F\u043E\u0441\u043B\u0435 \u0434\u0430\u0442\u044B', '\u041C\u0435\u0436\u0434\u0443 \u0434\u0430\u0442\u0430\u043C\u0438']\">\r\n                    <input type=\"radio\" [checked]=\"selectedFilter === filter\" (change)=\"onFilterChange(filter)\" />\r\n                    {{ filter }}\r\n                </label>\r\n\r\n            </div>\r\n\r\n            <!-- \u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C \u0438\u043B\u0438 \u043A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0430 -->\r\n            <div class=\"calendar-container\" *ngIf=\"showCalendar\">\r\n                <ng-container [ngSwitch]=\"selectedFilter\">\r\n                    <!-- \u0420\u0430\u0432\u043D\u043E -->\r\n                    <div *ngSwitchCase=\"'\u0420\u0430\u0432\u043D\u043E'\">\r\n                        <input type=\"date\" [(ngModel)]=\"dateValue\" (change)=\"onDateChange()\" #dateInput\r\n                            (click)=\"openDatePicker(dateInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u0414\u043E \u0434\u0430\u0442\u044B -->\r\n                    <div *ngSwitchCase=\"'\u0414\u043E \u0434\u0430\u0442\u044B'\">\r\n                        <input type=\"date\" [(ngModel)]=\"dateValue\" (change)=\"onDateChange()\" #dateInput\r\n                            (click)=\"openDatePicker(dateInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u041F\u043E\u0441\u043B\u0435 \u0434\u0430\u0442\u044B -->\r\n                    <div *ngSwitchCase=\"'\u041F\u043E\u0441\u043B\u0435 \u0434\u0430\u0442\u044B'\">\r\n                        <input type=\"date\" [(ngModel)]=\"dateValue\" (change)=\"onDateChange()\" #dateInput\r\n                            (click)=\"openDatePicker(dateInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u041C\u0435\u0436\u0434\u0443 \u0434\u0430\u0442\u0430\u043C\u0438 -->\r\n                    <div *ngSwitchCase=\"'\u041C\u0435\u0436\u0434\u0443 \u0434\u0430\u0442\u0430\u043C\u0438'\">\r\n                        <input type=\"date\" [(ngModel)]=\"startDate\" (change)=\"onDateChange()\" #startDateInput\r\n                            (click)=\"openDatePicker(startDateInput)\" />\r\n                        <span>\u043F\u043E</span>\r\n                        <input type=\"date\" [(ngModel)]=\"endDate\" (change)=\"onDateChange()\" #endDateInput\r\n                            (click)=\"openDatePicker(endDateInput)\" />\r\n                    </div>\r\n                </ng-container>\r\n            </div>\r\n        </div>\r\n\r\n\r\n\r\n\r\n    </div>\r\n\r\n\r\n    <!-- \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438 -->\r\n    <button class=\"sort-btn\" (click)=\"toggleSort()\">\r\n        <svg *ngIf=\"sortOrder === 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M8,5.70710678 L8,19.508331 C8,19.7844734 7.77614237,20.008331 7.5,20.008331 C7.22385763,20.008331 7,19.7844734 7,19.508331 L7,5.70710678 L4.85355339,7.85355339 C4.65829124,8.04881554 4.34170876,8.04881554 4.14644661,7.85355339 C3.95118446,7.65829124 3.95118446,7.34170876 4.14644661,7.14644661 L7.14644661,4.14644661 C7.34170876,3.95118446 7.65829124,3.95118446 7.85355339,4.14644661 L10.8535534,7.14644661 C11.0488155,7.34170876 11.0488155,7.65829124 10.8535534,7.85355339 C10.6582912,8.04881554 10.3417088,8.04881554 10.1464466,7.85355339 L8,5.70710678 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n\r\n        <svg *ngIf=\"sortOrder != 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M6.90365714,19.8034496 C6.81268627,19.9276666 6.66576323,20.008331 6.5,20.008331 C6.33423677,20.008331 6.18731373,19.9276666 6.09634286,19.8034496 L3.14644661,16.8535534 C2.95118446,16.6582912 2.95118446,16.3417088 3.14644661,16.1464466 C3.34170876,15.9511845 3.65829124,15.9511845 3.85355339,16.1464466 L6,18.2928932 L6,4.5 C6,4.22385763 6.22385763,4 6.5,4 C6.77614237,4 7,4.22385763 7,4.5 L7,18.2928932 L9.14644661,16.1464466 C9.34170876,15.9511845 9.65829124,15.9511845 9.85355339,16.1464466 C10.0488155,16.3417088 10.0488155,16.6582912 9.85355339,16.8535534 L6.90365714,19.8034496 L6.90365714,19.8034496 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n    </button>\r\n</div>\r\n\r\n<button *ngIf=\"selectedFilter\" class=\"btn-clear-filter\" (click)=\"resetFilter()\">\r\n    \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\r\n</button>", styles: ["@charset \"UTF-8\";.date-filter-sort{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border-radius:8px;background:#f9f9f9;box-shadow:0 2px 8px #0000001a;position:relative}.date-box{display:flex;align-items:center;justify-content:space-between;position:relative}.date-box input{width:100%;padding:12px;font-size:14px;border:1px solid #ddd;border-radius:8px;background-color:#fafafa;color:#333;cursor:pointer;transition:all .3s ease}.date-box input:focus{border-color:#007bff;box-shadow:0 0 8px #007bff80}.filter-btn{position:absolute;right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:#666;transition:color .3s ease-in-out}.filter-btn:hover{color:#007bff}.filter-dropdown{margin-top:10px;background-color:#f7f7f7;border-radius:8px;box-shadow:0 4px 10px #0000001a;padding:15px;position:absolute;top:100%;left:0;max-width:325px;z-index:999;display:flex;flex-direction:row;gap:5px}.filter-dropdown label{display:flex;align-items:center;font-size:14px;padding:8px;cursor:pointer;transition:background-color .3s ease;border-radius:5px;color:#101010}.filter-dropdown label:hover{background-color:#e9ecef}.calendar-container{display:flex;flex-direction:column;gap:12px}.calendar-container input[type=date]{width:100%;padding:12px;font-size:14px;border:1px solid #ddd;border-radius:8px;background-color:#fafafa;color:#333;cursor:pointer;transition:all .3s ease}.calendar-container input[type=date]:focus{border-color:#007bff;box-shadow:0 0 8px #007bff80}.calendar-container span{font-size:14px;font-weight:700;text-align:center}.sort-btn{background:transparent;border:none;border-radius:6px;padding:4px;font-size:16px;cursor:pointer;color:#666;transition:all .3s ease-in-out;margin-left:8px}.sort-btn:hover{background:#007bff36;color:#fff}@media (max-width: 600px){.date-filter-sort{padding:15px;margin:10px}.date-box input,.calendar-container input[type=date],.sort-btn,.filter-btn{font-size:16px;padding:12px}.filter-dropdown{padding:12px}.filter-dropdown label{padding:10px}}.btn-clear-filter{padding:5px;background:transparent;color:#1b506a;font-size:13px;border:none;margin-top:10px}.input-container{position:relative;width:100%}.input-container svg{position:absolute;left:10px;top:50%;transform:translateY(-50%)}.input-container input{padding-left:30px}input{color:#101010}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { filterField: [{
                type: Input
            }], filterChange: [{
                type: Output
            }], sortChange: [{
                type: Output
            }], onClickOutside: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });

class NumberFilterComponent {
    elementRef;
    filterField = ''; // Название поля для фильтрации
    selectedFilter = ''; // Выбранный тип фильтра (например, "Равно")
    selectedNumber = ''; // Основное поле для отображения числа/диапазона
    numberValue = 0; // Храним одно число (для "Равно", "Меньше", "Больше")
    startNumber = 0; // Начало диапазона для "Между"
    endNumber = 0; // Конец диапазона для "Между"
    showNumberInput = false; // Показать поля для ввода чисел
    isFilterOpen = false;
    sortOrder = 'asc'; // Направление сортировки
    filterChange = new EventEmitter();
    sortChange = new EventEmitter();
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    toggleFilter() {
        this.isFilterOpen = !this.isFilterOpen;
    }
    inputWidth = '30px';
    bgColor = 'transparent';
    borderStyle = 'none';
    isSearchOpen = false;
    toggleSearch(isFocused) {
        if (isFocused) {
            this.inputWidth = '150px';
            this.bgColor = '#ffffff';
            this.borderStyle = '1px solid #007BFF';
            this.isSearchOpen = true;
        }
        else {
            setTimeout(() => {
                this.inputWidth = '30px';
                this.bgColor = 'transparent';
                this.borderStyle = 'none';
                this.isSearchOpen = false;
            }, 200);
        }
    }
    toggleSort() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        const sortDto = {
            field: this.filterField,
            sortType: this.sortOrder === 'asc' ? 0 : 1
        };
        this.sortChange.emit(sortDto);
    }
    onFilterChange(filter) {
        this.selectedFilter = filter;
        this.selectedNumber = '';
        this.numberValue = 0;
        this.startNumber = 0;
        this.endNumber = 0;
        this.showNumberInput = true;
        this.emitFilterChange();
    }
    onSearchChange() {
        const filterDto = {
            field: this.filterField,
            values: [Number(this.selectedNumber)],
            type: 2
        };
        this.filterChange.emit(filterDto);
    }
    onNumberChange() {
        const filterDto = {
            field: this.filterField,
            values: [],
            type: this.getNumberFilterType()
        };
        if (this.selectedFilter === 'Между') {
            filterDto.values = [this.startNumber, this.endNumber];
        }
        else {
            filterDto.values = [this.numberValue];
        }
        this.filterChange.emit(filterDto);
        this.selectedNumber = this.formatNumberDisplay();
    }
    getNumberFilterType() {
        switch (this.selectedFilter) {
            case 'Равно': return 2;
            case 'Меньше': return 3;
            case 'Больше': return 4;
            case 'Между': return 5;
            default: return 2;
        }
    }
    formatNumberDisplay() {
        if (this.selectedFilter === 'Между') {
            return `${this.startNumber} - ${this.endNumber}`;
        }
        return this.numberValue.toString();
    }
    emitFilterChange() {
        const filterDto = {
            field: this.filterField,
            values: this.selectedFilter === 'Между' ? [this.startNumber, this.endNumber] : [this.numberValue],
            type: this.getNumberFilterType()
        };
        this.filterChange.emit(filterDto);
    }
    openNumberPicker(input) {
        // You can add logic to open number picker if needed
        input.focus();
    }
    resetFilter() {
        // Сбрасываем все значения фильтра
        this.selectedFilter = ''; // Сбрасываем выбранный фильтр
        this.selectedNumber = ''; // Сбрасываем отображаемое число/диапазон
        this.numberValue = 0; // Сбрасываем число
        this.startNumber = 0; // Сбрасываем начало диапазона
        this.endNumber = 0; // Сбрасываем конец диапазона
        this.showNumberInput = false; // Скрываем поля ввода
        this.emitFilterChange(); // Эмитируем сброс фильтра
    }
    onClickOutside(event) {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isFilterOpen = false;
        }
        if (!clickedInside && this.inputWidth != '30px') {
            this.inputWidth = '30px';
            this.bgColor = 'transparent';
            this.borderStyle = 'none';
            this.isSearchOpen = false;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: NumberFilterComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: NumberFilterComponent, isStandalone: true, selector: "app-number-filter", inputs: { filterField: "filterField" }, outputs: { filterChange: "filterChange", sortChange: "sortChange" }, host: { listeners: { "document:click": "onClickOutside($event)" } }, ngImport: i0, template: "<div class=\"number-filter-sort\">\r\n    <!-- \u041F\u043E\u043B\u0435 \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u0447\u0438\u0441\u043B\u0430 -->\r\n    <!-- <div class=\"number-box\">\r\n        <input type=\"text\" [(ngModel)]=\"selectedNumber\" (focus)=\"toggleFilter()\"\r\n            placeholder=\"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E/\u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D...\" readonly #numberInput />\r\n\r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\">\u25BC</button>\r\n    </div> -->\r\n\r\n    <div class=\"number-box\">\r\n        <div class=\"input-container\" (click)=\"toggleSearch(true)\">\r\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"\r\n                (click)=\"toggleSearch(true)\">\r\n                <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\r\n                    d=\"M9.591 9.591a4 4 0 10-5.657-5.657 4 4 0 005.657 5.657zm1.06-6.717a5.502 5.502 0 01.915 6.57l2.732 2.733a1.5 1.5 0 11-2.121 2.12l-2.732-2.73a5.5 5.5 0 111.207-8.692z\"\r\n                    fill=\"#000\"></path>\r\n            </svg>\r\n            <input type=\"text\" [(ngModel)]=\"selectedNumber\" (focus)=\"toggleSearch(true)\" (blur)=\"toggleSearch(false)\"\r\n                (input)=\"onSearchChange()\" placeholder=\"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E/\u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D...\" #numberInput\r\n                [ngStyle]=\"{'width': inputWidth, 'background': bgColor, 'border': borderStyle, 'transition': 'all 0.3s ease'}\"\r\n                [ngClass]=\"{'search-expanded': isSearchOpen}\" />\r\n        </div>\r\n\r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\">\r\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 44.023 44.023\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\" enable-background=\"new 0 0 44.023 44.023\"\r\n                style=\"width: 15px;\">\r\n                <g>\r\n                    <g>\r\n                        <path\r\n                            d=\"m43.729,.29c-0.219-0.22-0.513-0.303-0.799-0.276h-41.831c-0.286-0.026-0.579,0.057-0.798,0.276-0.09,0.09-0.155,0.195-0.203,0.306-0.059,0.128-0.098,0.268-0.098,0.418 0,0.292 0.129,0.549 0.329,0.731l14.671,20.539v20.662c-0.008,0.152 0.015,0.304 0.077,0.446 0.149,0.364 0.505,0.621 0.923,0.621 0.303,0 0.565-0.142 0.749-0.354l11.98-11.953c0.227-0.227 0.307-0.533 0.271-0.828v-8.589l14.729-20.583c0.392-0.391 0.392-1.025 0-1.416zm-16.445,20.998c-0.209,0.209-0.298,0.485-0.284,0.759v8.553l-10,9.977v-18.53c0.014-0.273-0.075-0.55-0.284-0.759l-13.767-19.274h38.128l-13.793,19.274z\" />\r\n                    </g>\r\n                </g>\r\n            </svg>\r\n        </button>\r\n    </div>\r\n\r\n    <div *ngIf=\"isFilterOpen\" style=\"display: flex; gap: 10px;\">\r\n        <!-- \u0412\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0442\u0438\u043F\u043E\u0432 \u0444\u0438\u043B\u044C\u0442\u0440\u0430 -->\r\n        <div class=\"filter-dropdown\">\r\n            <div>\r\n                <label *ngFor=\"let filter of ['\u0420\u0430\u0432\u043D\u043E', '\u041C\u0435\u043D\u044C\u0448\u0435', '\u0411\u043E\u043B\u044C\u0448\u0435', '\u041C\u0435\u0436\u0434\u0443']\">\r\n                    <input type=\"radio\" [checked]=\"selectedFilter === filter\" (change)=\"onFilterChange(filter)\" />\r\n                    {{ filter }}\r\n                </label>\r\n            </div>\r\n\r\n            <!-- \u041F\u043E\u043B\u044F \u0434\u043B\u044F \u0432\u0432\u043E\u0434\u0430 \u0447\u0438\u0441\u0435\u043B -->\r\n            <div class=\"number-container\" *ngIf=\"showNumberInput\">\r\n                <ng-container [ngSwitch]=\"selectedFilter\">\r\n                    <!-- \u0420\u0430\u0432\u043D\u043E -->\r\n                    <div *ngSwitchCase=\"'\u0420\u0430\u0432\u043D\u043E'\">\r\n                        <input type=\"number\" [(ngModel)]=\"numberValue\" (change)=\"onNumberChange()\" #numberInput\r\n                            (click)=\"openNumberPicker(numberInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u041C\u0435\u043D\u044C\u0448\u0435 -->\r\n                    <div *ngSwitchCase=\"'\u041C\u0435\u043D\u044C\u0448\u0435'\">\r\n                        <input type=\"number\" [(ngModel)]=\"numberValue\" (change)=\"onNumberChange()\" #numberInput\r\n                            (click)=\"openNumberPicker(numberInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u0411\u043E\u043B\u044C\u0448\u0435 -->\r\n                    <div *ngSwitchCase=\"'\u0411\u043E\u043B\u044C\u0448\u0435'\">\r\n                        <input type=\"number\" [(ngModel)]=\"numberValue\" (change)=\"onNumberChange()\" #numberInput\r\n                            (click)=\"openNumberPicker(numberInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u041C\u0435\u0436\u0434\u0443 -->\r\n                    <div *ngSwitchCase=\"'\u041C\u0435\u0436\u0434\u0443'\">\r\n                        <input type=\"number\" [(ngModel)]=\"startNumber\" (change)=\"onNumberChange()\" #startNumberInput\r\n                            (click)=\"openNumberPicker(startNumberInput)\" />\r\n                        <span>\u043F\u043E</span>\r\n                        <input type=\"number\" [(ngModel)]=\"endNumber\" (change)=\"onNumberChange()\" #endNumberInput\r\n                            (click)=\"openNumberPicker(endNumberInput)\" />\r\n                    </div>\r\n                </ng-container>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438 -->\r\n    <button class=\"sort-btn\" (click)=\"toggleSort()\">\r\n        <svg *ngIf=\"sortOrder === 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M8,5.70710678 L8,19.508331 C8,19.7844734 7.77614237,20.008331 7.5,20.008331 C7.22385763,20.008331 7,19.7844734 7,19.508331 L7,5.70710678 L4.85355339,7.85355339 C4.65829124,8.04881554 4.34170876,8.04881554 4.14644661,7.85355339 C3.95118446,7.65829124 3.95118446,7.34170876 4.14644661,7.14644661 L7.14644661,4.14644661 C7.34170876,3.95118446 7.65829124,3.95118446 7.85355339,4.14644661 L10.8535534,7.14644661 C11.0488155,7.34170876 11.0488155,7.65829124 10.8535534,7.85355339 C10.6582912,8.04881554 10.3417088,8.04881554 10.1464466,7.85355339 L8,5.70710678 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n\r\n        <svg *ngIf=\"sortOrder != 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M6.90365714,19.8034496 C6.81268627,19.9276666 6.66576323,20.008331 6.5,20.008331 C6.33423677,20.008331 6.18731373,19.9276666 6.09634286,19.8034496 L3.14644661,16.8535534 C2.95118446,16.6582912 2.95118446,16.3417088 3.14644661,16.1464466 C3.34170876,15.9511845 3.65829124,15.9511845 3.85355339,16.1464466 L6,18.2928932 L6,4.5 C6,4.22385763 6.22385763,4 6.5,4 C6.77614237,4 7,4.22385763 7,4.5 L7,18.2928932 L9.14644661,16.1464466 C9.34170876,15.9511845 9.65829124,15.9511845 9.85355339,16.1464466 C10.0488155,16.3417088 10.0488155,16.6582912 9.85355339,16.8535534 L6.90365714,19.8034496 L6.90365714,19.8034496 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n    </button>\r\n\r\n</div>\r\n\r\n<button *ngIf=\"selectedFilter\" class=\"btn btn-clear-filter\" (click)=\"resetFilter()\">\r\n    \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\r\n</button>", styles: ["@charset \"UTF-8\";.number-filter-sort{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border-radius:8px;background:#f9f9f9;box-shadow:0 2px 8px #0000001a;position:relative}.number-box{display:flex;align-items:center;justify-content:space-between;position:relative}.number-box input{width:100%;padding:12px;font-size:14px;border:1px solid #ddd;border-radius:8px;background-color:#fafafa;color:#333;cursor:pointer;transition:all .3s ease}.number-box input:focus{border-color:#007bff;box-shadow:0 0 8px #007bff80}.filter-btn{right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:#666;transition:color .3s ease-in-out}.filter-btn:hover{color:#007bff}.filter-dropdown{margin-top:10px;background-color:#f7f7f7;border-radius:8px;box-shadow:0 4px 10px #0000001a;padding:15px;position:absolute;top:100%;left:0;width:280px;z-index:999;display:flex;flex-direction:row;gap:5px}.filter-dropdown label{display:flex;align-items:center;font-size:14px;padding:8px;cursor:pointer;transition:background-color .3s ease;border-radius:5px;color:#101010}.filter-dropdown label:hover{background-color:#e9ecef}.number-container{display:flex;flex-direction:column;gap:12px}.number-container input[type=number]{width:100%;padding:12px;font-size:14px;border:1px solid #ddd;border-radius:8px;background-color:#fafafa;color:#333;cursor:pointer;transition:all .3s ease}.number-container input[type=number]:focus{border-color:#007bff;box-shadow:0 0 8px #007bff80}.number-container span{font-size:14px;font-weight:700;text-align:center}.sort-btn{background:transparent;border:none;border-radius:6px;padding:4px;font-size:16px;cursor:pointer;color:#666;transition:all .3s ease-in-out;margin-left:8px}.sort-btn:hover{background:#007bff36;color:#fff}@media (max-width: 600px){.number-filter-sort{padding:15px;margin:10px}.number-box input,.number-container input[type=number],.sort-btn,.filter-btn{font-size:16px;padding:12px}.filter-dropdown{padding:12px}.filter-dropdown label{padding:10px}}.btn-reset{background-color:#f0f0f0;border:none;padding:5px 10px;font-size:12px;cursor:pointer}.btn-reset:hover{background-color:#e0e0e0}.btn-clear-filter{padding:5px;background:transparent;color:#1b506a;font-size:13px;border:none;margin-top:10px}.input-container{position:relative;width:100%}.input-container svg{position:absolute;left:10px;top:50%;transform:translateY(-50%)}.input-container input{padding-left:30px}input{color:#101010}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: NumberFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-number-filter', imports: [CommonModule, FormsModule], standalone: true, template: "<div class=\"number-filter-sort\">\r\n    <!-- \u041F\u043E\u043B\u0435 \u0434\u043B\u044F \u0432\u044B\u0431\u043E\u0440\u0430 \u0447\u0438\u0441\u043B\u0430 -->\r\n    <!-- <div class=\"number-box\">\r\n        <input type=\"text\" [(ngModel)]=\"selectedNumber\" (focus)=\"toggleFilter()\"\r\n            placeholder=\"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E/\u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D...\" readonly #numberInput />\r\n\r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\">\u25BC</button>\r\n    </div> -->\r\n\r\n    <div class=\"number-box\">\r\n        <div class=\"input-container\" (click)=\"toggleSearch(true)\">\r\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"\r\n                (click)=\"toggleSearch(true)\">\r\n                <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\r\n                    d=\"M9.591 9.591a4 4 0 10-5.657-5.657 4 4 0 005.657 5.657zm1.06-6.717a5.502 5.502 0 01.915 6.57l2.732 2.733a1.5 1.5 0 11-2.121 2.12l-2.732-2.73a5.5 5.5 0 111.207-8.692z\"\r\n                    fill=\"#000\"></path>\r\n            </svg>\r\n            <input type=\"text\" [(ngModel)]=\"selectedNumber\" (focus)=\"toggleSearch(true)\" (blur)=\"toggleSearch(false)\"\r\n                (input)=\"onSearchChange()\" placeholder=\"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0447\u0438\u0441\u043B\u043E/\u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D...\" #numberInput\r\n                [ngStyle]=\"{'width': inputWidth, 'background': bgColor, 'border': borderStyle, 'transition': 'all 0.3s ease'}\"\r\n                [ngClass]=\"{'search-expanded': isSearchOpen}\" />\r\n        </div>\r\n\r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\">\r\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 44.023 44.023\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\" enable-background=\"new 0 0 44.023 44.023\"\r\n                style=\"width: 15px;\">\r\n                <g>\r\n                    <g>\r\n                        <path\r\n                            d=\"m43.729,.29c-0.219-0.22-0.513-0.303-0.799-0.276h-41.831c-0.286-0.026-0.579,0.057-0.798,0.276-0.09,0.09-0.155,0.195-0.203,0.306-0.059,0.128-0.098,0.268-0.098,0.418 0,0.292 0.129,0.549 0.329,0.731l14.671,20.539v20.662c-0.008,0.152 0.015,0.304 0.077,0.446 0.149,0.364 0.505,0.621 0.923,0.621 0.303,0 0.565-0.142 0.749-0.354l11.98-11.953c0.227-0.227 0.307-0.533 0.271-0.828v-8.589l14.729-20.583c0.392-0.391 0.392-1.025 0-1.416zm-16.445,20.998c-0.209,0.209-0.298,0.485-0.284,0.759v8.553l-10,9.977v-18.53c0.014-0.273-0.075-0.55-0.284-0.759l-13.767-19.274h38.128l-13.793,19.274z\" />\r\n                    </g>\r\n                </g>\r\n            </svg>\r\n        </button>\r\n    </div>\r\n\r\n    <div *ngIf=\"isFilterOpen\" style=\"display: flex; gap: 10px;\">\r\n        <!-- \u0412\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0442\u0438\u043F\u043E\u0432 \u0444\u0438\u043B\u044C\u0442\u0440\u0430 -->\r\n        <div class=\"filter-dropdown\">\r\n            <div>\r\n                <label *ngFor=\"let filter of ['\u0420\u0430\u0432\u043D\u043E', '\u041C\u0435\u043D\u044C\u0448\u0435', '\u0411\u043E\u043B\u044C\u0448\u0435', '\u041C\u0435\u0436\u0434\u0443']\">\r\n                    <input type=\"radio\" [checked]=\"selectedFilter === filter\" (change)=\"onFilterChange(filter)\" />\r\n                    {{ filter }}\r\n                </label>\r\n            </div>\r\n\r\n            <!-- \u041F\u043E\u043B\u044F \u0434\u043B\u044F \u0432\u0432\u043E\u0434\u0430 \u0447\u0438\u0441\u0435\u043B -->\r\n            <div class=\"number-container\" *ngIf=\"showNumberInput\">\r\n                <ng-container [ngSwitch]=\"selectedFilter\">\r\n                    <!-- \u0420\u0430\u0432\u043D\u043E -->\r\n                    <div *ngSwitchCase=\"'\u0420\u0430\u0432\u043D\u043E'\">\r\n                        <input type=\"number\" [(ngModel)]=\"numberValue\" (change)=\"onNumberChange()\" #numberInput\r\n                            (click)=\"openNumberPicker(numberInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u041C\u0435\u043D\u044C\u0448\u0435 -->\r\n                    <div *ngSwitchCase=\"'\u041C\u0435\u043D\u044C\u0448\u0435'\">\r\n                        <input type=\"number\" [(ngModel)]=\"numberValue\" (change)=\"onNumberChange()\" #numberInput\r\n                            (click)=\"openNumberPicker(numberInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u0411\u043E\u043B\u044C\u0448\u0435 -->\r\n                    <div *ngSwitchCase=\"'\u0411\u043E\u043B\u044C\u0448\u0435'\">\r\n                        <input type=\"number\" [(ngModel)]=\"numberValue\" (change)=\"onNumberChange()\" #numberInput\r\n                            (click)=\"openNumberPicker(numberInput)\" />\r\n                    </div>\r\n\r\n                    <!-- \u041C\u0435\u0436\u0434\u0443 -->\r\n                    <div *ngSwitchCase=\"'\u041C\u0435\u0436\u0434\u0443'\">\r\n                        <input type=\"number\" [(ngModel)]=\"startNumber\" (change)=\"onNumberChange()\" #startNumberInput\r\n                            (click)=\"openNumberPicker(startNumberInput)\" />\r\n                        <span>\u043F\u043E</span>\r\n                        <input type=\"number\" [(ngModel)]=\"endNumber\" (change)=\"onNumberChange()\" #endNumberInput\r\n                            (click)=\"openNumberPicker(endNumberInput)\" />\r\n                    </div>\r\n                </ng-container>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438 -->\r\n    <button class=\"sort-btn\" (click)=\"toggleSort()\">\r\n        <svg *ngIf=\"sortOrder === 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M8,5.70710678 L8,19.508331 C8,19.7844734 7.77614237,20.008331 7.5,20.008331 C7.22385763,20.008331 7,19.7844734 7,19.508331 L7,5.70710678 L4.85355339,7.85355339 C4.65829124,8.04881554 4.34170876,8.04881554 4.14644661,7.85355339 C3.95118446,7.65829124 3.95118446,7.34170876 4.14644661,7.14644661 L7.14644661,4.14644661 C7.34170876,3.95118446 7.65829124,3.95118446 7.85355339,4.14644661 L10.8535534,7.14644661 C11.0488155,7.34170876 11.0488155,7.65829124 10.8535534,7.85355339 C10.6582912,8.04881554 10.3417088,8.04881554 10.1464466,7.85355339 L8,5.70710678 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n\r\n        <svg *ngIf=\"sortOrder != 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M6.90365714,19.8034496 C6.81268627,19.9276666 6.66576323,20.008331 6.5,20.008331 C6.33423677,20.008331 6.18731373,19.9276666 6.09634286,19.8034496 L3.14644661,16.8535534 C2.95118446,16.6582912 2.95118446,16.3417088 3.14644661,16.1464466 C3.34170876,15.9511845 3.65829124,15.9511845 3.85355339,16.1464466 L6,18.2928932 L6,4.5 C6,4.22385763 6.22385763,4 6.5,4 C6.77614237,4 7,4.22385763 7,4.5 L7,18.2928932 L9.14644661,16.1464466 C9.34170876,15.9511845 9.65829124,15.9511845 9.85355339,16.1464466 C10.0488155,16.3417088 10.0488155,16.6582912 9.85355339,16.8535534 L6.90365714,19.8034496 L6.90365714,19.8034496 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n    </button>\r\n\r\n</div>\r\n\r\n<button *ngIf=\"selectedFilter\" class=\"btn btn-clear-filter\" (click)=\"resetFilter()\">\r\n    \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\r\n</button>", styles: ["@charset \"UTF-8\";.number-filter-sort{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border-radius:8px;background:#f9f9f9;box-shadow:0 2px 8px #0000001a;position:relative}.number-box{display:flex;align-items:center;justify-content:space-between;position:relative}.number-box input{width:100%;padding:12px;font-size:14px;border:1px solid #ddd;border-radius:8px;background-color:#fafafa;color:#333;cursor:pointer;transition:all .3s ease}.number-box input:focus{border-color:#007bff;box-shadow:0 0 8px #007bff80}.filter-btn{right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:#666;transition:color .3s ease-in-out}.filter-btn:hover{color:#007bff}.filter-dropdown{margin-top:10px;background-color:#f7f7f7;border-radius:8px;box-shadow:0 4px 10px #0000001a;padding:15px;position:absolute;top:100%;left:0;width:280px;z-index:999;display:flex;flex-direction:row;gap:5px}.filter-dropdown label{display:flex;align-items:center;font-size:14px;padding:8px;cursor:pointer;transition:background-color .3s ease;border-radius:5px;color:#101010}.filter-dropdown label:hover{background-color:#e9ecef}.number-container{display:flex;flex-direction:column;gap:12px}.number-container input[type=number]{width:100%;padding:12px;font-size:14px;border:1px solid #ddd;border-radius:8px;background-color:#fafafa;color:#333;cursor:pointer;transition:all .3s ease}.number-container input[type=number]:focus{border-color:#007bff;box-shadow:0 0 8px #007bff80}.number-container span{font-size:14px;font-weight:700;text-align:center}.sort-btn{background:transparent;border:none;border-radius:6px;padding:4px;font-size:16px;cursor:pointer;color:#666;transition:all .3s ease-in-out;margin-left:8px}.sort-btn:hover{background:#007bff36;color:#fff}@media (max-width: 600px){.number-filter-sort{padding:15px;margin:10px}.number-box input,.number-container input[type=number],.sort-btn,.filter-btn{font-size:16px;padding:12px}.filter-dropdown{padding:12px}.filter-dropdown label{padding:10px}}.btn-reset{background-color:#f0f0f0;border:none;padding:5px 10px;font-size:12px;cursor:pointer}.btn-reset:hover{background-color:#e0e0e0}.btn-clear-filter{padding:5px;background:transparent;color:#1b506a;font-size:13px;border:none;margin-top:10px}.input-container{position:relative;width:100%}.input-container svg{position:absolute;left:10px;top:50%;transform:translateY(-50%)}.input-container input{padding-left:30px}input{color:#101010}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { filterField: [{
                type: Input
            }], filterChange: [{
                type: Output
            }], sortChange: [{
                type: Output
            }], onClickOutside: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });

class SearchFilterSortComponent {
    elementRef;
    filterField = ''; // Название поля для фильтрации
    filterType = 0; // Тип фильтрации (0 - string, 1 - int и т.д.)
    isVisibleFilter = true;
    searchTerm = '';
    selectedFilters = []; // Используем any, так как фильтры могут быть разных типов
    sortOrder = 'asc';
    isFilterOpen = false;
    filterChange = new EventEmitter();
    sortChange = new EventEmitter();
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    toggleFilter() {
        this.isFilterOpen = !this.isFilterOpen;
    }
    inputWidth = '30px';
    bgColor = 'transparent';
    borderStyle = 'none';
    isSearchOpen = false;
    toggleSearch(isFocused) {
        if (isFocused) {
            this.inputWidth = '200px';
            this.bgColor = '#ffffff';
            this.borderStyle = '1px solid #007BFF';
            this.isSearchOpen = true;
        }
        else {
            setTimeout(() => {
                this.inputWidth = '30px';
                this.bgColor = 'transparent';
                this.borderStyle = 'none';
                this.isSearchOpen = false;
            }, 200);
        }
    }
    onSearchChange() {
        const filterDto = {
            field: this.filterField,
            values: this.searchTerm ? [this.searchTerm] : [],
            type: 0
        };
        this.filterChange.emit(filterDto);
    }
    onFilterChange(value) {
        if (this.selectedFilters.includes(value)) {
            this.selectedFilters = this.selectedFilters.filter(f => f !== value);
        }
        else {
            this.selectedFilters.push(value);
        }
        const filterDto = {
            field: this.filterField,
            values: this.selectedFilters,
            type: this.filterType
        };
        this.filterChange.emit(filterDto);
    }
    toggleSort() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        const sortDto = {
            field: this.filterField,
            sortType: this.sortOrder === 'asc' ? 0 : 1
        };
        this.sortChange.emit(sortDto);
    }
    resetFilter() {
        this.selectedFilters = []; // Очищаем выбранные фильтры
        const filterDto = {
            field: this.filterField,
            values: [],
            type: this.filterType
        };
        this.filterChange.emit(filterDto);
    }
    onClickOutside(event) {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isFilterOpen = false;
        }
        if (!clickedInside && this.inputWidth != '30px') {
            this.inputWidth = '30px';
            this.bgColor = 'transparent';
            this.borderStyle = 'none';
            this.isSearchOpen = false;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: SearchFilterSortComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: SearchFilterSortComponent, isStandalone: true, selector: "app-search-filter-sort", inputs: { filterField: "filterField", filterType: "filterType", isVisibleFilter: "isVisibleFilter" }, outputs: { filterChange: "filterChange", sortChange: "sortChange" }, host: { listeners: { "document:click": "onClickOutside($event)" } }, ngImport: i0, template: "<div class=\"search-filter-sort\">\r\n    <!-- \u041F\u043E\u043B\u0435 \u043F\u043E\u0438\u0441\u043A\u0430 -->\r\n    <div class=\"search-box\">\r\n        <div class=\"input-container\" (click)=\"toggleSearch(true)\">\r\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"\r\n                (click)=\"toggleSearch(true)\">\r\n                <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\r\n                    d=\"M9.591 9.591a4 4 0 10-5.657-5.657 4 4 0 005.657 5.657zm1.06-6.717a5.502 5.502 0 01.915 6.57l2.732 2.733a1.5 1.5 0 11-2.121 2.12l-2.732-2.73a5.5 5.5 0 111.207-8.692z\"\r\n                    fill=\"#000\"></path>\r\n            </svg>\r\n            <input type=\"text\" [(ngModel)]=\"searchTerm\" (focus)=\"toggleSearch(true)\" (blur)=\"toggleSearch(false)\"\r\n                (input)=\"onSearchChange()\" placeholder=\"\u041F\u043E\u0438\u0441\u043A...\" #numberInput\r\n                [ngStyle]=\"{'width': inputWidth, 'background': bgColor, 'border': borderStyle, 'transition': 'all 0.3s ease'}\"\r\n                [ngClass]=\"{'search-expanded': isSearchOpen}\" />\r\n        </div>\r\n\r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\" *ngIf=\"isVisibleFilter\">\r\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 44.023 44.023\"\r\n            xmlns:xlink=\"http://www.w3.org/1999/xlink\" enable-background=\"new 0 0 44.023 44.023\"\r\n            style=\"width: 15px;\">\r\n            <g>\r\n                <g>\r\n                    <path\r\n                        d=\"m43.729,.29c-0.219-0.22-0.513-0.303-0.799-0.276h-41.831c-0.286-0.026-0.579,0.057-0.798,0.276-0.09,0.09-0.155,0.195-0.203,0.306-0.059,0.128-0.098,0.268-0.098,0.418 0,0.292 0.129,0.549 0.329,0.731l14.671,20.539v20.662c-0.008,0.152 0.015,0.304 0.077,0.446 0.149,0.364 0.505,0.621 0.923,0.621 0.303,0 0.565-0.142 0.749-0.354l11.98-11.953c0.227-0.227 0.307-0.533 0.271-0.828v-8.589l14.729-20.583c0.392-0.391 0.392-1.025 0-1.416zm-16.445,20.998c-0.209,0.209-0.298,0.485-0.284,0.759v8.553l-10,9.977v-18.53c0.014-0.273-0.075-0.55-0.284-0.759l-13.767-19.274h38.128l-13.793,19.274z\" />\r\n                </g>\r\n            </g>\r\n        </svg>\r\n        </button>\r\n    </div>\r\n\r\n    <!-- \u0412\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432 -->\r\n    <div class=\"filter-dropdown\" *ngIf=\"isFilterOpen\">\r\n        <label *ngFor=\"let filter of ['Category A', 'Category B', 'Category C']\">\r\n            <input type=\"checkbox\" [checked]=\"selectedFilters.includes(filter)\" (change)=\"onFilterChange(filter)\" />\r\n            {{ filter }}\r\n        </label>\r\n    </div>\r\n\r\n    <!-- \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438 -->\r\n    <button class=\"sort-btn\" (click)=\"toggleSort()\">\r\n        <svg *ngIf=\"sortOrder === 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path d=\"M8,5.70710678 L8,19.508331 C8,19.7844734 7.77614237,20.008331 7.5,20.008331 C7.22385763,20.008331 7,19.7844734 7,19.508331 L7,5.70710678 L4.85355339,7.85355339 C4.65829124,8.04881554 4.34170876,8.04881554 4.14644661,7.85355339 C3.95118446,7.65829124 3.95118446,7.34170876 4.14644661,7.14644661 L7.14644661,4.14644661 C7.34170876,3.95118446 7.65829124,3.95118446 7.85355339,4.14644661 L10.8535534,7.14644661 C11.0488155,7.34170876 11.0488155,7.65829124 10.8535534,7.85355339 C10.6582912,8.04881554 10.3417088,8.04881554 10.1464466,7.85355339 L8,5.70710678 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\"/>\r\n          </svg>\r\n    \r\n          <svg *ngIf=\"sortOrder != 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path d=\"M6.90365714,19.8034496 C6.81268627,19.9276666 6.66576323,20.008331 6.5,20.008331 C6.33423677,20.008331 6.18731373,19.9276666 6.09634286,19.8034496 L3.14644661,16.8535534 C2.95118446,16.6582912 2.95118446,16.3417088 3.14644661,16.1464466 C3.34170876,15.9511845 3.65829124,15.9511845 3.85355339,16.1464466 L6,18.2928932 L6,4.5 C6,4.22385763 6.22385763,4 6.5,4 C6.77614237,4 7,4.22385763 7,4.5 L7,18.2928932 L9.14644661,16.1464466 C9.34170876,15.9511845 9.65829124,15.9511845 9.85355339,16.1464466 C10.0488155,16.3417088 10.0488155,16.6582912 9.85355339,16.8535534 L6.90365714,19.8034496 L6.90365714,19.8034496 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\"/>\r\n          </svg>\r\n    </button>\r\n\r\n  \r\n      \r\n      \r\n\r\n</div>\r\n\r\n<button *ngIf=\"selectedFilters && selectedFilters.length > 0\" class=\"btn btn-clear-filter\" (click)=\"resetFilter()\">\r\n    \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\r\n</button>", styles: ["@charset \"UTF-8\";.search-filter-sort{display:flex;align-items:center;width:100%;padding:8px;border-radius:8px;background:#f9f9f9;box-shadow:0 2px 8px #0000001a;position:relative}.search-box{position:relative;display:flex;align-items:center;flex:1}input{width:100%;padding:10px 40px 10px 12px;border-radius:6px;font-size:14px;transition:all .3s ease-in-out;outline:none}input:focus{border-color:#007bff;box-shadow:0 0 4px #007bff4d}.filter-btn{position:absolute;right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:#666;transition:color .3s ease-in-out}.filter-btn:hover{color:#007bff}.filter-dropdown{position:absolute;align-items:flex-start;top:100%;left:0;width:100%;background:#fff;border-radius:6px;box-shadow:0 4px 12px #0000001a;padding:10px;display:flex;flex-direction:column;gap:6px;border:1px solid #ddd;z-index:100}.filter-dropdown label{display:flex;align-items:center;font-size:14px;color:#333;cursor:pointer}.filter-dropdown input{margin-right:8px;cursor:pointer}.sort-btn{background:transparent;border:none;border-radius:6px;padding:4px;font-size:16px;cursor:pointer;color:#666;transition:all .3s ease-in-out;margin-left:8px}.sort-btn:hover{background:#007bff36;color:#fff}.btn-reset{background-color:#f0f0f0;border:none;padding:5px 10px;font-size:12px;cursor:pointer}.btn-reset:hover{background-color:#e0e0e0}.btn-clear-filter{padding:5px;background:transparent;color:#1b506a;font-size:13px;border:none;margin-top:10px}.input-container{position:relative;width:100%}.input-container svg{position:absolute;left:10px;top:50%;transform:translateY(-50%)}.input-container input{padding-left:30px}input{color:#101010}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: SearchFilterSortComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-search-filter-sort', standalone: true, imports: [CommonModule, FormsModule], template: "<div class=\"search-filter-sort\">\r\n    <!-- \u041F\u043E\u043B\u0435 \u043F\u043E\u0438\u0441\u043A\u0430 -->\r\n    <div class=\"search-box\">\r\n        <div class=\"input-container\" (click)=\"toggleSearch(true)\">\r\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"\r\n                (click)=\"toggleSearch(true)\">\r\n                <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\r\n                    d=\"M9.591 9.591a4 4 0 10-5.657-5.657 4 4 0 005.657 5.657zm1.06-6.717a5.502 5.502 0 01.915 6.57l2.732 2.733a1.5 1.5 0 11-2.121 2.12l-2.732-2.73a5.5 5.5 0 111.207-8.692z\"\r\n                    fill=\"#000\"></path>\r\n            </svg>\r\n            <input type=\"text\" [(ngModel)]=\"searchTerm\" (focus)=\"toggleSearch(true)\" (blur)=\"toggleSearch(false)\"\r\n                (input)=\"onSearchChange()\" placeholder=\"\u041F\u043E\u0438\u0441\u043A...\" #numberInput\r\n                [ngStyle]=\"{'width': inputWidth, 'background': bgColor, 'border': borderStyle, 'transition': 'all 0.3s ease'}\"\r\n                [ngClass]=\"{'search-expanded': isSearchOpen}\" />\r\n        </div>\r\n\r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\" *ngIf=\"isVisibleFilter\">\r\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 44.023 44.023\"\r\n            xmlns:xlink=\"http://www.w3.org/1999/xlink\" enable-background=\"new 0 0 44.023 44.023\"\r\n            style=\"width: 15px;\">\r\n            <g>\r\n                <g>\r\n                    <path\r\n                        d=\"m43.729,.29c-0.219-0.22-0.513-0.303-0.799-0.276h-41.831c-0.286-0.026-0.579,0.057-0.798,0.276-0.09,0.09-0.155,0.195-0.203,0.306-0.059,0.128-0.098,0.268-0.098,0.418 0,0.292 0.129,0.549 0.329,0.731l14.671,20.539v20.662c-0.008,0.152 0.015,0.304 0.077,0.446 0.149,0.364 0.505,0.621 0.923,0.621 0.303,0 0.565-0.142 0.749-0.354l11.98-11.953c0.227-0.227 0.307-0.533 0.271-0.828v-8.589l14.729-20.583c0.392-0.391 0.392-1.025 0-1.416zm-16.445,20.998c-0.209,0.209-0.298,0.485-0.284,0.759v8.553l-10,9.977v-18.53c0.014-0.273-0.075-0.55-0.284-0.759l-13.767-19.274h38.128l-13.793,19.274z\" />\r\n                </g>\r\n            </g>\r\n        </svg>\r\n        </button>\r\n    </div>\r\n\r\n    <!-- \u0412\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432 -->\r\n    <div class=\"filter-dropdown\" *ngIf=\"isFilterOpen\">\r\n        <label *ngFor=\"let filter of ['Category A', 'Category B', 'Category C']\">\r\n            <input type=\"checkbox\" [checked]=\"selectedFilters.includes(filter)\" (change)=\"onFilterChange(filter)\" />\r\n            {{ filter }}\r\n        </label>\r\n    </div>\r\n\r\n    <!-- \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438 -->\r\n    <button class=\"sort-btn\" (click)=\"toggleSort()\">\r\n        <svg *ngIf=\"sortOrder === 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path d=\"M8,5.70710678 L8,19.508331 C8,19.7844734 7.77614237,20.008331 7.5,20.008331 C7.22385763,20.008331 7,19.7844734 7,19.508331 L7,5.70710678 L4.85355339,7.85355339 C4.65829124,8.04881554 4.34170876,8.04881554 4.14644661,7.85355339 C3.95118446,7.65829124 3.95118446,7.34170876 4.14644661,7.14644661 L7.14644661,4.14644661 C7.34170876,3.95118446 7.65829124,3.95118446 7.85355339,4.14644661 L10.8535534,7.14644661 C11.0488155,7.34170876 11.0488155,7.65829124 10.8535534,7.85355339 C10.6582912,8.04881554 10.3417088,8.04881554 10.1464466,7.85355339 L8,5.70710678 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\"/>\r\n          </svg>\r\n    \r\n          <svg *ngIf=\"sortOrder != 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path d=\"M6.90365714,19.8034496 C6.81268627,19.9276666 6.66576323,20.008331 6.5,20.008331 C6.33423677,20.008331 6.18731373,19.9276666 6.09634286,19.8034496 L3.14644661,16.8535534 C2.95118446,16.6582912 2.95118446,16.3417088 3.14644661,16.1464466 C3.34170876,15.9511845 3.65829124,15.9511845 3.85355339,16.1464466 L6,18.2928932 L6,4.5 C6,4.22385763 6.22385763,4 6.5,4 C6.77614237,4 7,4.22385763 7,4.5 L7,18.2928932 L9.14644661,16.1464466 C9.34170876,15.9511845 9.65829124,15.9511845 9.85355339,16.1464466 C10.0488155,16.3417088 10.0488155,16.6582912 9.85355339,16.8535534 L6.90365714,19.8034496 L6.90365714,19.8034496 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\"/>\r\n          </svg>\r\n    </button>\r\n\r\n  \r\n      \r\n      \r\n\r\n</div>\r\n\r\n<button *ngIf=\"selectedFilters && selectedFilters.length > 0\" class=\"btn btn-clear-filter\" (click)=\"resetFilter()\">\r\n    \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\r\n</button>", styles: ["@charset \"UTF-8\";.search-filter-sort{display:flex;align-items:center;width:100%;padding:8px;border-radius:8px;background:#f9f9f9;box-shadow:0 2px 8px #0000001a;position:relative}.search-box{position:relative;display:flex;align-items:center;flex:1}input{width:100%;padding:10px 40px 10px 12px;border-radius:6px;font-size:14px;transition:all .3s ease-in-out;outline:none}input:focus{border-color:#007bff;box-shadow:0 0 4px #007bff4d}.filter-btn{position:absolute;right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:#666;transition:color .3s ease-in-out}.filter-btn:hover{color:#007bff}.filter-dropdown{position:absolute;align-items:flex-start;top:100%;left:0;width:100%;background:#fff;border-radius:6px;box-shadow:0 4px 12px #0000001a;padding:10px;display:flex;flex-direction:column;gap:6px;border:1px solid #ddd;z-index:100}.filter-dropdown label{display:flex;align-items:center;font-size:14px;color:#333;cursor:pointer}.filter-dropdown input{margin-right:8px;cursor:pointer}.sort-btn{background:transparent;border:none;border-radius:6px;padding:4px;font-size:16px;cursor:pointer;color:#666;transition:all .3s ease-in-out;margin-left:8px}.sort-btn:hover{background:#007bff36;color:#fff}.btn-reset{background-color:#f0f0f0;border:none;padding:5px 10px;font-size:12px;cursor:pointer}.btn-reset:hover{background-color:#e0e0e0}.btn-clear-filter{padding:5px;background:transparent;color:#1b506a;font-size:13px;border:none;margin-top:10px}.input-container{position:relative;width:100%}.input-container svg{position:absolute;left:10px;top:50%;transform:translateY(-50%)}.input-container input{padding-left:30px}input{color:#101010}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { filterField: [{
                type: Input
            }], filterType: [{
                type: Input
            }], isVisibleFilter: [{
                type: Input
            }], filterChange: [{
                type: Output
            }], sortChange: [{
                type: Output
            }], onClickOutside: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });

class UuidSearchFilterSortService {
    http;
    domain = '';
    cache = new Map();
    constructor(http) {
        this.http = http;
    }
    getProductsByEndpoint(endpoint) {
        const cached = this.cache.get(endpoint);
        if (cached) {
            return new Observable(observer => {
                observer.next(cached);
                observer.complete();
            });
        }
        const token = localStorage.getItem('YXV0aFRva2Vu');
        return new Observable(observer => {
            this.http.post(`${this.domain}${endpoint}`, { filters: [], sorts: [] }, {
                headers: new HttpHeaders({
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }),
            }).subscribe((response) => {
                const data = response.data;
                this.cache.set(endpoint, data);
                observer.next(data);
                observer.complete();
            }, (error) => {
                observer.error(error);
            });
        });
    }
    clearCacheForEndpoint(endpoint) {
        this.cache.delete(endpoint);
    }
    clearAllCache() {
        this.cache.clear();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UuidSearchFilterSortService, deps: [{ token: i1$1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UuidSearchFilterSortService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UuidSearchFilterSortService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1$1.HttpClient }] });

class UuidSearchFilterSortComponent {
    uuidSearchFilterSortService;
    elementRef;
    filterField = ''; // Название поля для фильтрации
    filterType = 0; // Тип фильтрации (0 - string, 1 - int и т.д.)
    searchField = '';
    apiEndpoint = ''; // Эндпоинт для запроса
    fieldNames = ''; // Массив полей для отображения в выпадающем списке
    Field = '';
    enam;
    domain = '';
    searchTerm = '';
    selectedFilters = [];
    sortOrder = 'asc';
    isFilterOpen = false;
    filterChange = new EventEmitter();
    sortChange = new EventEmitter();
    products = [];
    endpointDataLoaded = false;
    constructor(uuidSearchFilterSortService, elementRef) {
        this.uuidSearchFilterSortService = uuidSearchFilterSortService;
        this.elementRef = elementRef;
    }
    inputWidth = '30px';
    bgColor = 'transparent';
    borderStyle = 'none';
    isSearchOpen = false;
    toggleSearch(isFocused) {
        if (isFocused) {
            this.inputWidth = '200px';
            this.bgColor = '#ffffff';
            this.borderStyle = '1px solid #007BFF';
            this.isSearchOpen = true;
        }
        else {
            setTimeout(() => {
                this.inputWidth = '30px';
                this.bgColor = 'transparent';
                this.borderStyle = 'none';
                this.isSearchOpen = false;
            }, 200);
        }
    }
    ngOnChanges() {
        console.log('apiEndpointapiEndpoint', this.apiEndpoint);
        if (this.apiEndpoint && !this.endpointDataLoaded && this.enam == null) {
            this.uuidSearchFilterSortService.domain = this.domain;
            this.loadData();
        }
        if (this.enam != null) {
            this.products = this.enam;
            this.endpointDataLoaded = true;
        }
    }
    loadData() {
        this.uuidSearchFilterSortService.getProductsByEndpoint(this.apiEndpoint).subscribe((data) => {
            console.log('datdatadatadataa', data);
            this.products = data.data;
            this.endpointDataLoaded = true;
            console.log('Данные получены с эндпоинта:', this.products);
        }, (error) => {
            console.error('Ошибка загрузки данных с эндпоинта:', error);
        });
    }
    toggleFilter() {
        this.isFilterOpen = !this.isFilterOpen;
    }
    onSearchChange() {
        const filterDto = {
            field: this.searchField || this.Field,
            values: this.searchTerm ? [this.searchTerm] : [],
            type: 0
        };
        this.filterChange.emit(filterDto);
    }
    onFilterChange(id) {
        // Проверяем, выбран ли продукт, и добавляем/удаляем его из списка фильтров
        if (this.selectedFilters.includes(id)) {
            this.selectedFilters = this.selectedFilters.filter(selectedId => selectedId !== id);
        }
        else {
            this.selectedFilters.push(id);
        }
        // Создаем объект фильтра для передачи в родительский компонент
        const filterDto = {
            field: this.Field,
            values: this.selectedFilters,
            type: this.filterType
        };
        // Эмитируем изменение фильтра
        this.filterChange.emit(filterDto);
    }
    toggleSort() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        const sortDto = {
            field: this.Field,
            sortType: this.sortOrder === 'asc' ? 0 : 1
        };
        this.sortChange.emit(sortDto);
    }
    getDisplayText(field) {
        // Функция для формирования строки для отображения на основе полей
        return field.split(',').join(' ');
    }
    resetFilter() {
        this.selectedFilters = []; // Очищаем выбранные фильтры
        const filterDto = {
            field: this.filterField,
            values: [],
            type: this.filterType
        };
        this.filterChange.emit(filterDto);
    }
    onClickOutside(event) {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.isFilterOpen = false;
        }
        if (!clickedInside && this.inputWidth != '30px') {
            this.inputWidth = '30px';
            this.bgColor = 'transparent';
            this.borderStyle = 'none';
            this.isSearchOpen = false;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UuidSearchFilterSortComponent, deps: [{ token: UuidSearchFilterSortService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: UuidSearchFilterSortComponent, isStandalone: true, selector: "app-uuid-search-filter-sort", inputs: { filterField: "filterField", filterType: "filterType", searchField: "searchField", apiEndpoint: "apiEndpoint", fieldNames: "fieldNames", Field: "Field", enam: "enam", domain: "domain" }, outputs: { filterChange: "filterChange", sortChange: "sortChange" }, host: { listeners: { "document:click": "onClickOutside($event)" } }, usesOnChanges: true, ngImport: i0, template: "<div class=\"search-filter-sort\">\r\n    <!-- \u041F\u043E\u043B\u0435 \u043F\u043E\u0438\u0441\u043A\u0430 -->\r\n    <div class=\"search-box\">\r\n        <svg width=\"20\" height=\"20\"  viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\" (click)=\"toggleSearch(true)\">\r\n            <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\r\n                d=\"M9.591 9.591a4 4 0 10-5.657-5.657 4 4 0 005.657 5.657zm1.06-6.717a5.502 5.502 0 01.915 6.57l2.732 2.733a1.5 1.5 0 11-2.121 2.12l-2.732-2.73a5.5 5.5 0 111.207-8.692z\"\r\n                fill=\"#000\"></path>\r\n        </svg>\r\n        <input type=\"text\" [(ngModel)]=\"searchTerm\" (input)=\"onSearchChange()\" placeholder=\"\u041F\u043E\u0438\u0441\u043A...\"\r\n            style=\"width: 100%;\" \r\n            [ngStyle]=\"{'width': inputWidth, 'background': bgColor, 'border': borderStyle, 'transition': 'all 0.3s ease'}\"\r\n            [ngClass]=\"{'search-expanded': isSearchOpen}\"/>\r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\">\r\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 44.023 44.023\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\" enable-background=\"new 0 0 44.023 44.023\"\r\n                style=\"width: 15px;\">\r\n                <g>\r\n                    <g>\r\n                        <path\r\n                            d=\"m43.729,.29c-0.219-0.22-0.513-0.303-0.799-0.276h-41.831c-0.286-0.026-0.579,0.057-0.798,0.276-0.09,0.09-0.155,0.195-0.203,0.306-0.059,0.128-0.098,0.268-0.098,0.418 0,0.292 0.129,0.549 0.329,0.731l14.671,20.539v20.662c-0.008,0.152 0.015,0.304 0.077,0.446 0.149,0.364 0.505,0.621 0.923,0.621 0.303,0 0.565-0.142 0.749-0.354l11.98-11.953c0.227-0.227 0.307-0.533 0.271-0.828v-8.589l14.729-20.583c0.392-0.391 0.392-1.025 0-1.416zm-16.445,20.998c-0.209,0.209-0.298,0.485-0.284,0.759v8.553l-10,9.977v-18.53c0.014-0.273-0.075-0.55-0.284-0.759l-13.767-19.274h38.128l-13.793,19.274z\" />\r\n                    </g>\r\n                </g>\r\n            </svg>\r\n        </button>\r\n    </div>\r\n\r\n\r\n\r\n    <!-- \u0412\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432 -->\r\n    <div class=\"filter-dropdown\" *ngIf=\"isFilterOpen\">\r\n        <label *ngFor=\"let item of products\">\r\n            <input type=\"checkbox\" [checked]=\"selectedFilters.includes(item.id)\" (change)=\"onFilterChange(item.id)\" />\r\n            <span *ngIf=\"enam !=null\">{{ item.label }}</span>\r\n            <span *ngIf=\"enam == null\">{{ item.name }}</span>\r\n        </label>\r\n    </div>\r\n\r\n\r\n    <!-- \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438 -->\r\n    <button class=\"sort-btn\" (click)=\"toggleSort()\">\r\n        <svg *ngIf=\"sortOrder === 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M8,5.70710678 L8,19.508331 C8,19.7844734 7.77614237,20.008331 7.5,20.008331 C7.22385763,20.008331 7,19.7844734 7,19.508331 L7,5.70710678 L4.85355339,7.85355339 C4.65829124,8.04881554 4.34170876,8.04881554 4.14644661,7.85355339 C3.95118446,7.65829124 3.95118446,7.34170876 4.14644661,7.14644661 L7.14644661,4.14644661 C7.34170876,3.95118446 7.65829124,3.95118446 7.85355339,4.14644661 L10.8535534,7.14644661 C11.0488155,7.34170876 11.0488155,7.65829124 10.8535534,7.85355339 C10.6582912,8.04881554 10.3417088,8.04881554 10.1464466,7.85355339 L8,5.70710678 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n\r\n        <svg *ngIf=\"sortOrder != 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M6.90365714,19.8034496 C6.81268627,19.9276666 6.66576323,20.008331 6.5,20.008331 C6.33423677,20.008331 6.18731373,19.9276666 6.09634286,19.8034496 L3.14644661,16.8535534 C2.95118446,16.6582912 2.95118446,16.3417088 3.14644661,16.1464466 C3.34170876,15.9511845 3.65829124,15.9511845 3.85355339,16.1464466 L6,18.2928932 L6,4.5 C6,4.22385763 6.22385763,4 6.5,4 C6.77614237,4 7,4.22385763 7,4.5 L7,18.2928932 L9.14644661,16.1464466 C9.34170876,15.9511845 9.65829124,15.9511845 9.85355339,16.1464466 C10.0488155,16.3417088 10.0488155,16.6582912 9.85355339,16.8535534 L6.90365714,19.8034496 L6.90365714,19.8034496 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n    </button>\r\n</div>\r\n\r\n<button *ngIf=\"selectedFilters && selectedFilters.length > 0\" class=\"btn btn-clear-filter\" (click)=\"resetFilter()\">\r\n    \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\r\n</button>", styles: ["@charset \"UTF-8\";.search-filter-sort{display:flex;align-items:center;width:100%;padding:8px;border-radius:8px;background:#f9f9f9;box-shadow:0 2px 8px #0000001a;position:relative}.search-box{position:relative;display:flex;align-items:center;flex:1}input{width:15px;padding:10px 40px 10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;transition:all .3s ease-in-out;outline:none;background:#fff}input:focus{border-color:#007bff;box-shadow:0 0 4px #007bff4d}.filter-btn{position:absolute;right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:#666;transition:color .3s ease-in-out}.filter-btn:hover{color:#007bff}.filter-dropdown{position:absolute;align-items:flex-start;top:100%;left:0;width:100%;background:#fff;border-radius:6px;box-shadow:0 4px 12px #0000001a;padding:10px;display:flex;flex-direction:column;gap:6px;border:1px solid #ddd;z-index:100}.filter-dropdown label{width:100%;display:flex;align-items:start;font-size:14px;color:#333;cursor:pointer}.filter-dropdown input{margin-right:8px;cursor:pointer}.sort-btn{background:transparent;border:none;border-radius:6px;padding:4px;font-size:16px;cursor:pointer;color:#666;transition:all .3s ease-in-out;margin-left:8px}.sort-btn:hover{background:#007bff36;color:#fff}.btn-reset{background-color:#f0f0f0;border:none;padding:5px 10px;font-size:12px;cursor:pointer}.btn-reset:hover{background-color:#e0e0e0}.btn-clear-filter{padding:5px;background:transparent;color:#1b506a;font-size:13px;border:none;margin-top:10px}.input-container{position:relative;width:100%}.input-container svg{position:absolute;left:10px;top:50%;transform:translateY(-50%)}.input-container input{padding-left:30px}input{color:#101010}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: UuidSearchFilterSortComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-uuid-search-filter-sort', standalone: true, imports: [CommonModule, FormsModule], template: "<div class=\"search-filter-sort\">\r\n    <!-- \u041F\u043E\u043B\u0435 \u043F\u043E\u0438\u0441\u043A\u0430 -->\r\n    <div class=\"search-box\">\r\n        <svg width=\"20\" height=\"20\"  viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\" (click)=\"toggleSearch(true)\">\r\n            <path fill-rule=\"evenodd\" clip-rule=\"evenodd\"\r\n                d=\"M9.591 9.591a4 4 0 10-5.657-5.657 4 4 0 005.657 5.657zm1.06-6.717a5.502 5.502 0 01.915 6.57l2.732 2.733a1.5 1.5 0 11-2.121 2.12l-2.732-2.73a5.5 5.5 0 111.207-8.692z\"\r\n                fill=\"#000\"></path>\r\n        </svg>\r\n        <input type=\"text\" [(ngModel)]=\"searchTerm\" (input)=\"onSearchChange()\" placeholder=\"\u041F\u043E\u0438\u0441\u043A...\"\r\n            style=\"width: 100%;\" \r\n            [ngStyle]=\"{'width': inputWidth, 'background': bgColor, 'border': borderStyle, 'transition': 'all 0.3s ease'}\"\r\n            [ngClass]=\"{'search-expanded': isSearchOpen}\"/>\r\n        <button class=\"filter-btn\" (click)=\"toggleFilter()\">\r\n            <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 44.023 44.023\"\r\n                xmlns:xlink=\"http://www.w3.org/1999/xlink\" enable-background=\"new 0 0 44.023 44.023\"\r\n                style=\"width: 15px;\">\r\n                <g>\r\n                    <g>\r\n                        <path\r\n                            d=\"m43.729,.29c-0.219-0.22-0.513-0.303-0.799-0.276h-41.831c-0.286-0.026-0.579,0.057-0.798,0.276-0.09,0.09-0.155,0.195-0.203,0.306-0.059,0.128-0.098,0.268-0.098,0.418 0,0.292 0.129,0.549 0.329,0.731l14.671,20.539v20.662c-0.008,0.152 0.015,0.304 0.077,0.446 0.149,0.364 0.505,0.621 0.923,0.621 0.303,0 0.565-0.142 0.749-0.354l11.98-11.953c0.227-0.227 0.307-0.533 0.271-0.828v-8.589l14.729-20.583c0.392-0.391 0.392-1.025 0-1.416zm-16.445,20.998c-0.209,0.209-0.298,0.485-0.284,0.759v8.553l-10,9.977v-18.53c0.014-0.273-0.075-0.55-0.284-0.759l-13.767-19.274h38.128l-13.793,19.274z\" />\r\n                    </g>\r\n                </g>\r\n            </svg>\r\n        </button>\r\n    </div>\r\n\r\n\r\n\r\n    <!-- \u0412\u044B\u043F\u0430\u0434\u0430\u044E\u0449\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432 -->\r\n    <div class=\"filter-dropdown\" *ngIf=\"isFilterOpen\">\r\n        <label *ngFor=\"let item of products\">\r\n            <input type=\"checkbox\" [checked]=\"selectedFilters.includes(item.id)\" (change)=\"onFilterChange(item.id)\" />\r\n            <span *ngIf=\"enam !=null\">{{ item.label }}</span>\r\n            <span *ngIf=\"enam == null\">{{ item.name }}</span>\r\n        </label>\r\n    </div>\r\n\r\n\r\n    <!-- \u041A\u043D\u043E\u043F\u043A\u0430 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438 -->\r\n    <button class=\"sort-btn\" (click)=\"toggleSort()\">\r\n        <svg *ngIf=\"sortOrder === 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M8,5.70710678 L8,19.508331 C8,19.7844734 7.77614237,20.008331 7.5,20.008331 C7.22385763,20.008331 7,19.7844734 7,19.508331 L7,5.70710678 L4.85355339,7.85355339 C4.65829124,8.04881554 4.34170876,8.04881554 4.14644661,7.85355339 C3.95118446,7.65829124 3.95118446,7.34170876 4.14644661,7.14644661 L7.14644661,4.14644661 C7.34170876,3.95118446 7.65829124,3.95118446 7.85355339,4.14644661 L10.8535534,7.14644661 C11.0488155,7.34170876 11.0488155,7.65829124 10.8535534,7.85355339 C10.6582912,8.04881554 10.3417088,8.04881554 10.1464466,7.85355339 L8,5.70710678 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n\r\n        <svg *ngIf=\"sortOrder != 'asc'\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\r\n            <path\r\n                d=\"M6.90365714,19.8034496 C6.81268627,19.9276666 6.66576323,20.008331 6.5,20.008331 C6.33423677,20.008331 6.18731373,19.9276666 6.09634286,19.8034496 L3.14644661,16.8535534 C2.95118446,16.6582912 2.95118446,16.3417088 3.14644661,16.1464466 C3.34170876,15.9511845 3.65829124,15.9511845 3.85355339,16.1464466 L6,18.2928932 L6,4.5 C6,4.22385763 6.22385763,4 6.5,4 C6.77614237,4 7,4.22385763 7,4.5 L7,18.2928932 L9.14644661,16.1464466 C9.34170876,15.9511845 9.65829124,15.9511845 9.85355339,16.1464466 C10.0488155,16.3417088 10.0488155,16.6582912 9.85355339,16.8535534 L6.90365714,19.8034496 L6.90365714,19.8034496 Z M12.5,6 C12.2238576,6 12,5.77614237 12,5.5 C12,5.22385763 12.2238576,5 12.5,5 L20.5,5 C20.7761424,5 21,5.22385763 21,5.5 C21,5.77614237 20.7761424,6 20.5,6 L12.5,6 Z M12.5,10 C12.2238576,10 12,9.77614237 12,9.5 C12,9.22385763 12.2238576,9 12.5,9 L18.5,9 C18.7761424,9 19,9.22385763 19,9.5 C19,9.77614237 18.7761424,10 18.5,10 L12.5,10 Z M12.5,14 C12.2238576,14 12,13.7761424 12,13.5 C12,13.2238576 12.2238576,13 12.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L12.5,14 Z M12.5,18 C12.2238576,18 12,17.7761424 12,17.5 C12,17.2238576 12.2238576,17 12.5,17 L14.5,17 C14.7761424,17 15,17.2238576 15,17.5 C15,17.7761424 14.7761424,18 14.5,18 L12.5,18 Z\" />\r\n        </svg>\r\n    </button>\r\n</div>\r\n\r\n<button *ngIf=\"selectedFilters && selectedFilters.length > 0\" class=\"btn btn-clear-filter\" (click)=\"resetFilter()\">\r\n    \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\r\n</button>", styles: ["@charset \"UTF-8\";.search-filter-sort{display:flex;align-items:center;width:100%;padding:8px;border-radius:8px;background:#f9f9f9;box-shadow:0 2px 8px #0000001a;position:relative}.search-box{position:relative;display:flex;align-items:center;flex:1}input{width:15px;padding:10px 40px 10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;transition:all .3s ease-in-out;outline:none;background:#fff}input:focus{border-color:#007bff;box-shadow:0 0 4px #007bff4d}.filter-btn{position:absolute;right:10px;background:none;border:none;cursor:pointer;font-size:16px;color:#666;transition:color .3s ease-in-out}.filter-btn:hover{color:#007bff}.filter-dropdown{position:absolute;align-items:flex-start;top:100%;left:0;width:100%;background:#fff;border-radius:6px;box-shadow:0 4px 12px #0000001a;padding:10px;display:flex;flex-direction:column;gap:6px;border:1px solid #ddd;z-index:100}.filter-dropdown label{width:100%;display:flex;align-items:start;font-size:14px;color:#333;cursor:pointer}.filter-dropdown input{margin-right:8px;cursor:pointer}.sort-btn{background:transparent;border:none;border-radius:6px;padding:4px;font-size:16px;cursor:pointer;color:#666;transition:all .3s ease-in-out;margin-left:8px}.sort-btn:hover{background:#007bff36;color:#fff}.btn-reset{background-color:#f0f0f0;border:none;padding:5px 10px;font-size:12px;cursor:pointer}.btn-reset:hover{background-color:#e0e0e0}.btn-clear-filter{padding:5px;background:transparent;color:#1b506a;font-size:13px;border:none;margin-top:10px}.input-container{position:relative;width:100%}.input-container svg{position:absolute;left:10px;top:50%;transform:translateY(-50%)}.input-container input{padding-left:30px}input{color:#101010}\n"] }]
        }], ctorParameters: () => [{ type: UuidSearchFilterSortService }, { type: i0.ElementRef }], propDecorators: { filterField: [{
                type: Input
            }], filterType: [{
                type: Input
            }], searchField: [{
                type: Input
            }], apiEndpoint: [{
                type: Input
            }], fieldNames: [{
                type: Input
            }], Field: [{
                type: Input
            }], enam: [{
                type: Input
            }], domain: [{
                type: Input
            }], filterChange: [{
                type: Output
            }], sortChange: [{
                type: Output
            }], onClickOutside: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });

/**
 * Утилиты для работы с датами
 */
//--------------------------------------------------
// 1. Парсинг и валидация
//--------------------------------------------------
/**
 * Приводит любое значение к объекту Date
 * (работает с timestamp, ISO-строками и Date)
 */
const parseDate = (input) => {
    if (input instanceof Date)
        return input;
    if (typeof input === 'number')
        return new Date(input);
    return new Date(input);
};
/**
 * Проверяет, является ли значение валидной датой
 */
const isValidDate = (date) => {
    const d = parseDate(date);
    return !isNaN(d.getTime());
};
//--------------------------------------------------
// 2. Форматирование
//--------------------------------------------------
/**
 * Форматирует дату в "DD.MM.YYYY" (например, "12.05.2023")
 */
const formatShortDate = (date) => {
    const d = parseDate(date);
    return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};
/**
 * Форматирует дату в "12 мая 2023 г."
 */
const formatLongDate = (date) => {
    const d = parseDate(date);
    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};
/**
 * Форматирует дату и время "12.05.2023, 14:30"
 */
const formatDateTime = (date) => {
    const d = parseDate(date);
    return d.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
/**
 * Форматирует время доставки (например, "14:30-16:30")
 */
const formatTimeRange = (start, end) => {
    const s = parseDate(start);
    const e = parseDate(end);
    return `${s.getHours()}:${s.getMinutes().toString().padStart(2, '0')}-${e.getHours()}:${e.getMinutes().toString().padStart(2, '0')}`;
};
//--------------------------------------------------
// 3. Расчеты и сравнения
//--------------------------------------------------
/**
 * Сравнивает две даты (без учета времени)
 * Возвращает:
 *  -1 если date1 < date2
 *   0 если date1 == date2
 *   1 если date1 > date2
 */
const compareDates = (date1, date2) => {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    const yearDiff = d1.getFullYear() - d2.getFullYear();
    if (yearDiff !== 0)
        return Math.sign(yearDiff);
    const monthDiff = d1.getMonth() - d2.getMonth();
    if (monthDiff !== 0)
        return Math.sign(monthDiff);
    const dayDiff = d1.getDate() - d2.getDate();
    return Math.sign(dayDiff);
};
/**
 * Проверяет, является ли дата сегодняшним днем
 */
const isToday = (date) => {
    const d = parseDate(date);
    const today = new Date();
    return (d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear());
};
/**
 * Проверяет, является ли дата вчерашним днем
 */
const isYesterday = (date) => {
    const d = parseDate(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear());
};
/**
 * Добавляет указанное количество дней к дате
 */
const addDays = (date, days) => {
    const d = parseDate(date);
    const result = new Date(d);
    result.setDate(result.getDate() + days);
    return result;
};
/**
 * Рассчитывает разницу между датами в днях
 */
const diffInDays = (date1, date2) => {
    const d1 = parseDate(date1);
    const d2 = parseDate(date2);
    const diff = Math.abs(d1.getTime() - d2.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};
//--------------------------------------------------
// 4. Специфичные для e-commerce функции
//--------------------------------------------------
/**
 * Рассчитывает предполагаемую дату доставки
 * (например: +3 рабочих дня от текущей даты)
 */
const getDeliveryDate = (startDate = new Date(), workingDays = 3) => {
    let count = 0;
    let date = parseDate(startDate);
    while (count < workingDays) {
        date = addDays(date, 1);
        // Пропускаем выходные (суббота=6, воскресенье=0)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            count++;
        }
    }
    return date;
};
/**
 * Форматирует срок доставки для UI
 * (например: "Доставка: 15-17 мая")
 */
const formatDeliveryRange = (start, daysRange = 2) => {
    const startDate = parseDate(start);
    const endDate = addDays(startDate, daysRange);
    if (startDate.getMonth() === endDate.getMonth()) {
        return `Доставка: ${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString('ru-RU', { month: 'long' })}`;
    }
    else {
        return `Доставка: ${startDate.getDate()} ${startDate.toLocaleDateString('ru-RU', { month: 'short' })} - ${endDate.getDate()} ${endDate.toLocaleDateString('ru-RU', { month: 'short' })}`;
    }
};
/**
 * Проверяет, истекла ли дата (например, для акций)
 */
const isExpired = (expiryDate) => {
    const expiry = parseDate(expiryDate);
    return expiry < new Date();
};

class TableComponent {
    /**
     * Массив объектов, которые будут отображаться в таблице.
     * Каждое значение соответствует одной строке таблицы.
     */
    products = [];
    /**
     * Конфигурация отображаемых колонок.
     * Ключ — ключ поля, значение — показывать колонку или нет.
     * Пример: { fullName: true, retailPrice: false }
     */
    columnsConfig = {};
    /**
     * Настройки всех колонок таблицы.
     * Используется для динамического отображения колонок и фильтров.
     */
    columnOptions = [];
    /**
     * Количество элементов на странице для пагинации или подгрузки.
     */
    pageSize = 30;
    /**
     * Флаг, показывающий, что идет загрузка данных.
     * Используется для отображения индикатора загрузки.
     */
    loading = false;
    /**
     * Флаг, показывающий текущий тип отображения таблицы.
     * true — десктопная таблица, false — мобильные карточки.
     */
    isDesktop = true;
    /**
     * Домен или контекст, используемый для построения ссылок или API-запросов.
     */
    domain = '';
    /**
     * Массив действий для каждой строки таблицы.
     * Каждое действие имеет label, icon (необязательно) и callback function.
     */
    actions = [];
    /**
     * Внутренний объект состояния видимости колонок.
     */
    columns = {};
    /**
     * Массив выбранных колонок для отображения.
     */
    selectedColumns = [];
    /**
     * Флаг, показывающий, открыт ли список выбора колонок.
     */
    columnsVisible = false;
    /**
     * Текущая страница для подгрузки данных.
     */
    page = 0;
    /**
     * Событие на редактирование строки. Эмиттит id продукта.
     */
    edit = new EventEmitter();
    /**
     * Событие на удаление строки. Эмиттит id продукта.
     */
    delete = new EventEmitter();
    /**
     * Событие для подгрузки следующей страницы данных.
     * Эмиттит объект с номером страницы и размером страницы.
     */
    loadNextPage = new EventEmitter();
    /**
     * Событие при изменении фильтра.
     * Эмиттит объект FilterDto с полем, значениями и типом фильтра.
     */
    filterChange = new EventEmitter();
    /**
     * Событие при изменении сортировки.
     * Эмиттит объект SortDto с полем и типом сортировки.
     */
    sortChange = new EventEmitter();
    ngOnInit() {
        this.initializeColumns();
        this.updateScreenSize();
    }
    initializeColumns() {
        this.selectedColumns = Object.keys(this.columnsConfig).filter(key => this.columnsConfig[key]);
    }
    get filteredSelectedColumns() {
        return this.selectedColumns.filter(col => col !== 'article');
    }
    formatShortDate(date) {
        return formatShortDate(date);
    }
    toggleColVisibility() {
        this.columnsVisible = !this.columnsVisible;
    }
    toggleColumnVisibility(columnKey, value) {
        this.columnsConfig[columnKey] = value;
        this.selectedColumns = Object.keys(this.columnsConfig).filter(key => this.columnsConfig[key]);
    }
    removeColumn(columnKey) {
        this.selectedColumns = this.selectedColumns.filter(col => col !== columnKey);
        this.columnsConfig[columnKey] = false;
    }
    editProduct(id) {
        this.edit.emit(id);
    }
    deleteProduct(id) {
        this.delete.emit(id);
    }
    loadProducts() {
        if (this.loading)
            return;
        this.loadNextPage.emit({ page: this.page, pageSize: this.pageSize });
    }
    onScroll() {
        const scrollPos = window.scrollY + window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        if (scrollPos >= docHeight)
            this.loadProducts();
    }
    getColumnLabel(key) {
        const col = this.columnOptions.find(c => c.key === key);
        return col ? col.label : key;
    }
    objectKeys(obj) {
        return Object.keys(obj);
    }
    updateScreenSize() {
        this.isDesktop = window.innerWidth >= 1100;
    }
    onFilterChange(filter) {
        if (!this.queryData.filters)
            this.queryData.filters = [];
        // Проверка на пустые значения для фильтра с типами 6, 7, 8, 9
        if ([6, 7, 8, 9].includes(filter.type) && (filter.values && filter.values[0] === "")) {
            // Если значения пустые, не добавляем фильтр
            this.queryData.filters = this.queryData.filters.filter((f) => !(f.field === filter.field && [6, 7, 8, 9].includes(f.type)));
            this.loadProducts();
            console.log('Обновленные фильтры:', this.queryData.filters);
            return; // Выходим из метода, чтобы не продолжать добавление фильтра
        }
        // Удаляем все фильтры с тем же полем и типом из массива, если тип фильтра один из 6, 7, 8, 9
        if ([6, 7, 8, 9].includes(filter.type)) {
            this.queryData.filters = this.queryData.filters.filter((f) => !(f.field === filter.field && [6, 7, 8, 9].includes(f.type)));
        }
        // Удаляем все фильтры с тем же полем и типом из массива, если тип фильтра один из 2, 3, 4, 5
        if ([2, 3, 4, 5].includes(filter.type)) {
            this.queryData.filters = this.queryData.filters.filter((f) => !(f.field === filter.field && [2, 3, 4, 5].includes(f.type)));
        }
        // Добавляем или обновляем фильтр
        const existingFilter = this.queryData.filters.find((f) => f.field === filter.field && f.type === filter.type);
        if (existingFilter) {
            existingFilter.values = filter.values; // Обновляем значения
        }
        else if (filter.values && filter.values[0] !== "") {
            // Добавляем фильтр только если значения не пустые
            this.queryData.filters.push(filter);
        }
        // Удаляем фильтр, если values стал пустым массивом или `[""]`
        this.queryData.filters = this.queryData.filters.filter((f) => f.values && f.values.length > 0 && f.values[0] !== "");
        this.filterChange.emit(this.queryData);
    }
    queryData;
    onSortChange(sort) {
        if (!this.queryData.sorts)
            this.queryData.sorts = [];
        const existingSort = this.queryData.sorts.find((s) => s.field === sort.field);
        if (existingSort) {
            existingSort.sortType = sort.sortType; // Обновляем тип сортировки
        }
        else {
            this.queryData.sorts.push(sort); // Добавляем новую сортировку
        }
        this.sortChange.emit(sort);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: TableComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: TableComponent, isStandalone: true, selector: "lib-table", inputs: { products: "products", columnsConfig: "columnsConfig", columnOptions: "columnOptions", pageSize: "pageSize", loading: "loading", isDesktop: "isDesktop", domain: "domain", actions: "actions" }, outputs: { edit: "edit", delete: "delete", loadNextPage: "loadNextPage", filterChange: "filterChange", sortChange: "sortChange" }, host: { listeners: { "window:scroll": "onScroll()", "window:resize": "updateScreenSize()" } }, ngImport: i0, template: "<div class=\"container\">\r\n    <div class=\"controls\">\r\n        <div class=\"column-toggle\">\r\n            <button class=\"column-toggle-button\" (click)=\"toggleColVisibility()\">\r\n                \u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C/\u0441\u043A\u0440\u044B\u0442\u044C \u0441\u0442\u043E\u043B\u0431\u0446\u044B\r\n            </button>\r\n\r\n            <div class=\"column-options\" [class.show]=\"columnsVisible\">\r\n                <label class=\"custom-select\">\r\n                    <span>\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0441\u0442\u043E\u043B\u0431\u0446\u044B</span>\r\n                    <div class=\"checkbox-group\">\r\n                        <div *ngFor=\"let column of columnOptions\" class=\"checkbox-item\">\r\n                            <input type=\"checkbox\" id=\"{{ column.key }}\" [(ngModel)]=\"columns[column.key]\"\r\n                                (ngModelChange)=\"toggleColumnVisibility(column.key, $event)\" />\r\n                            <label for=\"{{ column.key }}\">{{ column.label }}</label>\r\n                        </div>\r\n                    </div>\r\n                </label>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"selected-columns\">\r\n            <span *ngFor=\"let column of filteredSelectedColumns\">\r\n                {{ getColumnLabel(column) }}\r\n                <button class=\"btn-delete-column\" (click)=\"removeColumn(column)\">&#10005;</button>\r\n            </span>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"products-container\">\r\n        <table class=\"products-table\" *ngIf=\"isDesktop\">\r\n            <thead>\r\n                <tr>\r\n                    <ng-container *ngFor=\"let column of columnOptions\">\r\n                        <th *ngIf=\"columns[column.key]\">\r\n                            {{ getColumnLabel(column.key) }}\r\n                         <div style=\"display: flex; justify-content: space-between;\">\r\n                        <app-search-filter-sort *ngIf=\"column.type == 'string'\" [filterField]=\"column.field\" [filterType]=\"1\"\r\n                            (filterChange)=\"onFilterChange($event)\"\r\n                            (sortChange)=\"onSortChange($event)\" [isVisibleFilter]=\"column.isFilter\">\r\n                        </app-search-filter-sort>\r\n\r\n                        <app-date-filter *ngIf=\"column.type == 'date'\" [filterField]=\"column.field\"\r\n                            (filterChange)=\"onFilterChange($event)\"\r\n                            (sortChange)=\"onSortChange($event)\">\r\n                        </app-date-filter>\r\n\r\n                        <app-number-filter *ngIf=\"column.type == 'number'\" [filterField]=\"column.field\"\r\n                            (filterChange)=\"onFilterChange($event)\"\r\n                            (sortChange)=\"onSortChange($event)\">\r\n                        </app-number-filter>\r\n\r\n                        <app-uuid-search-filter-sort *ngIf=\"column.type == 'uuid'\" [apiEndpoint]=\"column.endpoint\"\r\n                            [fieldNames]=\"''\" [enam]=\"null\" [Field]=\"column.field\"\r\n                            [domain]=\"domain\"\r\n                            (filterChange)=\"onFilterChange($event)\"\r\n                            (sortChange)=\"onSortChange($event)\">\r\n                        </app-uuid-search-filter-sort>\r\n\r\n                    </div>\r\n                        </th>\r\n                    </ng-container>\r\n                    <th>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr *ngFor=\"let product of products\">\r\n                    <td *ngFor=\"let column of columnOptions\">\r\n                        <ng-container *ngIf=\"columns[column.key]\">\r\n                            {{ product[column.key] }}\r\n                        </ng-container>\r\n                    </td>\r\n                    <td>\r\n                        <div class=\"actions\">\r\n                            <button *ngFor=\"let action of actions\" (click)=\"action.action(product)\">\r\n                                {{ action.label }}\r\n                            </button>\r\n                        </div>\r\n                    </td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n\r\n        <div class=\"product-cards\" *ngIf=\"!isDesktop\">\r\n            <div class=\"product-card\" *ngFor=\"let product of products\">\r\n                <div class=\"product-header\">\r\n                    <img *ngIf=\"columns['productImageLinks'] && product.productImageLinks && product.productImageLinks.length > 0\"\r\n                        [src]=\"product.productImageLinks[0]\" alt=\"Product Image\" class=\"product-image\" />\r\n                    <div class=\"product-main-info\">\r\n                        <h3 class=\"product-title\" *ngIf=\"columns['fullName']\">{{ product.fullName }}</h3>\r\n                        <p class=\"product-price\" *ngIf=\"columns['retailPrice']\">{{ product.retailPrice }} \u0440\u0443\u0431.</p>\r\n                        <p class=\"product-description\" *ngIf=\"columns['description']\">{{ product.description }}</p>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"product-extra-info\">\r\n                    <div *ngFor=\"let key of objectKeys(columnsConfig)\">\r\n                        <p *ngIf=\"columnsConfig[key] && product[key]\">\r\n                            <strong>{{ getColumnLabel(key) }}:</strong> {{ product[key] }}\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"product-actions\">\r\n                    <button *ngFor=\"let action of actions\" (click)=\"action.action(product)\">\r\n                        {{ action.label }}\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div *ngIf=\"loading\" class=\"loading-indicator\">\r\n            <p>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445...</p>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".container{padding:20px}.container .controls{margin-bottom:20px;padding:20px;background-color:#fff;box-shadow:0 2px 6px #0000001a;border-radius:12px;transition:transform .3s ease}.container .controls .column-toggle{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;position:relative}.container .controls .column-toggle .column-toggle-button{background-color:#4caf50;color:#fff;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:13px;transition:all .3s ease;border:none}.container .controls .column-toggle .column-toggle-button:hover{background-color:#45a049}.container .controls .column-toggle .column-options{width:100%;max-width:380px;margin-top:12px;opacity:0;transition:all .3s ease-in-out;max-height:0;overflow:hidden;position:absolute;top:40px;background:#fff;padding:10px;border-radius:20px;box-shadow:0 2px 6px #0000001a;z-index:10}.container .controls .column-toggle .column-options.show{opacity:1;transform:translateY(0);max-height:500px}.container .controls .column-toggle .column-options .custom-select{font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;font-size:14px;width:100%;color:#333}.container .controls .column-toggle .column-options .custom-select .checkbox-group{display:flex;flex-direction:column;gap:12px}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item{display:flex;align-items:center;gap:12px;font-size:14px;color:#444}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item input[type=checkbox]{width:20px;height:20px;border-radius:5px;border:2px solid #ccc;cursor:pointer;transition:all .3s ease;background-color:#fff}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item input[type=checkbox]:checked{background-color:#4caf50;border-color:#4caf50}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item input[type=checkbox]:focus{outline:none;border-color:#4caf50}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item input[type=checkbox]:hover{background-color:#e0f7e0}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item label{cursor:pointer;-webkit-user-select:none;user-select:none;font-size:14px;color:#333}.container .controls .selected-columns{font-size:14px;color:#333;margin-top:12px;display:flex;flex-wrap:wrap;gap:12px}.container .controls .selected-columns span{background-color:#e0f7e0;padding:5px 30px 5px 7px;border-radius:20px;font-size:11px;color:#2e8131;box-shadow:0 2px 5px #0000001a;position:relative}.container .controls .selected-columns .btn-delete-column{background:transparent;border:none;color:#f44336;font-size:16px;cursor:pointer;position:absolute;top:0;font-weight:700}.container .controls .selected-columns .btn-delete-column:hover{color:#e53935}.container .products-container{background-color:#f0f4f8;min-height:100vh;transition:all .3s ease-in-out}.container .products-container .products-table{width:100%;border-collapse:collapse;margin-top:20px;background-color:#fff;box-shadow:0 2px 6px #0000001a;border-radius:10px;overflow:hidden}.container .products-container .products-table th,.container .products-container .products-table td{padding:15px;text-align:left;font-size:14px;color:#444}.container .products-container .products-table th{background-color:#4caf50;color:#fff;text-transform:uppercase;font-size:11px}.container .products-container .products-table td{border-bottom:1px solid #f0f0f0}.container .products-container .products-table tr:hover{background-color:#f9f9f9}.container .products-container .actions{display:flex;gap:10px}.container .products-container .actions .btn-edit,.container .products-container .actions .btn-delete{padding:5px;font-size:14px;border:none;border-radius:50%;background-color:#ededed;cursor:pointer}.container .products-container .actions .btn-edit:hover,.container .products-container .actions .btn-delete:hover{background-color:#ddd}.container .products-container .loading-indicator{display:flex;justify-content:center;align-items:center;margin-top:20px}.container .products-container .loading-indicator p{font-size:16px;color:#888}@media (max-width: 1100px){.container .products-container .products-table{display:none}.container .products-container .product-card{display:flex;flex-direction:column;background-color:#fff;padding:15px;margin-bottom:15px;border-radius:12px;box-shadow:0 4px 10px #0000001a;transition:all .3s ease}.container .products-container .product-card:hover{transform:translateY(-3px);box-shadow:0 6px 14px #00000026}.container .products-container .product-card p{margin:0}.container .products-container .product-card .product-header{display:flex;align-items:flex-start;gap:15px}.container .products-container .product-card .product-header .product-image{width:100px;height:100px;object-fit:cover;border-radius:12px}.container .products-container .product-card .product-header .product-main-info{flex:1;display:flex;flex-direction:column;gap:5px}.container .products-container .product-card .product-header .product-main-info .product-title{font-size:16px;font-weight:600;color:#333}.container .products-container .product-card .product-header .product-main-info .product-price{font-size:14px;font-weight:500;color:#4caf50}.container .products-container .product-card .product-header .product-main-info .product-description{font-size:13px;color:#555;overflow:hidden;text-overflow:ellipsis}.container .products-container .product-card .product-extra-info{margin-top:10px;border-top:1px solid #eee;padding-top:10px;font-size:13px;color:#666}.container .products-container .product-card .product-extra-info p{margin:3px 0}.container .products-container .product-card .product-extra-info p strong{color:#333}.container .products-container .product-card .product-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:10px}.container .products-container .product-card .product-actions button{width:36px;height:36px;border:none;border-radius:50%;background-color:#f0f0f0;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}.container .products-container .product-card .product-actions button:hover{background-color:#e0e0e0}}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: DateFilterSortComponent, selector: "app-date-filter", inputs: ["filterField"], outputs: ["filterChange", "sortChange"] }, { kind: "component", type: NumberFilterComponent, selector: "app-number-filter", inputs: ["filterField"], outputs: ["filterChange", "sortChange"] }, { kind: "component", type: SearchFilterSortComponent, selector: "app-search-filter-sort", inputs: ["filterField", "filterType", "isVisibleFilter"], outputs: ["filterChange", "sortChange"] }, { kind: "component", type: UuidSearchFilterSortComponent, selector: "app-uuid-search-filter-sort", inputs: ["filterField", "filterType", "searchField", "apiEndpoint", "fieldNames", "Field", "enam", "domain"], outputs: ["filterChange", "sortChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: TableComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-table', standalone: true, imports: [
                        CommonModule, FormsModule,
                        DateFilterSortComponent, NumberFilterComponent, SearchFilterSortComponent, UuidSearchFilterSortComponent
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"container\">\r\n    <div class=\"controls\">\r\n        <div class=\"column-toggle\">\r\n            <button class=\"column-toggle-button\" (click)=\"toggleColVisibility()\">\r\n                \u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C/\u0441\u043A\u0440\u044B\u0442\u044C \u0441\u0442\u043E\u043B\u0431\u0446\u044B\r\n            </button>\r\n\r\n            <div class=\"column-options\" [class.show]=\"columnsVisible\">\r\n                <label class=\"custom-select\">\r\n                    <span>\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0441\u0442\u043E\u043B\u0431\u0446\u044B</span>\r\n                    <div class=\"checkbox-group\">\r\n                        <div *ngFor=\"let column of columnOptions\" class=\"checkbox-item\">\r\n                            <input type=\"checkbox\" id=\"{{ column.key }}\" [(ngModel)]=\"columns[column.key]\"\r\n                                (ngModelChange)=\"toggleColumnVisibility(column.key, $event)\" />\r\n                            <label for=\"{{ column.key }}\">{{ column.label }}</label>\r\n                        </div>\r\n                    </div>\r\n                </label>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"selected-columns\">\r\n            <span *ngFor=\"let column of filteredSelectedColumns\">\r\n                {{ getColumnLabel(column) }}\r\n                <button class=\"btn-delete-column\" (click)=\"removeColumn(column)\">&#10005;</button>\r\n            </span>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"products-container\">\r\n        <table class=\"products-table\" *ngIf=\"isDesktop\">\r\n            <thead>\r\n                <tr>\r\n                    <ng-container *ngFor=\"let column of columnOptions\">\r\n                        <th *ngIf=\"columns[column.key]\">\r\n                            {{ getColumnLabel(column.key) }}\r\n                         <div style=\"display: flex; justify-content: space-between;\">\r\n                        <app-search-filter-sort *ngIf=\"column.type == 'string'\" [filterField]=\"column.field\" [filterType]=\"1\"\r\n                            (filterChange)=\"onFilterChange($event)\"\r\n                            (sortChange)=\"onSortChange($event)\" [isVisibleFilter]=\"column.isFilter\">\r\n                        </app-search-filter-sort>\r\n\r\n                        <app-date-filter *ngIf=\"column.type == 'date'\" [filterField]=\"column.field\"\r\n                            (filterChange)=\"onFilterChange($event)\"\r\n                            (sortChange)=\"onSortChange($event)\">\r\n                        </app-date-filter>\r\n\r\n                        <app-number-filter *ngIf=\"column.type == 'number'\" [filterField]=\"column.field\"\r\n                            (filterChange)=\"onFilterChange($event)\"\r\n                            (sortChange)=\"onSortChange($event)\">\r\n                        </app-number-filter>\r\n\r\n                        <app-uuid-search-filter-sort *ngIf=\"column.type == 'uuid'\" [apiEndpoint]=\"column.endpoint\"\r\n                            [fieldNames]=\"''\" [enam]=\"null\" [Field]=\"column.field\"\r\n                            [domain]=\"domain\"\r\n                            (filterChange)=\"onFilterChange($event)\"\r\n                            (sortChange)=\"onSortChange($event)\">\r\n                        </app-uuid-search-filter-sort>\r\n\r\n                    </div>\r\n                        </th>\r\n                    </ng-container>\r\n                    <th>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr *ngFor=\"let product of products\">\r\n                    <td *ngFor=\"let column of columnOptions\">\r\n                        <ng-container *ngIf=\"columns[column.key]\">\r\n                            {{ product[column.key] }}\r\n                        </ng-container>\r\n                    </td>\r\n                    <td>\r\n                        <div class=\"actions\">\r\n                            <button *ngFor=\"let action of actions\" (click)=\"action.action(product)\">\r\n                                {{ action.label }}\r\n                            </button>\r\n                        </div>\r\n                    </td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n\r\n        <div class=\"product-cards\" *ngIf=\"!isDesktop\">\r\n            <div class=\"product-card\" *ngFor=\"let product of products\">\r\n                <div class=\"product-header\">\r\n                    <img *ngIf=\"columns['productImageLinks'] && product.productImageLinks && product.productImageLinks.length > 0\"\r\n                        [src]=\"product.productImageLinks[0]\" alt=\"Product Image\" class=\"product-image\" />\r\n                    <div class=\"product-main-info\">\r\n                        <h3 class=\"product-title\" *ngIf=\"columns['fullName']\">{{ product.fullName }}</h3>\r\n                        <p class=\"product-price\" *ngIf=\"columns['retailPrice']\">{{ product.retailPrice }} \u0440\u0443\u0431.</p>\r\n                        <p class=\"product-description\" *ngIf=\"columns['description']\">{{ product.description }}</p>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"product-extra-info\">\r\n                    <div *ngFor=\"let key of objectKeys(columnsConfig)\">\r\n                        <p *ngIf=\"columnsConfig[key] && product[key]\">\r\n                            <strong>{{ getColumnLabel(key) }}:</strong> {{ product[key] }}\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n                <div class=\"product-actions\">\r\n                    <button *ngFor=\"let action of actions\" (click)=\"action.action(product)\">\r\n                        {{ action.label }}\r\n                    </button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div *ngIf=\"loading\" class=\"loading-indicator\">\r\n            <p>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445...</p>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".container{padding:20px}.container .controls{margin-bottom:20px;padding:20px;background-color:#fff;box-shadow:0 2px 6px #0000001a;border-radius:12px;transition:transform .3s ease}.container .controls .column-toggle{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;position:relative}.container .controls .column-toggle .column-toggle-button{background-color:#4caf50;color:#fff;padding:5px 10px;border-radius:8px;cursor:pointer;font-size:13px;transition:all .3s ease;border:none}.container .controls .column-toggle .column-toggle-button:hover{background-color:#45a049}.container .controls .column-toggle .column-options{width:100%;max-width:380px;margin-top:12px;opacity:0;transition:all .3s ease-in-out;max-height:0;overflow:hidden;position:absolute;top:40px;background:#fff;padding:10px;border-radius:20px;box-shadow:0 2px 6px #0000001a;z-index:10}.container .controls .column-toggle .column-options.show{opacity:1;transform:translateY(0);max-height:500px}.container .controls .column-toggle .column-options .custom-select{font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;font-size:14px;width:100%;color:#333}.container .controls .column-toggle .column-options .custom-select .checkbox-group{display:flex;flex-direction:column;gap:12px}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item{display:flex;align-items:center;gap:12px;font-size:14px;color:#444}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item input[type=checkbox]{width:20px;height:20px;border-radius:5px;border:2px solid #ccc;cursor:pointer;transition:all .3s ease;background-color:#fff}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item input[type=checkbox]:checked{background-color:#4caf50;border-color:#4caf50}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item input[type=checkbox]:focus{outline:none;border-color:#4caf50}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item input[type=checkbox]:hover{background-color:#e0f7e0}.container .controls .column-toggle .column-options .custom-select .checkbox-group .checkbox-item label{cursor:pointer;-webkit-user-select:none;user-select:none;font-size:14px;color:#333}.container .controls .selected-columns{font-size:14px;color:#333;margin-top:12px;display:flex;flex-wrap:wrap;gap:12px}.container .controls .selected-columns span{background-color:#e0f7e0;padding:5px 30px 5px 7px;border-radius:20px;font-size:11px;color:#2e8131;box-shadow:0 2px 5px #0000001a;position:relative}.container .controls .selected-columns .btn-delete-column{background:transparent;border:none;color:#f44336;font-size:16px;cursor:pointer;position:absolute;top:0;font-weight:700}.container .controls .selected-columns .btn-delete-column:hover{color:#e53935}.container .products-container{background-color:#f0f4f8;min-height:100vh;transition:all .3s ease-in-out}.container .products-container .products-table{width:100%;border-collapse:collapse;margin-top:20px;background-color:#fff;box-shadow:0 2px 6px #0000001a;border-radius:10px;overflow:hidden}.container .products-container .products-table th,.container .products-container .products-table td{padding:15px;text-align:left;font-size:14px;color:#444}.container .products-container .products-table th{background-color:#4caf50;color:#fff;text-transform:uppercase;font-size:11px}.container .products-container .products-table td{border-bottom:1px solid #f0f0f0}.container .products-container .products-table tr:hover{background-color:#f9f9f9}.container .products-container .actions{display:flex;gap:10px}.container .products-container .actions .btn-edit,.container .products-container .actions .btn-delete{padding:5px;font-size:14px;border:none;border-radius:50%;background-color:#ededed;cursor:pointer}.container .products-container .actions .btn-edit:hover,.container .products-container .actions .btn-delete:hover{background-color:#ddd}.container .products-container .loading-indicator{display:flex;justify-content:center;align-items:center;margin-top:20px}.container .products-container .loading-indicator p{font-size:16px;color:#888}@media (max-width: 1100px){.container .products-container .products-table{display:none}.container .products-container .product-card{display:flex;flex-direction:column;background-color:#fff;padding:15px;margin-bottom:15px;border-radius:12px;box-shadow:0 4px 10px #0000001a;transition:all .3s ease}.container .products-container .product-card:hover{transform:translateY(-3px);box-shadow:0 6px 14px #00000026}.container .products-container .product-card p{margin:0}.container .products-container .product-card .product-header{display:flex;align-items:flex-start;gap:15px}.container .products-container .product-card .product-header .product-image{width:100px;height:100px;object-fit:cover;border-radius:12px}.container .products-container .product-card .product-header .product-main-info{flex:1;display:flex;flex-direction:column;gap:5px}.container .products-container .product-card .product-header .product-main-info .product-title{font-size:16px;font-weight:600;color:#333}.container .products-container .product-card .product-header .product-main-info .product-price{font-size:14px;font-weight:500;color:#4caf50}.container .products-container .product-card .product-header .product-main-info .product-description{font-size:13px;color:#555;overflow:hidden;text-overflow:ellipsis}.container .products-container .product-card .product-extra-info{margin-top:10px;border-top:1px solid #eee;padding-top:10px;font-size:13px;color:#666}.container .products-container .product-card .product-extra-info p{margin:3px 0}.container .products-container .product-card .product-extra-info p strong{color:#333}.container .products-container .product-card .product-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:10px}.container .products-container .product-card .product-actions button{width:36px;height:36px;border:none;border-radius:50%;background-color:#f0f0f0;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}.container .products-container .product-card .product-actions button:hover{background-color:#e0e0e0}}\n"] }]
        }], propDecorators: { products: [{
                type: Input
            }], columnsConfig: [{
                type: Input
            }], columnOptions: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], loading: [{
                type: Input
            }], isDesktop: [{
                type: Input
            }], domain: [{
                type: Input
            }], actions: [{
                type: Input
            }], edit: [{
                type: Output
            }], delete: [{
                type: Output
            }], loadNextPage: [{
                type: Output
            }], filterChange: [{
                type: Output
            }], sortChange: [{
                type: Output
            }], onScroll: [{
                type: HostListener,
                args: ['window:scroll', []]
            }], updateScreenSize: [{
                type: HostListener,
                args: ['window:resize']
            }] } });

Chart.register(...registerables);
class ChartComponent {
    canvas;
    /** Тип графика: 'line', 'bar', 'pie', 'doughnut' */
    type = 'line';
    /** Данные графика */
    data = { labels: [], datasets: [] };
    /** Опции Chart.js */
    options = {
        responsive: true,
        animation: { duration: 500, easing: 'easeOutQuart' },
        plugins: { legend: { position: 'top' } }
    };
    chart;
    ngAfterViewInit() {
        this.initChart();
    }
    ngOnChanges(changes) {
        if (this.chart && changes['data'] && !changes['data'].firstChange) {
            this.updateChart();
        }
    }
    initChart() {
        this.chart = new Chart(this.canvas.nativeElement, {
            type: this.type,
            data: this.data,
            options: this.options
        });
    }
    updateChart() {
        this.chart.data = this.data;
        this.chart.update('active');
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ChartComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: ChartComponent, isStandalone: true, selector: "lib-chart", inputs: { type: "type", data: "data", options: "options" }, viewQueries: [{ propertyName: "canvas", first: true, predicate: ["chartCanvas"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: '<canvas #chartCanvas></canvas>', isInline: true, styles: [""], dependencies: [{ kind: "ngmodule", type: CommonModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ChartComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-chart', imports: [CommonModule], template: '<canvas #chartCanvas></canvas>' }]
        }], propDecorators: { canvas: [{
                type: ViewChild,
                args: ['chartCanvas', { static: true }]
            }], type: [{
                type: Input
            }], data: [{
                type: Input
            }], options: [{
                type: Input
            }] } });

class GaugeComponent {
    /** Текущее значение */
    value = 50;
    /** Минимальное значение */
    min = 0;
    /** Максимальное значение */
    max = 100;
    /** Цвет заполненной части */
    color = '#16a34a';
    /** Цвет фона */
    backgroundColor = '#e5e7eb';
    /** Размер индикатора */
    size = 150;
    /** Толщина линии */
    strokeWidth = 15;
    /** Плавная анимация */
    animate = true;
    /** Текущее значение для анимации */
    displayedValue = 0;
    /** Радиус круга */
    radius = 0;
    /** Длина окружности */
    circumference = 0;
    ngOnChanges(changes) {
        this.radius = (this.size - this.strokeWidth) / 2;
        this.circumference = 2 * Math.PI * this.radius;
        if (this.animate) {
            const step = () => {
                if (Math.abs(this.displayedValue - this.value) < 0.5) {
                    this.displayedValue = this.value;
                }
                else {
                    this.displayedValue += (this.value - this.displayedValue) * 0.1;
                    requestAnimationFrame(step);
                }
            };
            step();
        }
        else {
            this.displayedValue = this.value;
        }
    }
    ngOnInit() {
        this.radius = (this.size - this.strokeWidth) / 2;
        this.circumference = 2 * Math.PI * this.radius;
        this.updateValue();
    }
    updateValue() {
        if (this.animate) {
            const step = () => {
                if (Math.abs(this.displayedValue - this.value) < 0.5) {
                    this.displayedValue = this.value;
                }
                else {
                    this.displayedValue += (this.value - this.displayedValue) * 0.1;
                    requestAnimationFrame(step);
                }
            };
            step();
        }
        else {
            this.displayedValue = this.value;
        }
    }
    getStrokeDashOffset() {
        const percent = (this.displayedValue - this.min) / (this.max - this.min);
        return this.circumference * (1 - percent);
    }
    getPercent() {
        return Math.round(((this.displayedValue - this.min) / (this.max - this.min)) * 100);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: GaugeComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: GaugeComponent, isStandalone: true, selector: "lib-gauge", inputs: { value: "value", min: "min", max: "max", color: "color", backgroundColor: "backgroundColor", size: "size", strokeWidth: "strokeWidth", animate: "animate" }, usesOnChanges: true, ngImport: i0, template: "<div class=\"gauge-wrapper\" [style.width.px]=\"size\" [style.height.px]=\"size\">\r\n  <svg [attr.width]=\"size\" [attr.height]=\"size\">\r\n    <!-- \u0424\u043E\u043D \u043A\u0440\u0443\u0433\u0430 -->\r\n    <circle\r\n      [attr.cx]=\"size/2\"\r\n      [attr.cy]=\"size/2\"\r\n      [attr.r]=\"radius\"\r\n      [attr.stroke-width]=\"strokeWidth\"\r\n      [attr.stroke]=\"backgroundColor\"\r\n      fill=\"none\"\r\n    ></circle>\r\n\r\n    <!-- \u0417\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0439 \u043A\u0440\u0443\u0433 -->\r\n    <circle\r\n      [attr.cx]=\"size/2\"\r\n      [attr.cy]=\"size/2\"\r\n      [attr.r]=\"radius\"\r\n      [attr.stroke-width]=\"strokeWidth\"\r\n      [attr.stroke]=\"color\"\r\n      fill=\"none\"\r\n      [attr.stroke-dasharray]=\"circumference\"\r\n      [attr.stroke-dashoffset]=\"getStrokeDashOffset()\"\r\n      stroke-linecap=\"round\"\r\n      [style.transition]=\"animate ? 'stroke-dashoffset 0.3s ease' : 'none'\"\r\n    ></circle>\r\n\r\n    <!-- \u0422\u0435\u043A\u0441\u0442 \u0441 \u043F\u0440\u043E\u0446\u0435\u043D\u0442\u043E\u043C -->\r\n    <text\r\n      [attr.x]=\"size/2\"\r\n      [attr.y]=\"size/2\"\r\n      text-anchor=\"middle\"\r\n      dominant-baseline=\"middle\"\r\n      font-size=\"1.2rem\"\r\n      font-weight=\"600\"\r\n      fill=\"#111\"\r\n    >\r\n      {{ getPercent() }}%\r\n    </text>\r\n  </svg>\r\n</div>\r\n", styles: [".gauge-wrapper{display:inline-block;position:relative}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: GaugeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-gauge', imports: [CommonModule], template: "<div class=\"gauge-wrapper\" [style.width.px]=\"size\" [style.height.px]=\"size\">\r\n  <svg [attr.width]=\"size\" [attr.height]=\"size\">\r\n    <!-- \u0424\u043E\u043D \u043A\u0440\u0443\u0433\u0430 -->\r\n    <circle\r\n      [attr.cx]=\"size/2\"\r\n      [attr.cy]=\"size/2\"\r\n      [attr.r]=\"radius\"\r\n      [attr.stroke-width]=\"strokeWidth\"\r\n      [attr.stroke]=\"backgroundColor\"\r\n      fill=\"none\"\r\n    ></circle>\r\n\r\n    <!-- \u0417\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043D\u044B\u0439 \u043A\u0440\u0443\u0433 -->\r\n    <circle\r\n      [attr.cx]=\"size/2\"\r\n      [attr.cy]=\"size/2\"\r\n      [attr.r]=\"radius\"\r\n      [attr.stroke-width]=\"strokeWidth\"\r\n      [attr.stroke]=\"color\"\r\n      fill=\"none\"\r\n      [attr.stroke-dasharray]=\"circumference\"\r\n      [attr.stroke-dashoffset]=\"getStrokeDashOffset()\"\r\n      stroke-linecap=\"round\"\r\n      [style.transition]=\"animate ? 'stroke-dashoffset 0.3s ease' : 'none'\"\r\n    ></circle>\r\n\r\n    <!-- \u0422\u0435\u043A\u0441\u0442 \u0441 \u043F\u0440\u043E\u0446\u0435\u043D\u0442\u043E\u043C -->\r\n    <text\r\n      [attr.x]=\"size/2\"\r\n      [attr.y]=\"size/2\"\r\n      text-anchor=\"middle\"\r\n      dominant-baseline=\"middle\"\r\n      font-size=\"1.2rem\"\r\n      font-weight=\"600\"\r\n      fill=\"#111\"\r\n    >\r\n      {{ getPercent() }}%\r\n    </text>\r\n  </svg>\r\n</div>\r\n", styles: [".gauge-wrapper{display:inline-block;position:relative}\n"] }]
        }], propDecorators: { value: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], color: [{
                type: Input
            }], backgroundColor: [{
                type: Input
            }], size: [{
                type: Input
            }], strokeWidth: [{
                type: Input
            }], animate: [{
                type: Input
            }] } });

class HeatMapComponent {
    /** Подписи оси X (например: часы) */
    labelsX = [];
    /** Подписи оси Y (например: дни недели) */
    labelsY = [];
    /** Данные: массив строк по Y, каждая строка содержит значения по X */
    data = [];
    /** Цветовая палитра: от минимального к максимальному */
    colors = ['#e5e7eb', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a'];
    /** Максимальное значение для нормализации */
    maxValue = 1;
    ngOnChanges(changes) {
        if (this.data?.length) {
            const flat = this.data.flat();
            this.maxValue = Math.max(...flat, 1);
        }
    }
    /** Возвращает цвет ячейки в зависимости от значения */
    getCellColor(value) {
        const ratio = value / this.maxValue;
        const index = Math.floor(ratio * (this.colors.length - 1));
        return this.colors[index];
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: HeatMapComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: HeatMapComponent, isStandalone: true, selector: "lib-heat-map", inputs: { labelsX: "labelsX", labelsY: "labelsY", data: "data", colors: "colors" }, usesOnChanges: true, ngImport: i0, template: "<div class=\"heatmap-container\" @fadeIn>\r\n    <div class=\"heatmap-header\">\r\n        <div class=\"corner\"></div>\r\n        <div class=\"x-labels\">\r\n            <div *ngFor=\"let x of labelsX\" class=\"x-label\">\r\n                {{ x }}\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"heatmap-body\">\r\n        <div class=\"y-labels\">\r\n            <div *ngFor=\"let y of labelsY\" class=\"y-label\">\r\n                {{ y }}\r\n            </div>\r\n        </div>\r\n        <div class=\"grid\">\r\n            <div *ngFor=\"let row of data\" class=\"row\">\r\n                <div *ngFor=\"let cell of row\" class=\"cell\" [ngStyle]=\"{ 'background-color': getCellColor(cell) }\"\r\n                    [title]=\"cell\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".heatmap-container{display:inline-block;padding:16px 20px;font-family:Inter,sans-serif;-webkit-user-select:none;user-select:none;background:#fff;border-radius:12px;box-shadow:0 4px 16px #00000014}.heatmap-header{display:flex;align-items:center;margin-bottom:10px;margin-left:44px}.corner{width:40px}.x-labels{display:grid;grid-auto-flow:column;gap:8px;justify-content:start}.x-label{width:28px;text-align:center;font-size:11px;color:#4b5563}.heatmap-body{display:flex}.y-labels{display:grid;gap:8px;margin-top:4px}.y-label{height:28px;font-size:11px;color:#4b5563;display:flex;align-items:center;justify-content:flex-end;width:40px;font-weight:500}.grid{display:grid;gap:8px}.row{display:grid;grid-auto-flow:column;gap:8px}.cell{width:28px;height:28px;border-radius:6px;transition:transform .25s ease,box-shadow .25s ease;cursor:pointer;border:1px solid rgba(255,255,255,.25)}.cell:hover{transform:scale(1.12);box-shadow:0 0 6px #0003}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [
            trigger('fadeIn', [
                transition(':enter', [
                    style({ opacity: 0, transform: 'scale(0.95)' }),
                    animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
                ])
            ])
        ] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: HeatMapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-heat-map', imports: [CommonModule], animations: [
                        trigger('fadeIn', [
                            transition(':enter', [
                                style({ opacity: 0, transform: 'scale(0.95)' }),
                                animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
                            ])
                        ])
                    ], template: "<div class=\"heatmap-container\" @fadeIn>\r\n    <div class=\"heatmap-header\">\r\n        <div class=\"corner\"></div>\r\n        <div class=\"x-labels\">\r\n            <div *ngFor=\"let x of labelsX\" class=\"x-label\">\r\n                {{ x }}\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"heatmap-body\">\r\n        <div class=\"y-labels\">\r\n            <div *ngFor=\"let y of labelsY\" class=\"y-label\">\r\n                {{ y }}\r\n            </div>\r\n        </div>\r\n        <div class=\"grid\">\r\n            <div *ngFor=\"let row of data\" class=\"row\">\r\n                <div *ngFor=\"let cell of row\" class=\"cell\" [ngStyle]=\"{ 'background-color': getCellColor(cell) }\"\r\n                    [title]=\"cell\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".heatmap-container{display:inline-block;padding:16px 20px;font-family:Inter,sans-serif;-webkit-user-select:none;user-select:none;background:#fff;border-radius:12px;box-shadow:0 4px 16px #00000014}.heatmap-header{display:flex;align-items:center;margin-bottom:10px;margin-left:44px}.corner{width:40px}.x-labels{display:grid;grid-auto-flow:column;gap:8px;justify-content:start}.x-label{width:28px;text-align:center;font-size:11px;color:#4b5563}.heatmap-body{display:flex}.y-labels{display:grid;gap:8px;margin-top:4px}.y-label{height:28px;font-size:11px;color:#4b5563;display:flex;align-items:center;justify-content:flex-end;width:40px;font-weight:500}.grid{display:grid;gap:8px}.row{display:grid;grid-auto-flow:column;gap:8px}.cell{width:28px;height:28px;border-radius:6px;transition:transform .25s ease,box-shadow .25s ease;cursor:pointer;border:1px solid rgba(255,255,255,.25)}.cell:hover{transform:scale(1.12);box-shadow:0 0 6px #0003}\n"] }]
        }], propDecorators: { labelsX: [{
                type: Input
            }], labelsY: [{
                type: Input
            }], data: [{
                type: Input
            }], colors: [{
                type: Input
            }] } });

class TimelineComponent {
    /** Список событий */
    events = [];
    /** Вертикальная или горизонтальная ориентация */
    orientation = 'vertical';
    /** Цвет линии по умолчанию */
    lineColor = '#d1d5db';
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: TimelineComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: TimelineComponent, isStandalone: true, selector: "lib-timeline", inputs: { events: "events", orientation: "orientation", lineColor: "lineColor" }, ngImport: i0, template: "<div class=\"timeline-container\" [ngClass]=\"orientation\" @fadeStagger>\r\n    <div *ngFor=\"let event of events\" class=\"timeline-item\">\r\n        <div class=\"timeline-line\" [ngStyle]=\"{ background: event.color || lineColor }\"></div>\r\n        <div class=\"timeline-dot\" [ngStyle]=\"{ background: event.color || lineColor }\">\r\n            <span *ngIf=\"event.icon\" class=\"timeline-icon\">{{ event.icon }}</span>\r\n        </div>\r\n        <div class=\"timeline-content\">\r\n            <div class=\"timeline-date\">{{ event.date }}</div>\r\n            <div class=\"timeline-title\">{{ event.title }}</div>\r\n            <div *ngIf=\"event.description\" class=\"timeline-desc\">{{ event.description }}</div>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".timeline-container{display:flex;flex-direction:column;position:relative;padding:10px;font-family:Inter,sans-serif}.timeline-container.horizontal{flex-direction:row;align-items:flex-start;overflow-x:auto}.timeline-container.horizontal .timeline-item{flex-direction:column;align-items:center;margin-right:40px;position:relative}.timeline-container.horizontal .timeline-item .timeline-line{position:absolute;height:4px;width:100%;top:18px;left:50%;transform:translate(-50%)}.timeline-container.horizontal .timeline-item .timeline-dot{position:relative;margin-bottom:8px}.timeline-item{position:relative;display:flex;align-items:flex-start;padding-left:30px;width:100%}.timeline-item .timeline-line{position:absolute;left:10px;top:0;width:2px;height:100%;background:var(--line-color, #d1d5db)}.timeline-item .timeline-dot{position:absolute;left:4px;width:14px;height:14px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff}.timeline-item .timeline-content{background:#fff;border-radius:8px;padding:10px 14px;box-shadow:0 2px 8px #00000014;width:fit-content;min-width:200px;width:100%;margin-bottom:15px}.timeline-item .timeline-content .timeline-date{font-size:11px;color:#6b7280;margin-bottom:4px}.timeline-item .timeline-content .timeline-title{font-weight:600;color:#111827;margin-bottom:4px}.timeline-item .timeline-content .timeline-desc{font-size:13px;color:#4b5563}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [
            trigger('fadeStagger', [
                transition(':enter', [
                    query('.timeline-item', [
                        style({ opacity: 0, transform: 'translateY(10px)' }),
                        stagger(120, animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
                    ])
                ])
            ])
        ] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: TimelineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-timeline', imports: [CommonModule], animations: [
                        trigger('fadeStagger', [
                            transition(':enter', [
                                query('.timeline-item', [
                                    style({ opacity: 0, transform: 'translateY(10px)' }),
                                    stagger(120, animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))
                                ])
                            ])
                        ])
                    ], template: "<div class=\"timeline-container\" [ngClass]=\"orientation\" @fadeStagger>\r\n    <div *ngFor=\"let event of events\" class=\"timeline-item\">\r\n        <div class=\"timeline-line\" [ngStyle]=\"{ background: event.color || lineColor }\"></div>\r\n        <div class=\"timeline-dot\" [ngStyle]=\"{ background: event.color || lineColor }\">\r\n            <span *ngIf=\"event.icon\" class=\"timeline-icon\">{{ event.icon }}</span>\r\n        </div>\r\n        <div class=\"timeline-content\">\r\n            <div class=\"timeline-date\">{{ event.date }}</div>\r\n            <div class=\"timeline-title\">{{ event.title }}</div>\r\n            <div *ngIf=\"event.description\" class=\"timeline-desc\">{{ event.description }}</div>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".timeline-container{display:flex;flex-direction:column;position:relative;padding:10px;font-family:Inter,sans-serif}.timeline-container.horizontal{flex-direction:row;align-items:flex-start;overflow-x:auto}.timeline-container.horizontal .timeline-item{flex-direction:column;align-items:center;margin-right:40px;position:relative}.timeline-container.horizontal .timeline-item .timeline-line{position:absolute;height:4px;width:100%;top:18px;left:50%;transform:translate(-50%)}.timeline-container.horizontal .timeline-item .timeline-dot{position:relative;margin-bottom:8px}.timeline-item{position:relative;display:flex;align-items:flex-start;padding-left:30px;width:100%}.timeline-item .timeline-line{position:absolute;left:10px;top:0;width:2px;height:100%;background:var(--line-color, #d1d5db)}.timeline-item .timeline-dot{position:absolute;left:4px;width:14px;height:14px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff}.timeline-item .timeline-content{background:#fff;border-radius:8px;padding:10px 14px;box-shadow:0 2px 8px #00000014;width:fit-content;min-width:200px;width:100%;margin-bottom:15px}.timeline-item .timeline-content .timeline-date{font-size:11px;color:#6b7280;margin-bottom:4px}.timeline-item .timeline-content .timeline-title{font-weight:600;color:#111827;margin-bottom:4px}.timeline-item .timeline-content .timeline-desc{font-size:13px;color:#4b5563}\n"] }]
        }], propDecorators: { events: [{
                type: Input
            }], orientation: [{
                type: Input
            }], lineColor: [{
                type: Input
            }] } });

class ProgressBarComponent {
    /** Показывать плавную анимацию заполнения */
    animate = false;
    /** Пульсация фона */
    pulse = false;
    /** Градиентное движение */
    gradient = false;
    /** Включить анимацию появления при монтировании */
    fadeInOnInit = false;
    /** Длительность анимации появления в миллисекундах */
    fadeInDuration = 0;
    /** Текущее значение прогресса */
    value = 0;
    /** Максимальное значение прогресса */
    max = 0;
    /** Цвет заполненной части */
    color = '';
    /** Цвет фона полосы */
    backgroundColor = '';
    /** Высота полосы */
    height = '';
    /** Закругление углов */
    borderRadius = '';
    /** Показывать текст прогресса */
    showLabel = false;
    /** Формат текста, если showLabel = true */
    labelTemplate = 'percent';
    /** Пользовательский текст, если labelTemplate = 'custom' */
    customLabel = '';
    /** Локальное значение для анимации появления */
    progressValue = 0;
    /** Флаг для CSS-класса fade-in */
    fadeInActive = false;
    ngOnInit() {
        if (this.fadeInOnInit) {
            this.progressValue = 0;
            setTimeout(() => {
                this.fadeInActive = true;
                this.progressValue = this.value;
            }, 50);
        }
        else {
            this.progressValue = this.value;
        }
    }
    getProgress() {
        return Math.min(Math.max((this.progressValue / this.max) * 100, 0), 100);
    }
    getLabel() {
        switch (this.labelTemplate) {
            case 'percent': return `${Math.round(this.getProgress())}%`;
            case 'fraction': return `${this.value} / ${this.max}`;
            case 'custom': return this.customLabel;
            default: return '';
        }
    }
    getWrapperStyles() {
        return {
            backgroundColor: this.backgroundColor,
            borderRadius: this.borderRadius,
            height: this.height,
            overflow: 'hidden',
            width: '100%',
        };
    }
    getBarStyles() {
        return {
            width: `${this.getProgress()}%`,
            backgroundColor: this.color,
            height: '100%',
            borderRadius: this.borderRadius,
            transition: this.animate ? `width 0.4s ease, opacity ${this.fadeInDuration}ms ease` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '600',
            fontSize: '0.9rem',
            opacity: this.fadeInOnInit ? (this.fadeInActive ? 1 : 0) : 1,
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ProgressBarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: ProgressBarComponent, isStandalone: true, selector: "lib-progress-bar", inputs: { animate: "animate", pulse: "pulse", gradient: "gradient", fadeInOnInit: "fadeInOnInit", fadeInDuration: "fadeInDuration", value: "value", max: "max", color: "color", backgroundColor: "backgroundColor", height: "height", borderRadius: "borderRadius", showLabel: "showLabel", labelTemplate: "labelTemplate", customLabel: "customLabel" }, ngImport: i0, template: "<div class=\"progress-wrapper\" [ngStyle]=\"getWrapperStyles()\">\r\n    <div class=\"progress-bar\" [class.animated]=\"animate || pulse\" [class.gradient]=\"gradient\"\r\n        [ngStyle]=\"getBarStyles()\">\r\n        <span *ngIf=\"showLabel\" class=\"progress-label\">{{ getLabel() }}</span>\r\n    </div>\r\n</div>", styles: [".progress-wrapper{position:relative;overflow:hidden}.progress-bar{text-align:center;white-space:nowrap;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:.9rem;height:100%;transition:width .5s ease-in-out;transform-origin:left;transform:scaleX(1)}.progress-bar.animated{animation:pulse 2s infinite}.progress-bar .progress-label{position:absolute;width:100%;text-align:center;left:0;top:50%;transform:translateY(-50%);pointer-events:none}@keyframes slideInX{0%{transform:scaleX(0)}to{transform:scaleX(var(--scale-x))}}@keyframes pulse{0%{filter:brightness(1)}50%{filter:brightness(1.15)}to{filter:brightness(1)}}.progress-bar.gradient{background:linear-gradient(270deg,#16a34a,#22c55e,#16a34a);background-size:600% 600%;animation:gradientMove 3s ease infinite}@keyframes gradientMove{0%{background-position:0% 50%}50%{background-position:100% 50%}to{background-position:0% 50%}}.progress-bar.animate-on-load{width:0%;animation:fillWidth 1s ease-out forwards}@keyframes fillWidth{0%{width:0%}to{width:var(--target-width)}}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ProgressBarComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-progress-bar', imports: [CommonModule], template: "<div class=\"progress-wrapper\" [ngStyle]=\"getWrapperStyles()\">\r\n    <div class=\"progress-bar\" [class.animated]=\"animate || pulse\" [class.gradient]=\"gradient\"\r\n        [ngStyle]=\"getBarStyles()\">\r\n        <span *ngIf=\"showLabel\" class=\"progress-label\">{{ getLabel() }}</span>\r\n    </div>\r\n</div>", styles: [".progress-wrapper{position:relative;overflow:hidden}.progress-bar{text-align:center;white-space:nowrap;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:.9rem;height:100%;transition:width .5s ease-in-out;transform-origin:left;transform:scaleX(1)}.progress-bar.animated{animation:pulse 2s infinite}.progress-bar .progress-label{position:absolute;width:100%;text-align:center;left:0;top:50%;transform:translateY(-50%);pointer-events:none}@keyframes slideInX{0%{transform:scaleX(0)}to{transform:scaleX(var(--scale-x))}}@keyframes pulse{0%{filter:brightness(1)}50%{filter:brightness(1.15)}to{filter:brightness(1)}}.progress-bar.gradient{background:linear-gradient(270deg,#16a34a,#22c55e,#16a34a);background-size:600% 600%;animation:gradientMove 3s ease infinite}@keyframes gradientMove{0%{background-position:0% 50%}50%{background-position:100% 50%}to{background-position:0% 50%}}.progress-bar.animate-on-load{width:0%;animation:fillWidth 1s ease-out forwards}@keyframes fillWidth{0%{width:0%}to{width:var(--target-width)}}\n"] }]
        }], propDecorators: { animate: [{
                type: Input
            }], pulse: [{
                type: Input
            }], gradient: [{
                type: Input
            }], fadeInOnInit: [{
                type: Input
            }], fadeInDuration: [{
                type: Input
            }], value: [{
                type: Input
            }], max: [{
                type: Input
            }], color: [{
                type: Input
            }], backgroundColor: [{
                type: Input
            }], height: [{
                type: Input
            }], borderRadius: [{
                type: Input
            }], showLabel: [{
                type: Input
            }], labelTemplate: [{
                type: Input
            }], customLabel: [{
                type: Input
            }] } });

class ToastService {
    toastsSubject = new BehaviorSubject([]);
    toasts$ = this.toastsSubject.asObservable();
    show(toast) {
        const newToast = { ...toast, id: v4() };
        const current = this.toastsSubject.value;
        this.toastsSubject.next([...current, newToast]);
        if (toast.duration && toast.duration > 0) {
            setTimeout(() => this.remove(newToast.id), toast.duration);
        }
    }
    remove(id) {
        const current = this.toastsSubject.value.filter(t => t.id !== id);
        this.toastsSubject.next(current);
    }
    success(message, title, duration = 3000) {
        this.show({ type: 'success', message, title, duration });
    }
    error(message, title, duration = 3000) {
        this.show({ type: 'error', message, title, duration });
    }
    info(message, title, duration = 3000) {
        this.show({ type: 'info', message, title, duration });
    }
    warning(message, title, duration = 3000) {
        this.show({ type: 'warning', message, title, duration });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ToastService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ToastService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ToastService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class ToastComponent {
    toastService;
    toasts = [];
    /** Кастомные CSS-классы */
    customClasses = {};
    /** Кастомные inline-стили */
    customStyles = {};
    /** Позиция уведомлений */
    position = 'top-right';
    constructor(toastService) {
        this.toastService = toastService;
    }
    ngOnInit() {
        this.toastService.toasts$.subscribe(list => this.toasts = list);
    }
    /** Закрыть уведомление вручную */
    closeToast(toast) {
        if (toast.id)
            this.toastService.remove(toast.id);
    }
    /** Цвет по типу */
    getToastColor(type) {
        switch (type) {
            case 'success': return '#16a34a';
            case 'error': return '#dc2626';
            case 'warning': return '#f59e0b';
            case 'info': return '#3b82f6';
            default: return '#374151';
        }
    }
    /** Иконка по типу */
    getDefaultIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '🔔';
        }
    }
    /** Стили контейнера с поддержкой позиции */
    getContainerStyles() {
        const posStyles = this.getPositionStyles();
        return {
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: '9999',
            padding: '10px',
            ...posStyles,
            ...(this.customStyles.container || {})
        };
    }
    /** Стили одного уведомления */
    getToastStyles(toast) {
        return {
            background: '#fff',
            color: '#111',
            borderLeft: `4px solid ${this.getToastColor(toast.type)}`,
            borderRadius: '8px',
            padding: '10px 14px',
            minWidth: '260px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...(this.customStyles.toast || {})
        };
    }
    /** Позиционирование контейнера */
    getPositionStyles() {
        switch (this.position) {
            case 'top-left': return { top: '10px', left: '10px' };
            case 'top-right': return { top: '10px', right: '10px' };
            case 'bottom-left': return { bottom: '10px', left: '10px' };
            case 'bottom-right': return { bottom: '10px', right: '10px' };
            default: return { top: '10px', right: '10px' };
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ToastComponent, deps: [{ token: ToastService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: ToastComponent, isStandalone: true, selector: "lib-toast", inputs: { customClasses: "customClasses", customStyles: "customStyles", position: "position" }, ngImport: i0, template: "<div class=\"toast-container\" [ngStyle]=\"getContainerStyles()\" [ngClass]=\"customClasses.container\">\r\n  <div *ngFor=\"let toast of toasts\" \r\n       class=\"toast\" \r\n       [ngClass]=\"customClasses.toast\" \r\n       [ngStyle]=\"getToastStyles(toast)\"\r\n       [@fadeInOut]>\r\n       \r\n    <div class=\"toast-icon\" [innerHTML]=\"toast.icon || getDefaultIcon(toast.type)\"></div>\r\n    \r\n    <div class=\"toast-content\">\r\n      <strong *ngIf=\"toast.title\">{{ toast.title }}</strong>\r\n      <p>{{ toast.message }}</p>\r\n    </div>\r\n    \r\n    <button class=\"toast-close\" (click)=\"closeToast(toast)\">\u2715</button>\r\n  </div>\r\n</div>\r\n", styles: [".toast-container{display:flex;flex-direction:column;gap:10px;z-index:9999}.toast{display:flex;align-items:center;justify-content:space-between;border-radius:8px;padding:10px 14px;min-width:260px;background:#fff;box-shadow:0 4px 10px #0000001a}.toast .toast-icon{margin-right:10px;font-size:1.2rem}.toast .toast-content{flex:1}.toast .toast-close{background:none;border:none;cursor:pointer;font-size:1rem}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [
            trigger('fadeInOut', [
                transition(':enter', [
                    style({ opacity: 0, transform: 'translateY(-20px)' }),
                    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                ]),
                transition(':leave', [
                    animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
                ])
            ])
        ] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ToastComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-toast', imports: [CommonModule], animations: [
                        trigger('fadeInOut', [
                            transition(':enter', [
                                style({ opacity: 0, transform: 'translateY(-20px)' }),
                                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                            ]),
                            transition(':leave', [
                                animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
                            ])
                        ])
                    ], template: "<div class=\"toast-container\" [ngStyle]=\"getContainerStyles()\" [ngClass]=\"customClasses.container\">\r\n  <div *ngFor=\"let toast of toasts\" \r\n       class=\"toast\" \r\n       [ngClass]=\"customClasses.toast\" \r\n       [ngStyle]=\"getToastStyles(toast)\"\r\n       [@fadeInOut]>\r\n       \r\n    <div class=\"toast-icon\" [innerHTML]=\"toast.icon || getDefaultIcon(toast.type)\"></div>\r\n    \r\n    <div class=\"toast-content\">\r\n      <strong *ngIf=\"toast.title\">{{ toast.title }}</strong>\r\n      <p>{{ toast.message }}</p>\r\n    </div>\r\n    \r\n    <button class=\"toast-close\" (click)=\"closeToast(toast)\">\u2715</button>\r\n  </div>\r\n</div>\r\n", styles: [".toast-container{display:flex;flex-direction:column;gap:10px;z-index:9999}.toast{display:flex;align-items:center;justify-content:space-between;border-radius:8px;padding:10px 14px;min-width:260px;background:#fff;box-shadow:0 4px 10px #0000001a}.toast .toast-icon{margin-right:10px;font-size:1.2rem}.toast .toast-content{flex:1}.toast .toast-close{background:none;border:none;cursor:pointer;font-size:1rem}\n"] }]
        }], ctorParameters: () => [{ type: ToastService }], propDecorators: { customClasses: [{
                type: Input
            }], customStyles: [{
                type: Input
            }], position: [{
                type: Input
            }] } });

class ModalComponent {
    /** Заголовок модального окна */
    title = '';
    /** Состояние — открыта ли модалка */
    isOpen = true;
    /** Контент модалки (HTML или текст) */
    bodyText = '';
    /** Массив кнопок в нижней панели */
    buttons = [];
    /** Кастомные CSS-классы */
    customClasses = {};
    /** Кастомные inline-стили */
    customStyles = {};
    /** Можно ли закрыть по клику на фон */
    closeOnOverlayClick = true;
    /** Событие при открытии окна */
    opened = new EventEmitter();
    /** Событие при закрытии окна */
    closed = new EventEmitter();
    /** Открыть окно */
    open() {
        this.isOpen = true;
        this.opened.emit();
    }
    /** Закрыть окно */
    close() {
        this.isOpen = false;
        this.closed.emit();
    }
    /** Клик по фону */
    onOverlayClick(event) {
        if (this.closeOnOverlayClick && event.target.classList.contains('modal-overlay')) {
            this.close();
        }
    }
    /** Получить стиль кнопки по типу */
    getButtonStyle(button) {
        let background = '#e5e7eb';
        let color = '#111827';
        switch (button.color) {
            case 'primary':
                background = '#16a34a';
                color = '#fff';
                break;
            case 'secondary':
                background = '#3b82f6';
                color = '#fff';
                break;
            case 'danger':
                background = '#ef4444';
                color = '#fff';
                break;
            default:
                if (button.color && button.color.startsWith('#')) {
                    background = button.color;
                    color = '#fff';
                }
                break;
        }
        return {
            background,
            color,
            border: 'none',
            padding: '0.5rem 1.2rem',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: button.disabled ? 'not-allowed' : 'pointer',
            opacity: button.disabled ? '0.6' : '1',
            transition: 'all 0.2s ease'
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ModalComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: ModalComponent, isStandalone: true, selector: "lib-modal", inputs: { title: "title", isOpen: "isOpen", bodyText: "bodyText", buttons: "buttons", customClasses: "customClasses", customStyles: "customStyles", closeOnOverlayClick: "closeOnOverlayClick" }, outputs: { opened: "opened", closed: "closed" }, ngImport: i0, template: "<div class=\"modal-overlay\" *ngIf=\"isOpen\" [ngClass]=\"customClasses.overlay\" [ngStyle]=\"customStyles.overlay\"\r\n  (click)=\"onOverlayClick($event)\">\r\n  <div class=\"modal-container\" [ngClass]=\"customClasses.container\" [ngStyle]=\"customStyles.container\">\r\n    <div class=\"modal-header\" [ngClass]=\"customClasses.header\" [ngStyle]=\"customStyles.header\">\r\n      <h3>{{ title }}</h3>\r\n      <button class=\"modal-close\" [ngClass]=\"customClasses.closeButton\" (click)=\"close()\">\r\n        \u2715\r\n      </button>\r\n    </div>\r\n\r\n    <div class=\"modal-body\" [ngClass]=\"customClasses.body\" [ngStyle]=\"customStyles.body\">\r\n      {{ bodyText }}\r\n    </div>\r\n\r\n\r\n    <div class=\"modal-footer\" [ngClass]=\"customClasses.footer\" [ngStyle]=\"customStyles.footer\">\r\n      <button *ngFor=\"let btn of buttons\" [disabled]=\"btn.disabled\" [title]=\"btn.tooltip || ''\"\r\n        [ngClass]=\"btn.customClass\" [ngStyle]=\"getButtonStyle(btn)\" (click)=\"btn.action()\">\r\n        <span *ngIf=\"btn.icon\" [innerHTML]=\"btn.icon\"></span>\r\n        {{ btn.label }}\r\n      </button>\r\n    </div>\r\n  </div>\r\n</div>", styles: [".modal-overlay{position:fixed;inset:0;background:#00000073;display:flex;justify-content:center;align-items:center;z-index:1000;animation:fadeIn .25s ease-in-out}.modal-container{background:#fff;border-radius:12px;width:90%;max-width:500px;box-shadow:0 10px 25px #00000026;overflow:hidden;animation:scaleIn .3s ease-in-out}.modal-header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem;border-bottom:1px solid #eee;font-weight:600}.modal-header h3{margin:0}.modal-body{padding:1.25rem;margin-bottom:20px}.modal-footer{display:flex;justify-content:flex-end;gap:.75rem;padding:1rem 1.25rem}.modal-close{background:transparent;border:none;font-size:1.3rem;cursor:pointer;color:#777;transition:color .2s ease}.modal-close:hover{color:#000}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes scaleIn{0%{transform:scale(.95);opacity:.9}to{transform:scale(1);opacity:1}}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: ModalComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-modal', imports: [CommonModule], template: "<div class=\"modal-overlay\" *ngIf=\"isOpen\" [ngClass]=\"customClasses.overlay\" [ngStyle]=\"customStyles.overlay\"\r\n  (click)=\"onOverlayClick($event)\">\r\n  <div class=\"modal-container\" [ngClass]=\"customClasses.container\" [ngStyle]=\"customStyles.container\">\r\n    <div class=\"modal-header\" [ngClass]=\"customClasses.header\" [ngStyle]=\"customStyles.header\">\r\n      <h3>{{ title }}</h3>\r\n      <button class=\"modal-close\" [ngClass]=\"customClasses.closeButton\" (click)=\"close()\">\r\n        \u2715\r\n      </button>\r\n    </div>\r\n\r\n    <div class=\"modal-body\" [ngClass]=\"customClasses.body\" [ngStyle]=\"customStyles.body\">\r\n      {{ bodyText }}\r\n    </div>\r\n\r\n\r\n    <div class=\"modal-footer\" [ngClass]=\"customClasses.footer\" [ngStyle]=\"customStyles.footer\">\r\n      <button *ngFor=\"let btn of buttons\" [disabled]=\"btn.disabled\" [title]=\"btn.tooltip || ''\"\r\n        [ngClass]=\"btn.customClass\" [ngStyle]=\"getButtonStyle(btn)\" (click)=\"btn.action()\">\r\n        <span *ngIf=\"btn.icon\" [innerHTML]=\"btn.icon\"></span>\r\n        {{ btn.label }}\r\n      </button>\r\n    </div>\r\n  </div>\r\n</div>", styles: [".modal-overlay{position:fixed;inset:0;background:#00000073;display:flex;justify-content:center;align-items:center;z-index:1000;animation:fadeIn .25s ease-in-out}.modal-container{background:#fff;border-radius:12px;width:90%;max-width:500px;box-shadow:0 10px 25px #00000026;overflow:hidden;animation:scaleIn .3s ease-in-out}.modal-header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem;border-bottom:1px solid #eee;font-weight:600}.modal-header h3{margin:0}.modal-body{padding:1.25rem;margin-bottom:20px}.modal-footer{display:flex;justify-content:flex-end;gap:.75rem;padding:1rem 1.25rem}.modal-close{background:transparent;border:none;font-size:1.3rem;cursor:pointer;color:#777;transition:color .2s ease}.modal-close:hover{color:#000}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes scaleIn{0%{transform:scale(.95);opacity:.9}to{transform:scale(1);opacity:1}}\n"] }]
        }], propDecorators: { title: [{
                type: Input
            }], isOpen: [{
                type: Input
            }], bodyText: [{
                type: Input
            }], buttons: [{
                type: Input
            }], customClasses: [{
                type: Input
            }], customStyles: [{
                type: Input
            }], closeOnOverlayClick: [{
                type: Input
            }], opened: [{
                type: Output
            }], closed: [{
                type: Output
            }] } });

class TooltipComponent {
    el;
    /** Текст или HTML контент для тултипа */
    content = 'Подсказка';
    /** Позиция тултипа */
    position = 'top';
    /** Задержка перед появлением */
    showDelay = 300;
    /** Задержка перед скрытием */
    hideDelay = 200;
    /** Максимальная ширина */
    maxWidth = '220px';
    /** Флаг видимости */
    visible = false;
    showTimeout;
    hideTimeout;
    constructor(el) {
        this.el = el;
    }
    onMouseEnter() {
        clearTimeout(this.hideTimeout);
        this.showTimeout = setTimeout(() => (this.visible = true), this.showDelay);
    }
    onMouseLeave() {
        clearTimeout(this.showTimeout);
        this.hideTimeout = setTimeout(() => (this.visible = false), this.hideDelay);
    }
    /** Класс для позиционирования */
    getPositionClass() {
        return `tooltip-${this.position}`;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: TooltipComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: TooltipComponent, isStandalone: true, selector: "lib-tooltip", inputs: { content: "content", position: "position", showDelay: "showDelay", hideDelay: "hideDelay", maxWidth: "maxWidth" }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" } }, ngImport: i0, template: "<div class=\"tooltip-wrapper\">\r\n    <ng-content></ng-content>\r\n    <div class=\"tooltip-box\" *ngIf=\"visible\" [@fadeInOut] [ngClass]=\"getPositionClass()\"\r\n        [ngStyle]=\"{ 'max-width': maxWidth }\">\r\n        <div class=\"tooltip-content\" [innerHTML]=\"content\"></div>\r\n        <div class=\"tooltip-arrow\"></div>\r\n    </div>\r\n</div>", styles: [".tooltip-wrapper{position:relative;display:inline-block}.tooltip-box{position:absolute;background:#111827;color:#fff;padding:8px 10px;border-radius:6px;font-size:13px;line-height:1.3;box-shadow:0 4px 10px #00000026;z-index:1000;white-space:normal;transition:opacity .15s ease}.tooltip-box .tooltip-content{pointer-events:none}.tooltip-box .tooltip-arrow{position:absolute;width:0;height:0;border-style:solid}.tooltip-box.tooltip-top{bottom:100%;left:50%;transform:translate(-50%) translateY(-6px)}.tooltip-box.tooltip-top .tooltip-arrow{top:100%;left:50%;transform:translate(-50%);border-width:6px 6px 0 6px;border-color:#111827 transparent transparent transparent}.tooltip-box.tooltip-bottom{top:100%;left:50%;transform:translate(-50%) translateY(6px)}.tooltip-box.tooltip-bottom .tooltip-arrow{bottom:100%;left:50%;transform:translate(-50%);border-width:0 6px 6px 6px;border-color:transparent transparent #111827 transparent}.tooltip-box.tooltip-left{right:100%;top:50%;transform:translateY(-50%) translate(-6px)}.tooltip-box.tooltip-left .tooltip-arrow{top:50%;left:100%;transform:translateY(-50%);border-width:6px 0 6px 6px;border-color:transparent transparent transparent #111827}.tooltip-box.tooltip-right{left:100%;top:50%;transform:translateY(-50%) translate(6px)}.tooltip-box.tooltip-right .tooltip-arrow{top:50%;right:100%;transform:translateY(-50%);border-width:6px 6px 6px 0;border-color:transparent #111827 transparent transparent}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [
            trigger('fadeInOut', [
                transition(':enter', [
                    style({ opacity: 0, transform: 'scale(0.95)' }),
                    animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
                ]),
                transition(':leave', [
                    animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
                ])
            ])
        ] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-tooltip', imports: [CommonModule], animations: [
                        trigger('fadeInOut', [
                            transition(':enter', [
                                style({ opacity: 0, transform: 'scale(0.95)' }),
                                animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
                            ]),
                            transition(':leave', [
                                animate('100ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
                            ])
                        ])
                    ], template: "<div class=\"tooltip-wrapper\">\r\n    <ng-content></ng-content>\r\n    <div class=\"tooltip-box\" *ngIf=\"visible\" [@fadeInOut] [ngClass]=\"getPositionClass()\"\r\n        [ngStyle]=\"{ 'max-width': maxWidth }\">\r\n        <div class=\"tooltip-content\" [innerHTML]=\"content\"></div>\r\n        <div class=\"tooltip-arrow\"></div>\r\n    </div>\r\n</div>", styles: [".tooltip-wrapper{position:relative;display:inline-block}.tooltip-box{position:absolute;background:#111827;color:#fff;padding:8px 10px;border-radius:6px;font-size:13px;line-height:1.3;box-shadow:0 4px 10px #00000026;z-index:1000;white-space:normal;transition:opacity .15s ease}.tooltip-box .tooltip-content{pointer-events:none}.tooltip-box .tooltip-arrow{position:absolute;width:0;height:0;border-style:solid}.tooltip-box.tooltip-top{bottom:100%;left:50%;transform:translate(-50%) translateY(-6px)}.tooltip-box.tooltip-top .tooltip-arrow{top:100%;left:50%;transform:translate(-50%);border-width:6px 6px 0 6px;border-color:#111827 transparent transparent transparent}.tooltip-box.tooltip-bottom{top:100%;left:50%;transform:translate(-50%) translateY(6px)}.tooltip-box.tooltip-bottom .tooltip-arrow{bottom:100%;left:50%;transform:translate(-50%);border-width:0 6px 6px 6px;border-color:transparent transparent #111827 transparent}.tooltip-box.tooltip-left{right:100%;top:50%;transform:translateY(-50%) translate(-6px)}.tooltip-box.tooltip-left .tooltip-arrow{top:50%;left:100%;transform:translateY(-50%);border-width:6px 0 6px 6px;border-color:transparent transparent transparent #111827}.tooltip-box.tooltip-right{left:100%;top:50%;transform:translateY(-50%) translate(6px)}.tooltip-box.tooltip-right .tooltip-arrow{top:50%;right:100%;transform:translateY(-50%);border-width:6px 6px 6px 0;border-color:transparent #111827 transparent transparent}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { content: [{
                type: Input
            }], position: [{
                type: Input
            }], showDelay: [{
                type: Input
            }], hideDelay: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });

class SkeletonLoaderComponent {
    /** Количество блоков скелетона */
    count = 3;
    /** Высота блока */
    height = '20px';
    /** Ширина блока (можно % или px) */
    width = '100%';
    /** Скругление углов */
    borderRadius = '4px';
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: SkeletonLoaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: SkeletonLoaderComponent, isStandalone: true, selector: "lib-skeleton-loader", inputs: { count: "count", height: "height", width: "width", borderRadius: "borderRadius" }, ngImport: i0, template: "<div class=\"skeleton-loader\">\r\n    <div *ngFor=\"let item of [].constructor(count); let i = index\" class=\"skeleton-item\" [ngStyle]=\"{\r\n      height: height,\r\n      width: width,\r\n      borderRadius: borderRadius\r\n    }\"></div>\r\n</div>", styles: [".skeleton-loader{display:flex;flex-direction:column;gap:10px}.skeleton-loader .skeleton-item{background:linear-gradient(-90deg,#e5e7eb,#f3f4f6,#e5e7eb);background-size:200% 100%;animation:pulse 1.5s infinite ease-in-out}@keyframes pulse{0%{background-position:200% 0}to{background-position:-200% 0}}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: SkeletonLoaderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-skeleton-loader', imports: [CommonModule], template: "<div class=\"skeleton-loader\">\r\n    <div *ngFor=\"let item of [].constructor(count); let i = index\" class=\"skeleton-item\" [ngStyle]=\"{\r\n      height: height,\r\n      width: width,\r\n      borderRadius: borderRadius\r\n    }\"></div>\r\n</div>", styles: [".skeleton-loader{display:flex;flex-direction:column;gap:10px}.skeleton-loader .skeleton-item{background:linear-gradient(-90deg,#e5e7eb,#f3f4f6,#e5e7eb);background-size:200% 100%;animation:pulse 1.5s infinite ease-in-out}@keyframes pulse{0%{background-position:200% 0}to{background-position:-200% 0}}\n"] }]
        }], propDecorators: { count: [{
                type: Input
            }], height: [{
                type: Input
            }], width: [{
                type: Input
            }], borderRadius: [{
                type: Input
            }] } });

class FormFieldComponent {
    /** Лейбл поля */
    label = '';
    /** Placeholder */
    placeholder = '';
    /** Иконка слева или справа */
    iconLeft;
    iconRight;
    /** Тип input */
    type = 'text';
    /** FormControl из reactive forms */
    control;
    /** Дополнительный класс */
    customClass = '';
    /** Проверка видимости ошибок */
    get showError() {
        return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
    }
    /** Возвращает первую ошибку */
    get errorMessage() {
        const errors = this.control?.errors;
        if (!errors)
            return null;
        if (errors['required'])
            return 'Поле обязательно';
        if (errors['email'])
            return 'Неверный формат email';
        if (errors['minlength'])
            return `Минимум ${errors['minlength'].requiredLength} символов`;
        if (errors['maxlength'])
            return `Максимум ${errors['maxlength'].requiredLength} символов`;
        if (errors['pattern'])
            return 'Неверный формат';
        return 'Ошибка';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: FormFieldComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: FormFieldComponent, isStandalone: true, selector: "lib-form-field", inputs: { label: "label", placeholder: "placeholder", iconLeft: "iconLeft", iconRight: "iconRight", type: "type", control: "control", customClass: "customClass" }, ngImport: i0, template: "<div class=\"input-group\" [ngClass]=\"customClass\">\r\n    <label *ngIf=\"label\">{{ label }}</label>\r\n\r\n    <div class=\"input-wrapper\">\r\n        <span *ngIf=\"iconLeft\" class=\"icon-left\">{{ iconLeft }}</span>\r\n        <input [type]=\"type\" [placeholder]=\"placeholder\" [ngClass]=\"{ 'invalid': showError }\" [formControl]=\"control\"\r\n            [style.padding-left.px]=\"iconLeft ? 28 : 12\" [style.padding-right.px]=\"iconRight ? 28 : 12\" />\r\n\r\n        <span *ngIf=\"iconRight\" class=\"icon-right\">{{ iconRight }}</span>\r\n    </div>\r\n\r\n    <div class=\"error\" *ngIf=\"showError\">{{ errorMessage }}</div>\r\n</div>", styles: [".input-group{display:flex;flex-direction:column;margin-bottom:16px;font-family:Inter,sans-serif}.input-group label{font-size:12px;margin-bottom:4px;font-weight:500;color:#374151}.input-group .input-wrapper{position:relative;display:flex;align-items:center}.input-group .input-wrapper input{flex:1;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;transition:border-color .2s ease,box-shadow .2s ease}.input-group .input-wrapper input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px #3b82f633}.input-group .input-wrapper input:hover:not(:disabled):not(.invalid){border-color:#9ca3af}.input-group .input-wrapper input:disabled{background-color:#f9fafb;cursor:not-allowed;border-color:#d1d5db}.input-group .input-wrapper input.invalid{border-color:#dc2626}.input-group .input-wrapper input.invalid:focus{box-shadow:0 0 0 3px #dc262633}.input-group .input-wrapper input::placeholder{color:#9ca3af}.input-group .input-wrapper .icon-left{position:absolute;left:8px;font-size:14px;color:#6b7280;pointer-events:none}.input-group .input-wrapper .icon-right{position:absolute;right:8px;font-size:14px;color:#6b7280;cursor:pointer}.input-group .error{color:#dc2626;font-size:11px;margin-top:2px}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "ngmodule", type: ReactiveFormsModule }, { kind: "directive", type: i2.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: FormFieldComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-form-field', imports: [CommonModule, FormsModule, ReactiveFormsModule], template: "<div class=\"input-group\" [ngClass]=\"customClass\">\r\n    <label *ngIf=\"label\">{{ label }}</label>\r\n\r\n    <div class=\"input-wrapper\">\r\n        <span *ngIf=\"iconLeft\" class=\"icon-left\">{{ iconLeft }}</span>\r\n        <input [type]=\"type\" [placeholder]=\"placeholder\" [ngClass]=\"{ 'invalid': showError }\" [formControl]=\"control\"\r\n            [style.padding-left.px]=\"iconLeft ? 28 : 12\" [style.padding-right.px]=\"iconRight ? 28 : 12\" />\r\n\r\n        <span *ngIf=\"iconRight\" class=\"icon-right\">{{ iconRight }}</span>\r\n    </div>\r\n\r\n    <div class=\"error\" *ngIf=\"showError\">{{ errorMessage }}</div>\r\n</div>", styles: [".input-group{display:flex;flex-direction:column;margin-bottom:16px;font-family:Inter,sans-serif}.input-group label{font-size:12px;margin-bottom:4px;font-weight:500;color:#374151}.input-group .input-wrapper{position:relative;display:flex;align-items:center}.input-group .input-wrapper input{flex:1;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;transition:border-color .2s ease,box-shadow .2s ease}.input-group .input-wrapper input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px #3b82f633}.input-group .input-wrapper input:hover:not(:disabled):not(.invalid){border-color:#9ca3af}.input-group .input-wrapper input:disabled{background-color:#f9fafb;cursor:not-allowed;border-color:#d1d5db}.input-group .input-wrapper input.invalid{border-color:#dc2626}.input-group .input-wrapper input.invalid:focus{box-shadow:0 0 0 3px #dc262633}.input-group .input-wrapper input::placeholder{color:#9ca3af}.input-group .input-wrapper .icon-left{position:absolute;left:8px;font-size:14px;color:#6b7280;pointer-events:none}.input-group .input-wrapper .icon-right{position:absolute;right:8px;font-size:14px;color:#6b7280;cursor:pointer}.input-group .error{color:#dc2626;font-size:11px;margin-top:2px}\n"] }]
        }], propDecorators: { label: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], iconLeft: [{
                type: Input
            }], iconRight: [{
                type: Input
            }], type: [{
                type: Input
            }], control: [{
                type: Input
            }], customClass: [{
                type: Input
            }] } });

class DatePickerComponent {
    el;
    placeholder = 'Выберите дату';
    minDate;
    maxDate;
    value = null;
    showCalendar = false;
    weeks = [];
    selectedMonth = new Date().getMonth();
    selectedYear = new Date().getFullYear();
    onChange = (v) => { };
    onTouched = () => { };
    writeValue(obj) {
        this.value = obj ? new Date(obj) : null;
        if (this.value) {
            this.selectedMonth = this.value.getMonth();
            this.selectedYear = this.value.getFullYear();
        }
        this.generateCalendar();
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) { }
    toggleCalendar() {
        this.showCalendar = !this.showCalendar;
    }
    selectDate(date) {
        if (this.minDate && date < this.minDate)
            return;
        if (this.maxDate && date > this.maxDate)
            return;
        this.value = date;
        this.onChange(date);
        this.showCalendar = false;
    }
    prevMonth() {
        if (this.selectedMonth === 0) {
            this.selectedMonth = 11;
            this.selectedYear--;
        }
        else {
            this.selectedMonth--;
        }
        this.generateCalendar();
    }
    nextMonth() {
        if (this.selectedMonth === 11) {
            this.selectedMonth = 0;
            this.selectedYear++;
        }
        else {
            this.selectedMonth++;
        }
        this.generateCalendar();
    }
    generateCalendar() {
        const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
        const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
        const startDay = firstDay.getDay(); // 0-6
        const daysInMonth = lastDay.getDate();
        let weeks = [];
        let week = [];
        for (let i = 0; i < startDay; i++) {
            week.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            week.push(new Date(this.selectedYear, this.selectedMonth, day));
            if (week.length === 7) {
                weeks.push(week);
                week = [];
            }
        }
        if (week.length) {
            while (week.length < 7)
                week.push(null);
            weeks.push(week);
        }
        this.weeks = weeks;
    }
    isSelected(date) {
        return date && this.value && date.toDateString() === this.value.toDateString();
    }
    onClickOutside(target) {
        if (!this.el.nativeElement.contains(target)) {
            this.showCalendar = false;
        }
    }
    constructor(el) {
        this.el = el;
        this.generateCalendar();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: DatePickerComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: DatePickerComponent, isStandalone: true, selector: "lib-date-picker", inputs: { placeholder: "placeholder", minDate: "minDate", maxDate: "maxDate" }, host: { listeners: { "document:click": "onClickOutside($event.target)" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DatePickerComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"date-picker\">\r\n    <input readonly [placeholder]=\"placeholder\" [value]=\"value ? value.toLocaleDateString() : ''\"\r\n        (click)=\"toggleCalendar()\" />\r\n\r\n    <div class=\"calendar\" *ngIf=\"showCalendar\">\r\n        <div class=\"calendar-header\">\r\n            <button (click)=\"prevMonth()\">\u2039</button>\r\n            <span>{{ selectedMonth + 1 }}/{{ selectedYear }}</span>\r\n            <button (click)=\"nextMonth()\">\u203A</button>\r\n        </div>\r\n        <div class=\"calendar-grid\">\r\n            <div class=\"day-label\" *ngFor=\"let day of ['\u0412\u0441','\u041F\u043D','\u0412\u0442','\u0421\u0440','\u0427\u0442','\u041F\u0442','\u0421\u0431']\">{{ day }}</div>\r\n            <div *ngFor=\"let week of weeks\" class=\"week\">\r\n                <div *ngFor=\"let date of week\" class=\"day\" [class.selected]=\"isSelected(date)\"\r\n                    [class.disabled]=\"!date || (minDate && date < minDate) || (maxDate && date > maxDate)\"\r\n                    (click)=\"date && selectDate(date)\">\r\n                    {{ date?.getDate() }}\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".date-picker{position:relative;font-family:Inter,sans-serif}.date-picker input{width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;cursor:pointer}.date-picker input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 2px #3b82f633}.date-picker .calendar{position:absolute;top:100%;left:0;background:#fff;border:1px solid #d1d5db;border-radius:6px;margin-top:4px;box-shadow:0 4px 12px #0000001a;z-index:10;width:240px;padding:8px}.date-picker .calendar .calendar-header{display:flex;justify-content:space-between;margin-bottom:8px}.date-picker .calendar .calendar-header button{border:none;background:none;cursor:pointer;font-size:18px}.date-picker .calendar .calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.date-picker .calendar .calendar-grid .day-label{font-size:10px;text-align:center;color:#6b7280}.date-picker .calendar .calendar-grid .week{display:contents}.date-picker .calendar .calendar-grid .week .day{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;font-size:12px}.date-picker .calendar .calendar-grid .week .day.selected{background:#3b82f6;color:#fff}.date-picker .calendar .calendar-grid .week .day.disabled{color:#d1d5db;cursor:not-allowed}.date-picker .calendar .calendar-grid .week .day:hover:not(.disabled){background:#bfdbfe}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: FormsModule }, { kind: "ngmodule", type: ReactiveFormsModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: DatePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-date-picker', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DatePickerComponent),
                            multi: true
                        }
                    ], template: "<div class=\"date-picker\">\r\n    <input readonly [placeholder]=\"placeholder\" [value]=\"value ? value.toLocaleDateString() : ''\"\r\n        (click)=\"toggleCalendar()\" />\r\n\r\n    <div class=\"calendar\" *ngIf=\"showCalendar\">\r\n        <div class=\"calendar-header\">\r\n            <button (click)=\"prevMonth()\">\u2039</button>\r\n            <span>{{ selectedMonth + 1 }}/{{ selectedYear }}</span>\r\n            <button (click)=\"nextMonth()\">\u203A</button>\r\n        </div>\r\n        <div class=\"calendar-grid\">\r\n            <div class=\"day-label\" *ngFor=\"let day of ['\u0412\u0441','\u041F\u043D','\u0412\u0442','\u0421\u0440','\u0427\u0442','\u041F\u0442','\u0421\u0431']\">{{ day }}</div>\r\n            <div *ngFor=\"let week of weeks\" class=\"week\">\r\n                <div *ngFor=\"let date of week\" class=\"day\" [class.selected]=\"isSelected(date)\"\r\n                    [class.disabled]=\"!date || (minDate && date < minDate) || (maxDate && date > maxDate)\"\r\n                    (click)=\"date && selectDate(date)\">\r\n                    {{ date?.getDate() }}\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".date-picker{position:relative;font-family:Inter,sans-serif}.date-picker input{width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;cursor:pointer}.date-picker input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 2px #3b82f633}.date-picker .calendar{position:absolute;top:100%;left:0;background:#fff;border:1px solid #d1d5db;border-radius:6px;margin-top:4px;box-shadow:0 4px 12px #0000001a;z-index:10;width:240px;padding:8px}.date-picker .calendar .calendar-header{display:flex;justify-content:space-between;margin-bottom:8px}.date-picker .calendar .calendar-header button{border:none;background:none;cursor:pointer;font-size:18px}.date-picker .calendar .calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.date-picker .calendar .calendar-grid .day-label{font-size:10px;text-align:center;color:#6b7280}.date-picker .calendar .calendar-grid .week{display:contents}.date-picker .calendar .calendar-grid .week .day{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;font-size:12px}.date-picker .calendar .calendar-grid .week .day.selected{background:#3b82f6;color:#fff}.date-picker .calendar .calendar-grid .week .day.disabled{color:#d1d5db;cursor:not-allowed}.date-picker .calendar .calendar-grid .week .day:hover:not(.disabled){background:#bfdbfe}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { placeholder: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], onClickOutside: [{
                type: HostListener,
                args: ['document:click', ['$event.target']]
            }] } });

class TimePickerComponent {
    el;
    placeholder = 'Выберите время';
    minHour = 0;
    maxHour = 23;
    stepMinutes = 1;
    value = null;
    showPicker = false;
    onChange = (v) => { };
    onTouched = () => { };
    writeValue(obj) {
        this.value = obj ?? null;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) { }
    togglePicker() {
        this.showPicker = !this.showPicker;
    }
    selectHour(hour) {
        this.value = { hours: hour, minutes: this.value?.minutes || 0 };
        this.onChange(this.value);
    }
    selectMinute(minute) {
        if (!this.value)
            return;
        this.value.minutes = minute;
        this.onChange(this.value);
        this.showPicker = false;
    }
    get hours() {
        const arr = [];
        for (let i = this.minHour; i <= this.maxHour; i++)
            arr.push(i);
        return arr;
    }
    get minutes() {
        const arr = [];
        for (let i = 0; i < 60; i += this.stepMinutes)
            arr.push(i);
        return arr;
    }
    displayValue() {
        if (!this.value)
            return '';
        const h = String(this.value.hours).padStart(2, '0');
        const m = String(this.value.minutes).padStart(2, '0');
        return `${h}:${m}`;
    }
    onClickOutside(target) {
        if (!this.el.nativeElement.contains(target)) {
            this.showPicker = false;
        }
    }
    constructor(el) {
        this.el = el;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: TimePickerComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: TimePickerComponent, isStandalone: true, selector: "lib-time-picker", inputs: { placeholder: "placeholder", minHour: "minHour", maxHour: "maxHour", stepMinutes: "stepMinutes" }, host: { listeners: { "document:click": "onClickOutside($event.target)" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TimePickerComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"time-picker\">\r\n    <input readonly [placeholder]=\"placeholder\" [value]=\"displayValue()\" (click)=\"togglePicker()\" />\r\n\r\n    <div class=\"picker-panel\" *ngIf=\"showPicker\">\r\n        <div class=\"picker-column\">\r\n            <div *ngFor=\"let h of hours\" [class.selected]=\"value?.hours === h\" (click)=\"selectHour(h)\">\r\n                {{ h | number: '2.0' }}\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"picker-column\">\r\n            <div *ngFor=\"let m of minutes\" [class.selected]=\"value?.minutes === m\" (click)=\"selectMinute(m)\">\r\n                {{ m | number: '2.0' }}\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>", styles: [".time-picker{position:relative;display:inline-block;font-family:Inter,sans-serif}.time-picker input{width:120px;padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-size:14px;transition:border-color .2s,box-shadow .2s}.time-picker input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 2px #2563eb33}.time-picker .picker-panel{position:absolute;top:100%;left:0;display:flex;gap:8px;background:#fff;border:1px solid #d1d5db;border-radius:10px;margin-top:6px;padding:8px;box-shadow:0 4px 12px #00000026;z-index:20;animation:fadeIn .15s ease-out}@keyframes fadeIn{0%{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}.time-picker .picker-panel .picker-column{display:flex;flex-direction:column;max-height:160px;overflow-y:auto;border-radius:8px}.time-picker .picker-panel .picker-column div{padding:6px 12px;margin:2px 0;text-align:center;border-radius:6px;cursor:pointer;font-weight:500;transition:background .2s}.time-picker .picker-panel .picker-column div:hover{background-color:#f3f4f6}.time-picker .picker-panel .picker-column div.selected{background-color:#2563eb;color:#fff}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "pipe", type: i1.DecimalPipe, name: "number" }, { kind: "ngmodule", type: FormsModule }, { kind: "ngmodule", type: ReactiveFormsModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: TimePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-time-picker', imports: [CommonModule, FormsModule, ReactiveFormsModule], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TimePickerComponent),
                            multi: true
                        }
                    ], template: "<div class=\"time-picker\">\r\n    <input readonly [placeholder]=\"placeholder\" [value]=\"displayValue()\" (click)=\"togglePicker()\" />\r\n\r\n    <div class=\"picker-panel\" *ngIf=\"showPicker\">\r\n        <div class=\"picker-column\">\r\n            <div *ngFor=\"let h of hours\" [class.selected]=\"value?.hours === h\" (click)=\"selectHour(h)\">\r\n                {{ h | number: '2.0' }}\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"picker-column\">\r\n            <div *ngFor=\"let m of minutes\" [class.selected]=\"value?.minutes === m\" (click)=\"selectMinute(m)\">\r\n                {{ m | number: '2.0' }}\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>", styles: [".time-picker{position:relative;display:inline-block;font-family:Inter,sans-serif}.time-picker input{width:120px;padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;font-size:14px;transition:border-color .2s,box-shadow .2s}.time-picker input:focus{outline:none;border-color:#2563eb;box-shadow:0 0 0 2px #2563eb33}.time-picker .picker-panel{position:absolute;top:100%;left:0;display:flex;gap:8px;background:#fff;border:1px solid #d1d5db;border-radius:10px;margin-top:6px;padding:8px;box-shadow:0 4px 12px #00000026;z-index:20;animation:fadeIn .15s ease-out}@keyframes fadeIn{0%{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}.time-picker .picker-panel .picker-column{display:flex;flex-direction:column;max-height:160px;overflow-y:auto;border-radius:8px}.time-picker .picker-panel .picker-column div{padding:6px 12px;margin:2px 0;text-align:center;border-radius:6px;cursor:pointer;font-weight:500;transition:background .2s}.time-picker .picker-panel .picker-column div:hover{background-color:#f3f4f6}.time-picker .picker-panel .picker-column div.selected{background-color:#2563eb;color:#fff}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { placeholder: [{
                type: Input
            }], minHour: [{
                type: Input
            }], maxHour: [{
                type: Input
            }], stepMinutes: [{
                type: Input
            }], onClickOutside: [{
                type: HostListener,
                args: ['document:click', ['$event.target']]
            }] } });

class SelectComponent {
    el;
    options = [];
    placeholder = 'Выберите...';
    multiple = false;
    searchEnabled = false;
    value = null;
    showDropdown = false;
    searchTerm = '';
    onChange = (v) => { };
    onTouched = () => { };
    writeValue(obj) {
        this.value = obj;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) { }
    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }
    getSelectedLabels() {
        if (!this.multiple || !this.value?.length)
            return '';
        const labels = this.value
            .map((v) => this.options.find(o => o.value === v))
            .filter((o) => !!o)
            .map((o) => o.label);
        return labels.join(', ');
    }
    getSelectedLabel() {
        if (!this.value)
            return '';
        const option = this.options.find(o => o.value === this.value);
        return option ? option.label : '';
    }
    selectOption(option) {
        if (this.multiple) {
            if (!Array.isArray(this.value))
                this.value = [];
            const index = this.value.findIndex((v) => v === option.value);
            if (index > -1) {
                this.value.splice(index, 1);
            }
            else {
                this.value.push(option.value);
            }
            this.onChange([...this.value]);
        }
        else {
            this.value = option.value;
            this.onChange(this.value);
            this.showDropdown = false;
        }
    }
    isSelected(option) {
        if (this.multiple && Array.isArray(this.value)) {
            return this.value.includes(option.value);
        }
        return this.value === option.value;
    }
    get filteredOptions() {
        if (!this.searchEnabled || !this.searchTerm)
            return this.options;
        return this.options.filter(o => o.label.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }
    onClickOutside(target) {
        if (!this.el.nativeElement.contains(target)) {
            this.showDropdown = false;
        }
    }
    constructor(el) {
        this.el = el;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: SelectComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: SelectComponent, isStandalone: true, selector: "lib-select", inputs: { options: "options", placeholder: "placeholder", multiple: "multiple", searchEnabled: "searchEnabled" }, host: { listeners: { "document:click": "onClickOutside($event.target)" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => SelectComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"select-container\">\r\n    <div class=\"select-input\" (click)=\"toggleDropdown()\">\r\n        <span *ngIf=\"!value || (multiple && value.length === 0)\" class=\"placeholder\">{{ placeholder }}</span>\r\n        <span *ngIf=\"multiple && value?.length\">\r\n            {{ getSelectedLabels() }}\r\n        </span>\r\n\r\n        <span *ngIf=\"!multiple && value\">\r\n            {{ getSelectedLabel() }}\r\n        </span>\r\n        <span class=\"arrow\">\u25BE</span>\r\n    </div>\r\n\r\n    <div class=\"dropdown\" *ngIf=\"showDropdown\">\r\n        <input *ngIf=\"searchEnabled\" type=\"text\" [(ngModel)]=\"searchTerm\" placeholder=\"\u041F\u043E\u0438\u0441\u043A...\" class=\"search\" />\r\n\r\n        <div *ngFor=\"let option of filteredOptions\" class=\"option\" [class.selected]=\"isSelected(option)\"\r\n            (click)=\"selectOption(option)\">\r\n            <input *ngIf=\"multiple\" type=\"checkbox\" [checked]=\"isSelected(option)\" />\r\n            {{ option.label }}\r\n        </div>\r\n\r\n        <div *ngIf=\"filteredOptions.length === 0\" class=\"no-results\">\r\n            \u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E\r\n        </div>\r\n    </div>\r\n</div>", styles: [".select-container{position:relative;width:220px;font-family:Inter,sans-serif;font-size:14px;color:#111827}.select-container .select-input{border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background-color:#fff;transition:border .2s,box-shadow .2s}.select-container .select-input:hover{border-color:#6366f1;box-shadow:0 2px 6px #6366f133}.select-container .select-input .placeholder{color:#9ca3af}.select-container .select-input .arrow{margin-left:8px;transition:transform .2s}.select-container .select-input .arrow.open{transform:rotate(180deg)}.select-container .dropdown{position:absolute;top:100%;left:0;width:100%;max-height:220px;overflow-y:auto;background:#fff;border:1px solid #d1d5db;border-radius:8px;margin-top:6px;box-shadow:0 8px 16px #0000001a;z-index:20;transition:opacity .2s ease,transform .2s ease}.select-container .dropdown .search{width:-webkit-fill-available;padding:8px 12px;border-bottom:1px solid #e5e7eb;outline:none;font-size:14px;border-radius:8px 8px 0 0;border:1px solid #e9e9e9}.select-container .dropdown .search:focus{border-color:#6366f1;box-shadow:0 0 0 2px #6366f133}.select-container .dropdown .option{padding:8px 12px;cursor:pointer;display:flex;align-items:center;transition:background .2s}.select-container .dropdown .option.selected{background-color:#eef2ff;font-weight:500}.select-container .dropdown .option:hover{background-color:#f3f4f6}.select-container .dropdown .option input[type=checkbox]{margin-right:8px;accent-color:#6366f1}.select-container .dropdown .no-results{padding:8px 12px;color:#9ca3af;font-style:italic}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "ngmodule", type: ReactiveFormsModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: SelectComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-select', imports: [CommonModule, FormsModule, ReactiveFormsModule], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => SelectComponent),
                            multi: true
                        }
                    ], template: "<div class=\"select-container\">\r\n    <div class=\"select-input\" (click)=\"toggleDropdown()\">\r\n        <span *ngIf=\"!value || (multiple && value.length === 0)\" class=\"placeholder\">{{ placeholder }}</span>\r\n        <span *ngIf=\"multiple && value?.length\">\r\n            {{ getSelectedLabels() }}\r\n        </span>\r\n\r\n        <span *ngIf=\"!multiple && value\">\r\n            {{ getSelectedLabel() }}\r\n        </span>\r\n        <span class=\"arrow\">\u25BE</span>\r\n    </div>\r\n\r\n    <div class=\"dropdown\" *ngIf=\"showDropdown\">\r\n        <input *ngIf=\"searchEnabled\" type=\"text\" [(ngModel)]=\"searchTerm\" placeholder=\"\u041F\u043E\u0438\u0441\u043A...\" class=\"search\" />\r\n\r\n        <div *ngFor=\"let option of filteredOptions\" class=\"option\" [class.selected]=\"isSelected(option)\"\r\n            (click)=\"selectOption(option)\">\r\n            <input *ngIf=\"multiple\" type=\"checkbox\" [checked]=\"isSelected(option)\" />\r\n            {{ option.label }}\r\n        </div>\r\n\r\n        <div *ngIf=\"filteredOptions.length === 0\" class=\"no-results\">\r\n            \u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E\r\n        </div>\r\n    </div>\r\n</div>", styles: [".select-container{position:relative;width:220px;font-family:Inter,sans-serif;font-size:14px;color:#111827}.select-container .select-input{border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background-color:#fff;transition:border .2s,box-shadow .2s}.select-container .select-input:hover{border-color:#6366f1;box-shadow:0 2px 6px #6366f133}.select-container .select-input .placeholder{color:#9ca3af}.select-container .select-input .arrow{margin-left:8px;transition:transform .2s}.select-container .select-input .arrow.open{transform:rotate(180deg)}.select-container .dropdown{position:absolute;top:100%;left:0;width:100%;max-height:220px;overflow-y:auto;background:#fff;border:1px solid #d1d5db;border-radius:8px;margin-top:6px;box-shadow:0 8px 16px #0000001a;z-index:20;transition:opacity .2s ease,transform .2s ease}.select-container .dropdown .search{width:-webkit-fill-available;padding:8px 12px;border-bottom:1px solid #e5e7eb;outline:none;font-size:14px;border-radius:8px 8px 0 0;border:1px solid #e9e9e9}.select-container .dropdown .search:focus{border-color:#6366f1;box-shadow:0 0 0 2px #6366f133}.select-container .dropdown .option{padding:8px 12px;cursor:pointer;display:flex;align-items:center;transition:background .2s}.select-container .dropdown .option.selected{background-color:#eef2ff;font-weight:500}.select-container .dropdown .option:hover{background-color:#f3f4f6}.select-container .dropdown .option input[type=checkbox]{margin-right:8px;accent-color:#6366f1}.select-container .dropdown .no-results{padding:8px 12px;color:#9ca3af;font-style:italic}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { options: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], multiple: [{
                type: Input
            }], searchEnabled: [{
                type: Input
            }], onClickOutside: [{
                type: HostListener,
                args: ['document:click', ['$event.target']]
            }] } });

class CheckboxComponent {
    label = '';
    disabled = false;
    checked = false;
    onChange = (v) => { };
    onTouched = () => { };
    toggle() {
        this.checked = !this.checked;
        this.onChange(this.checked);
        this.onTouched();
    }
    writeValue(obj) {
        this.checked = !!obj;
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: CheckboxComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.15", type: CheckboxComponent, isStandalone: true, selector: "lib-checkbox", inputs: { label: "label", disabled: "disabled" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => CheckboxComponent),
                multi: true
            }
        ], ngImport: i0, template: "<label class=\"checkbox-wrapper\" [class.disabled]=\"disabled\">\r\n  <input type=\"checkbox\" [checked]=\"checked\" (change)=\"toggle()\" [disabled]=\"disabled\" />\r\n  <span class=\"checkbox-custom\"></span>\r\n  <span class=\"checkbox-label\">{{ label }}</span>\r\n</label>\r\n", styles: [".checkbox-wrapper{display:flex;align-items:center;cursor:pointer;font-family:Inter,sans-serif;-webkit-user-select:none;user-select:none}.checkbox-wrapper.disabled{cursor:not-allowed;opacity:.5}input{display:none}.checkbox-custom{width:18px;height:18px;border:2px solid #d1d5db;border-radius:4px;position:relative;margin-right:8px;transition:all .2s ease;background:#fff}.checkbox-custom:after{content:\"\";position:absolute;width:6px;height:10px;border:solid white;border-width:0 2px 2px 0;top:1px;left:5px;transform:rotate(45deg);opacity:0;transition:opacity .2s}input:checked+.checkbox-custom{background-color:#6366f1;border-color:#6366f1}input:checked+.checkbox-custom:after{opacity:1}.checkbox-label{font-size:14px;color:#111827}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: FormsModule }, { kind: "ngmodule", type: ReactiveFormsModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: CheckboxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'lib-checkbox', imports: [CommonModule, FormsModule, ReactiveFormsModule], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => CheckboxComponent),
                            multi: true
                        }
                    ], template: "<label class=\"checkbox-wrapper\" [class.disabled]=\"disabled\">\r\n  <input type=\"checkbox\" [checked]=\"checked\" (change)=\"toggle()\" [disabled]=\"disabled\" />\r\n  <span class=\"checkbox-custom\"></span>\r\n  <span class=\"checkbox-label\">{{ label }}</span>\r\n</label>\r\n", styles: [".checkbox-wrapper{display:flex;align-items:center;cursor:pointer;font-family:Inter,sans-serif;-webkit-user-select:none;user-select:none}.checkbox-wrapper.disabled{cursor:not-allowed;opacity:.5}input{display:none}.checkbox-custom{width:18px;height:18px;border:2px solid #d1d5db;border-radius:4px;position:relative;margin-right:8px;transition:all .2s ease;background:#fff}.checkbox-custom:after{content:\"\";position:absolute;width:6px;height:10px;border:solid white;border-width:0 2px 2px 0;top:1px;left:5px;transform:rotate(45deg);opacity:0;transition:opacity .2s}input:checked+.checkbox-custom{background-color:#6366f1;border-color:#6366f1}input:checked+.checkbox-custom:after{opacity:1}.checkbox-label{font-size:14px;color:#111827}\n"] }]
        }], propDecorators: { label: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });

// Форматирование цены (1000 → "1 000 ₽")
const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
    }).format(price);
};
// Сокращение текста ("Lorem ipsum..." → "Lorem...")
const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * Уровни логирования
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "DEBUG";
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["CRITICAL"] = "CRITICAL";
})(LogLevel || (LogLevel = {}));
/**
 * Сервис для логирования с поддержкой разных уровней и форматов
 */
class Logger {
    context;
    constructor(context) {
        this.context = context || 'Global';
    }
    /**
     * Форматирование сообщения для консоли
     */
    formatConsoleMessage(log) {
        const { timestamp, level, message, context, stack, data } = log;
        let formatted = `[${timestamp.toISOString()}] [${level}] [${context}]: ${message}`;
        if (stack && level >= LogLevel.ERROR) {
            formatted += `\nStack: ${stack}`;
        }
        if (data) {
            formatted += `\nData: ${JSON.stringify(data, null, 2)}`;
        }
        return formatted;
    }
    /**
     * Отправка логов на сервер (например, Sentry/ELK)
     */
    sendToServer(log, environment) {
        if (!environment)
            return;
        // Здесь может быть HTTP-запрос к API логирования
        // Пример: this.http.post('/api/logs', log).subscribe();
    }
    /**
     * Базовый метод логирования
     */
    log(level, message, data, environment) {
        const timestamp = new Date();
        const error = data instanceof Error ? data : null;
        const stack = error?.stack;
        const normalizedData = error ? { message: error.message, ...data } : data;
        const logEntry = {
            timestamp,
            level,
            message,
            context: this.context,
            stack,
            data: normalizedData,
        };
        const consoleMessage = this.formatConsoleMessage(logEntry);
        // Логирование в консоль
        switch (level) {
            case LogLevel.DEBUG:
                console.debug(consoleMessage);
                break;
            case LogLevel.INFO:
                console.info(consoleMessage);
                break;
            case LogLevel.WARN:
                console.warn(consoleMessage);
                break;
            case LogLevel.ERROR:
            case LogLevel.CRITICAL:
                console.error(consoleMessage);
                break;
        }
        // Отправка на сервер в production
        if (level >= LogLevel.ERROR || environment) {
            this.sendToServer(logEntry, environment);
        }
    }
    /* Публичные методы для разных уровней логирования */
    debug(message, data, environment) {
        if (!environment) {
            this.log(LogLevel.DEBUG, message, data);
        }
    }
    info(message, data) {
        this.log(LogLevel.INFO, message, data);
    }
    warn(message, data) {
        this.log(LogLevel.WARN, message, data);
    }
    error(message, error, data) {
        this.log(LogLevel.ERROR, message, error || data);
    }
    critical(message, error, data) {
        this.log(LogLevel.CRITICAL, message, error || data);
    }
    /**
     * Логирование HTTP-ошибок
     */
    httpError(message, error, context = {}) {
        const { url, status } = context;
        const errorMessage = [
            message,
            status && `Status: ${status}`,
            url && `URL: ${url}`,
            error.message && `Details: ${error.message}`,
        ]
            .filter(Boolean)
            .join(' | ');
        this.error(errorMessage, error, { url, status });
    }
    /**
     * Логирование жизненного цикла компонента
     */
    componentLifecycle(componentName, lifecycle, data) {
        this.debug(`Component ${componentName} ${lifecycle}`, data);
    }
}
/**
 * Глобальный экземпляр логгера
 */
const logger = new Logger('App');
/**
 * Декоратор для логирования методов класса
 */
function LogMethod(target, key, descriptor) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    descriptor.value = function (...args) {
        logger.debug(`Calling ${className}.${key}`, { arguments: args });
        try {
            const result = originalMethod.apply(this, args);
            if (result instanceof Promise) {
                return result.catch((e) => {
                    logger.error(`Error in ${className}.${key}`, e);
                    throw e;
                });
            }
            return result;
        }
        catch (e) {
            logger.error(`Error in ${className}.${key}`, e);
            throw e;
        }
    };
    return descriptor;
}
/**
 * Утилита для логирования времени выполнения функции
 */
function logExecutionTime(fn, context = 'Execution') {
    return (...args) => {
        const start = performance.now();
        logger.debug(`${context} started`);
        try {
            const result = fn(...args);
            if (result instanceof Promise) {
                return result.finally(() => {
                    const end = performance.now();
                    logger.info(`${context} finished in ${(end - start).toFixed(2)}ms`);
                });
            }
            const end = performance.now();
            logger.info(`${context} finished in ${(end - start).toFixed(2)}ms`);
            return result;
        }
        catch (e) {
            const end = performance.now();
            logger.error(`${context} failed after ${(end - start).toFixed(2)}ms`, e);
            throw e;
        }
    };
}
// Как использовать:
// Базовое логирование:
// typescript
// logger.debug('Debug message', { someData: 123 });
// logger.info('User logged in', userId);
// logger.warn('Deprecated API called');
// logger.error('Payment failed', error);
// logger.critical('Database connection lost', error);
// HTTP-ошибки:
// typescript
// this.http.get('/api/data').subscribe({
//   error: (err) => logger.httpError('API request failed', err, { 
//     url: '/api/data',
//     status: err.status 
//   })
// });
// Логирование методов:
// typescript
// @LogMethod
// public calculateTotal(items: CartItem[]): number {
//   // логика расчета
// }
// Замер времени выполнения:
// typescript
// const optimizedFunction = logExecutionTime(heavyCalculation, 'Heavy Calculation');
// optimizedFunction(params);

/**
 * Утилиты для кэширования данных
 */
class StorageUtils {
    // Кэш в памяти (для быстрого доступа)
    static memoryCache = new Map();
    // ======================== Общие методы ======================== //
    /**
     * Проверяет, валиден ли кэш (не истекло ли время)
     * @param expires timestamp в ms
     */
    static isCacheValid(expires) {
        return expires > Date.now();
    }
    // ======================== Кэш в памяти ======================== //
    /**
     * Сохраняет данные в памяти
     * @param key Ключ
     * @param data Данные
     * @param ttl Время жизни в секундах (по умолчанию 5 минут)
     */
    static setMemoryCache(key, data, ttl = 300) {
        const expires = Date.now() + ttl * 1000;
        this.memoryCache.set(key, { data, expires });
    }
    /**
     * Получает данные из памяти
     * @param key Ключ
     * @returns Данные или null, если кэш невалиден
     */
    static getMemoryCache(key) {
        const item = this.memoryCache.get(key);
        if (!item)
            return null;
        if (this.isCacheValid(item.expires)) {
            return item.data;
        }
        this.memoryCache.delete(key); // Автоочистка
        return null;
    }
    /**
     * Очищает кэш в памяти по ключу или полностью
     * @param key Если не указан, очищает весь кэш
     */
    static clearMemoryCache(key) {
        if (key) {
            this.memoryCache.delete(key);
        }
        else {
            this.memoryCache.clear();
        }
    }
    // ======================== LocalStorage ======================== //
    /**
     * Сохраняет данные в localStorage с TTL
     * @param key Ключ
     * @param data Данные
     * @param ttl Время жизни в секундах
     */
    static setLocalStorageCache(key, data, ttl) {
        try {
            const expires = Date.now() + ttl * 1000;
            const item = { data, expires };
            localStorage.setItem(key, JSON.stringify(item));
        }
        catch (e) {
            console.error('LocalStorage error:', e);
        }
    }
    /**
     * Получает данные из localStorage
     * @param key Ключ
     * @returns Данные или null, если кэш невалиден
     */
    static getLocalStorageCache(key) {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr)
                return null;
            const item = JSON.parse(itemStr);
            if (this.isCacheValid(item.expires)) {
                return item.data;
            }
            localStorage.removeItem(key); // Автоочистка
            return null;
        }
        catch (e) {
            console.error('LocalStorage error:', e);
            return null;
        }
    }
    // ======================== SessionStorage ======================== //
    /**
     * Сохраняет данные в sessionStorage (живут до закрытия вкладки)
     * @param key Ключ
     * @param data Данные
     */
    static setSessionStorage(key, data) {
        try {
            sessionStorage.setItem(key, JSON.stringify(data));
        }
        catch (e) {
            console.error('SessionStorage error:', e);
        }
    }
    /**
     * Получает данные из sessionStorage
     * @param key Ключ
     */
    static getSessionStorage(key) {
        try {
            const data = sessionStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        }
        catch (e) {
            console.error('SessionStorage error:', e);
            return null;
        }
    }
    // ======================== Комбинированный кэш ======================== //
    /**
     * Пытается получить данные из кэшей по приоритету:
     * 1. Память → 2. localStorage → 3. sessionStorage
     * @param key Ключ
     */
    static getFromAnyCache(key) {
        return (this.getMemoryCache(key) ||
            this.getLocalStorageCache(key) ||
            this.getSessionStorage(key));
    }
}
// ======================== Примеры использования ======================== //
/*
// 1. Кэшируем данные на 10 минут
CacheUtils.setMemoryCache('products_list', products, 600);

// 2. Получаем данные
const cachedProducts = CacheUtils.getMemoryCache<Product[]>('products_list');

// 3. Кэшируем в localStorage на 1 час
CacheUtils.setLocalStorageCache('user_profile', user, 3600);

// 4. Очищаем кэш
CacheUtils.clearMemoryCache('products_list');
*/

/**
 * Проверяет валидность email
 * @param email - Проверяемая строка
 * @returns boolean
 */
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};
/**
 * Проверяет сложность пароля:
 * - Минимум 8 символов
 * - Хотя бы 1 цифра
 * - Хотя бы 1 буква в верхнем и нижнем регистре
 * @param password - Проверяемый пароль
 * @returns boolean
 */
const isStrongPassword = (password) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
};
/**
 * Проверяет валидность российского номера телефона
 * @param phone - Номер в формате +7..., 8..., или без кода страны
 * @returns boolean
 */
const isValidRussianPhone = (phone) => {
    return /^(\+7|8|7)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(phone.trim());
};
/**
 * Проверяет валидность ИНН (для юр. и физ. лиц)
 * @param inn - ИНН (10 или 12 цифр)
 * @returns boolean
 */
const isValidINN = (inn) => {
    return /^(\d{10}|\d{12})$/.test(inn.trim());
};
/**
 * Проверяет валидность номера карты по алгоритму Луна
 * @param cardNumber - Номер карты (без пробелов)
 * @returns boolean
 */
const isValidCreditCard = (cardNumber) => {
    const trimmed = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(trimmed))
        return false;
    let sum = 0;
    for (let i = 0; i < trimmed.length; i++) {
        let digit = parseInt(trimmed[i], 10);
        if ((trimmed.length - i) % 2 === 0) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        sum += digit;
    }
    return sum % 10 === 0;
};
/**
 * Проверяет валидность CVV/CVC кода карты
 * @param cvv - Код (3 или 4 цифры)
 * @returns boolean
 */
const isValidCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv.trim());
};
/**
 * Проверяет валидность срока действия карты (MM/YY)
 * @param expiry - Строка в формате MM/YY
 * @returns boolean
 */
const isValidCardExpiry = (expiry) => {
    const [month, year] = expiry.split('/').map(Number);
    if (!month || !year || month > 12 || month < 1)
        return false;
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    return (year > currentYear ||
        (year === currentYear && month >= currentMonth));
};
/**
 * Проверяет формат промокода (например, только буквы и цифры)
 * @param promoCode - Промокод
 * @param pattern - Регулярное выражение (по умолчанию /^[A-Z0-9]{6,12}$/i)
 * @returns boolean
 */
const isValidPromoCode = (promoCode, pattern = /^[A-Z0-9]{6,12}$/i) => {
    return pattern.test(promoCode.trim());
};
/**
 * Проверяет, что количество товара в корзине допустимо
 * @param quantity - Количество
 * @param max - Максимальное значение (по умолчанию 100)
 * @returns boolean
 */
const isValidProductQuantity = (quantity, max = 100) => {
    return Number.isInteger(quantity) && quantity > 0 && quantity <= max;
};
/**
 * Проверяет, что строка является валидным URL изображения
 * @param url - Ссылка на изображение
 * @returns boolean
 */
const isValidImageUrl = (url) => {
    return /\.(jpeg|jpg|png|webp|gif)$/i.test(url.trim());
};
/**
 * Проверяет, что строка не пустая и не состоит только из пробелов
 * @param value - Проверяемая строка
 * @returns boolean
 */
const isNotEmpty = (value) => {
    return value.trim().length > 0;
};
/**
 * Проверяет минимальную длину строки
 * @param value - Проверяемая строка
 * @param minLength - Минимальная длина
 * @returns boolean
 */
const hasMinLength = (value, minLength) => {
    return value.trim().length >= minLength;
};
/**
 * Проверяет максимальную длину строки
 * @param value - Проверяемая строка
 * @param maxLength - Максимальная длина
 * @returns boolean
 */
const hasMaxLength = (value, maxLength) => {
    return value.trim().length <= maxLength;
};
/**
 * Проверяет, что строка содержит только буквы (латиница или кириллица)
 * @param value - Проверяемая строка
 * @param allowSpaces - Разрешить пробелы
 * @returns boolean
 */
const isAlpha = (value, allowSpaces = true) => {
    const pattern = allowSpaces
        ? /^[a-zA-Zа-яА-ЯёЁ\s]+$/
        : /^[a-zA-Zа-яА-ЯёЁ]+$/;
    return pattern.test(value);
};
/**
 * Проверяет, что значение является положительным числом
 * @param value - Проверяемое значение
 * @returns boolean
 */
const isPositiveNumber = (value) => {
    return value > 0;
};
/**
 * Проверяет, что значение находится в заданном диапазоне
 * @param value - Проверяемое значение
 * @param min - Минимальное значение
 * @param max - Максимальное значение
 * @returns boolean
 */
const isInRange = (value, min, max) => {
    return value >= min && value <= max;
};
/**
 * Проверяет, что значение является целым числом
 * @param value - Проверяемое значение
 * @returns boolean
 */
const isInteger = (value) => {
    return Number.isInteger(value);
};
/**
 * Проверяет, что дата является будущей (относительно текущей даты)
 * @param date - Проверяемая дата
 * @returns boolean
 */
const isFutureDate = (date) => {
    return date > new Date();
};
/**
 * Проверяет, что дата является прошедшей (относительно текущей даты)
 * @param date - Проверяемая дата
 * @returns boolean
 */
const isPastDate = (date) => {
    return date < new Date();
};
/**
 * Проверяет, что дата находится в допустимом диапазоне
 * @param date - Проверяемая дата
 * @param startDate - Начальная дата диапазона
 * @param endDate - Конечная дата диапазона
 * @returns boolean
 */
const isDateInRange = (date, startDate, endDate) => {
    return date >= startDate && date <= endDate;
};
/**
 * Проверяет валидность почтового индекса (для России)
 * @param zipCode - Проверяемый индекс
 * @returns boolean
 */
const isValidRussianZipCode = (zipCode) => {
    return /^\d{6}$/.test(zipCode.trim());
};
/**
 * Проверяет валидность адреса (базовая проверка)
 * @param address - Проверяемый адрес
 * @returns boolean
 */
const isValidAddress = (address) => {
    return address.trim().length >= 10 && /[а-яА-ЯёЁa-zA-Z0-9\s,.-]/.test(address);
};
/**
 * Проверяет расширение файла
 * @param fileName - Имя файла
 * @param allowedExtensions - Массив разрешенных расширений (например, ['jpg', 'png'])
 * @returns boolean
 */
const hasValidFileExtension = (fileName, allowedExtensions) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? allowedExtensions.includes(extension) : false;
};
/**
 * Проверяет размер файла (в байтах)
 * @param fileSize - Размер файла в байтах
 * @param maxSize - Максимальный размер в байтах
 * @returns boolean
 */
const isValidFileSize = (fileSize, maxSize) => {
    return fileSize <= maxSize;
};
/**
 * Проверяет валидность артикула товара
 * @param sku - Артикул товара
 * @param pattern - Регулярное выражение (по умолчанию /^[A-Z0-9-]{5,20}$/i)
 * @returns boolean
 */
const isValidProductSKU = (sku, pattern = /^[A-Z0-9-]{5,20}$/i) => {
    return pattern.test(sku.trim());
};
/**
 * Проверяет валидность ISBN (книги)
 * @param isbn - Проверяемый ISBN
 * @returns boolean
 */
const isValidISBN = (isbn) => {
    // Упрощенная проверка формата (можно реализовать полную проверку контрольной суммы)
    return /^(97(8|9))?\d{9}(\d|X)$/i.test(isbn.trim());
};
/**
 * Проверяет валидность HEX-цвета (например, #FFFFFF)
 * @param color - Проверяемый цвет
 * @returns boolean
 */
const isValidHexColor = (color) => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color.trim());
};
/**
 * Проверяет валидность имени пользователя
 * (латинские/кириллические буквы, цифры, подчеркивания, точки)
 * @param username - Имя пользователя
 * @param minLength - Минимальная длина (по умолчанию 3)
 * @param maxLength - Максимальная длина (по умолчанию 20)
 * @returns boolean
 */
const isValidUsername = (username, minLength = 3, maxLength = 20) => {
    if (username.length < minLength || username.length > maxLength)
        return false;
    return /^[a-zA-Zа-яА-ЯёЁ0-9_.]+$/.test(username);
};
/**
 * Проверяет валидность домена
 * @param domain - Проверяемый домен
 * @returns boolean
 */
const isValidDomain = (domain) => {
    return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(domain.trim());
};
/**
 * Проверяет валидность международного номера телефона
 * @param phone - Номер телефона
 * @returns boolean
 */
const isValidInternationalPhone = (phone) => {
    return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(phone.trim());
};
/**
 * Проверяет валидность SWIFT-кода
 * @param swift - SWIFT-код
 * @returns boolean
 */
const isValidSWIFT = (swift) => {
    return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swift.trim());
};

class ColorUtils {
    /**
     * Преобразует HEX в RGB
     */
    static hexToRgb(hex) {
        let cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
        }
        if (cleanHex.length !== 6)
            return null;
        const r = parseInt(cleanHex.substring(0, 2), 16);
        const g = parseInt(cleanHex.substring(2, 4), 16);
        const b = parseInt(cleanHex.substring(4, 6), 16);
        return { r, g, b };
    }
    /**
     * Преобразует RGB в HEX
     */
    static rgbToHex(r, g, b) {
        return ('#' +
            [r, g, b]
                .map(x => x.toString(16).padStart(2, '0'))
                .join('')
                .toUpperCase());
    }
    /**
     * Создание более светлого оттенка цвета
     * @param hex базовый цвет
     * @param amount 0-1 (0 = без изменения, 1 = белый)
     */
    static lighten(hex, amount) {
        const rgb = this.hexToRgb(hex);
        if (!rgb)
            return hex;
        const r = Math.round(rgb.r + (255 - rgb.r) * amount);
        const g = Math.round(rgb.g + (255 - rgb.g) * amount);
        const b = Math.round(rgb.b + (255 - rgb.b) * amount);
        return this.rgbToHex(r, g, b);
    }
    /**
     * Создание более тёмного оттенка цвета
     * @param hex базовый цвет
     * @param amount 0-1 (0 = без изменения, 1 = чёрный)
     */
    static darken(hex, amount) {
        const rgb = this.hexToRgb(hex);
        if (!rgb)
            return hex;
        const r = Math.round(rgb.r * (1 - amount));
        const g = Math.round(rgb.g * (1 - amount));
        const b = Math.round(rgb.b * (1 - amount));
        return this.rgbToHex(r, g, b);
    }
    /**
     * Возвращает контрастный цвет (чёрный или белый) для текста
     */
    static contrast(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb)
            return '#000000';
        // стандартная формула яркости
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    }
    /**
     * Создание палитры оттенков для цвета
     * @param hex базовый цвет
     * @param steps количество оттенков
     */
    static palette(hex, steps = 5) {
        const palette = [];
        const stepAmount = 0.1;
        for (let i = steps; i > 0; i--) {
            palette.push(this.lighten(hex, stepAmount * i));
        }
        palette.push(hex);
        for (let i = 1; i <= steps; i++) {
            palette.push(this.darken(hex, stepAmount * i));
        }
        return palette;
    }
}

// npm i @angular/animations
// Ядро библиотеки

/**
 * Generated bundle index. Do not edit.
 */

export { ChartComponent, CheckboxComponent, ColorUtils, DatePickerComponent, FormFieldComponent, GaugeComponent, HeatMapComponent, LogLevel, LogMethod, Logger, ModalComponent, NavBarComponent, ProgressBarComponent, SelectComponent, SidebarComponent, SkeletonLoaderComponent, StorageUtils, TableComponent, TimePickerComponent, TimelineComponent, ToastComponent, ToastService, TooltipComponent, UiLibComponent, UiLibService, addDays, compareDates, diffInDays, formatDateTime, formatDeliveryRange, formatLongDate, formatPrice, formatShortDate, formatTimeRange, getDeliveryDate, hasMaxLength, hasMinLength, hasValidFileExtension, isAlpha, isDateInRange, isExpired, isFutureDate, isInRange, isInteger, isNotEmpty, isPastDate, isPositiveNumber, isStrongPassword, isToday, isValidAddress, isValidCVV, isValidCardExpiry, isValidCreditCard, isValidDate, isValidDomain, isValidEmail, isValidFileSize, isValidHexColor, isValidINN, isValidISBN, isValidImageUrl, isValidInternationalPhone, isValidProductQuantity, isValidProductSKU, isValidPromoCode, isValidRussianPhone, isValidRussianZipCode, isValidSWIFT, isValidUsername, isYesterday, logExecutionTime, logger, parseDate, truncateText };
//# sourceMappingURL=ui-lib.mjs.map
