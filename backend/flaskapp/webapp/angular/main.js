(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _components_login_login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/login/login.component */ "./src/app/components/login/login.component.ts");
/* harmony import */ var _components_user_create_user_create_user_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/user/create-user/create-user.component */ "./src/app/components/user/create-user/create-user.component.ts");
/* harmony import */ var _urlPermission_url_permission__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./urlPermission/url.permission */ "./src/app/urlPermission/url.permission.ts");
/* harmony import */ var _components_user_user_list_user_list_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/user/user-list/user-list.component */ "./src/app/components/user/user-list/user-list.component.ts");
/* harmony import */ var _components_user_user_edit_user_edit_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/user/user-edit/user-edit.component */ "./src/app/components/user/user-edit/user-edit.component.ts");
/* harmony import */ var _components_user_account_account_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/user/account/account.component */ "./src/app/components/user/account/account.component.ts");









var routes = [
    { path: 'login', component: _components_login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"] },
    { path: 'user/createUser', component: _components_user_create_user_create_user_component__WEBPACK_IMPORTED_MODULE_4__["CreateUserComponent"], canActivate: [_urlPermission_url_permission__WEBPACK_IMPORTED_MODULE_5__["AdminPermission"]] },
    { path: 'user/users', component: _components_user_user_list_user_list_component__WEBPACK_IMPORTED_MODULE_6__["UserListComponent"], canActivate: [_urlPermission_url_permission__WEBPACK_IMPORTED_MODULE_5__["AdminPermission"]] },
    { path: 'user/edit/:id', component: _components_user_user_edit_user_edit_component__WEBPACK_IMPORTED_MODULE_7__["UserEditComponent"], canActivate: [_urlPermission_url_permission__WEBPACK_IMPORTED_MODULE_5__["AdminPermission"]] },
    { path: 'user/account/:username', component: _components_user_account_account_component__WEBPACK_IMPORTED_MODULE_8__["AccountComponent"], canActivate: [_urlPermission_url_permission__WEBPACK_IMPORTED_MODULE_5__["SameUserPermission"]] },
    // otherwise redirect to profile
    { path: '**', redirectTo: '/' }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes, { useHash: true })],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* Override bootstrap style when click a dropdown-item */\n.dropdown-item.active, .dropdown-item:active {\n    color: #fff;\n    background-color: slategray;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsd0RBQXdEO0FBQ3hEO0lBQ0ksV0FBVztJQUNYLDJCQUEyQjtBQUMvQiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogT3ZlcnJpZGUgYm9vdHN0cmFwIHN0eWxlIHdoZW4gY2xpY2sgYSBkcm9wZG93bi1pdGVtICovXG4uZHJvcGRvd24taXRlbS5hY3RpdmUsIC5kcm9wZG93bi1pdGVtOmFjdGl2ZSB7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogc2xhdGVncmF5O1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark justify-content-between\">\n  <ul class=\"navbar-nav mr-auto\">\n    <li class=\"nav-item\">\n      <a class=\"nav-link\" routerLink=\"#\" routerLinkActive=\"active\">Home <span class=\"sr-only\">(current)</span></a>\n    </li>\n    <li class=\"nav-item\">\n      <a class=\"nav-link\" *ngIf=\"hasRole('ROLE_USER')\" routerLink=\"#\" routerLinkActive=\"active\">User Feature</a>\n    </li>\n  </ul>\n  <ul class=\"navbar-nav ml-auto\">\n    <li class=\"nav-item\">\n      <a class=\"nav-link\" *ngIf=\"!currentUser\" routerLink=\"/login\" routerLinkActive=\"active\">\n        <span class=\"fa fa-sign-in\"></span> Login</a>\n      <a class=\"nav-item btn-group\" routerLinkActive=\"active\" *ngIf=\"currentUser\">\n        <a class=\"nav-link dropdown-toggle\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\" \n          aria-haspopup=\"true\" aria-expanded=\"false\" aria-controls=\"dropdown-alignment\">\n          <span class=\"fa fa-user-circle\"></span> {{currentUser.username}}\n        </a>\n        <div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"navbarDropdown\">\n          <a class=\"dropdown-item\" *ngIf=\"hasRole('ROLE_USER')\" routerLink=\"user/account/{{currentUser.username}}\">\n            <span class=\"fa fa-user-circle\"></span> Account\n          </a>\n          <a class=\"dropdown-item\" *ngIf=\"hasRole('ROLE_ADMIN')\" routerLink=\"user/createUser\">\n            <span class=\"fa fa-user-plus\"></span> Create user\n          </a>\n          <a class=\"dropdown-item\" *ngIf=\"hasRole('ROLE_ADMIN')\" routerLink=\"user/users\">\n            <span class=\"fa fa-users\"></span> Users\n          </a>\n          <div class=\"dropdown-divider\"></div>\n          <a class=\"dropdown-item\" (click)=\"logout()\">\n            <span class=\"fa fa-sign-out\"></span> Logout\n          </a>\n        </div>\n      </a>\n    </li>\n  </ul>\n</nav>\n<div *ngFor=\"let alert of alerts\">\n  <alert [type]=\"alert.type\" [dismissible]=true [dismissOnTimeout]=\"alert.timeout\" (onClosed)=\"onClosed(alert)\">{{ alert.msg }}</alert>\n</div>\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/notification/notification.service */ "./src/app/services/notification/notification.service.ts");
/* harmony import */ var _components_component_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/component.utils */ "./src/app/components/component.utils.ts");
/* harmony import */ var _statics_local_storage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./statics/local-storage */ "./src/app/statics/local-storage.ts");






var AppComponent = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AppComponent, _super);
    function AppComponent(notificationService, router) {
        var _this = _super.call(this, notificationService) || this;
        _this.notificationService = notificationService;
        _this.router = router;
        _this.title = 'MyApp';
        _this.alerts = [];
        _this.updateUser();
        _this.notificationService.successMessage$.subscribe(function (message) {
            _this.addAlerts("success", message, 5000);
        });
        _this.notificationService.warningMessage$.subscribe(function (message) {
            _this.addAlerts("warning", message, 10000);
        });
        _this.notificationService.errorMessage$.subscribe(function (message) {
            _this.addAlerts("danger", message, 15000);
        });
        return _this;
    }
    AppComponent.prototype.messageIsRepted = function (msg) {
        var isRepted = false;
        this.alerts.forEach(function (alert) {
            if (alert.msg == msg) {
                isRepted = true;
            }
        });
        return isRepted;
    };
    AppComponent.prototype.addAlerts = function (type, msg, timeout) {
        // Check if alert already has this message. Only add a new one if msg is new. 
        if (!this.messageIsRepted(msg)) {
            this.alerts.push({
                type: type,
                msg: msg,
                timeout: timeout
            });
        }
    };
    AppComponent.prototype.onClosed = function (dismissedAlert) {
        this.alerts = this.alerts.filter(function (alert) { return alert !== dismissedAlert; });
    };
    AppComponent.prototype.updateUser = function () {
        this.currentUser = _statics_local_storage__WEBPACK_IMPORTED_MODULE_5__["LocalStorage"].currentUser;
    };
    AppComponent.prototype.syncUser = function (user) {
        _statics_local_storage__WEBPACK_IMPORTED_MODULE_5__["LocalStorage"].removeCurrentUser();
        _statics_local_storage__WEBPACK_IMPORTED_MODULE_5__["LocalStorage"].saveCurrentUser(user);
        this.updateUser();
    };
    AppComponent.prototype.logout = function () {
        this.currentUser = null;
        _statics_local_storage__WEBPACK_IMPORTED_MODULE_5__["LocalStorage"].removeCurrentUser();
        this.notificationService.showSuccessMessage("You were logged out.");
        this.router.navigate(['/login']);
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_notification_notification_service__WEBPACK_IMPORTED_MODULE_3__["NotificationService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], AppComponent);
    return AppComponent;
}(_components_component_utils__WEBPACK_IMPORTED_MODULE_4__["ComponentUtils"]));



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap_buttons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/buttons */ "./node_modules/ngx-bootstrap/buttons/fesm5/ngx-bootstrap-buttons.js");
/* harmony import */ var ngx_bootstrap_alert__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/alert */ "./node_modules/ngx-bootstrap/alert/fesm5/ngx-bootstrap-alert.js");
/* harmony import */ var ngx_bootstrap_tabs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap/tabs */ "./node_modules/ngx-bootstrap/tabs/fesm5/ngx-bootstrap-tabs.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/fesm5/ngx-bootstrap-modal.js");
/* harmony import */ var ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-bootstrap/dropdown */ "./node_modules/ngx-bootstrap/dropdown/fesm5/ngx-bootstrap-dropdown.js");
/* harmony import */ var ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-bootstrap/pagination */ "./node_modules/ngx-bootstrap/pagination/fesm5/ngx-bootstrap-pagination.js");
/* harmony import */ var ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ngx-bootstrap/typeahead */ "./node_modules/ngx-bootstrap/typeahead/fesm5/ngx-bootstrap-typeahead.js");
/* harmony import */ var ngx_bootstrap_collapse__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ngx-bootstrap/collapse */ "./node_modules/ngx-bootstrap/collapse/fesm5/ngx-bootstrap-collapse.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _services_user_user_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./services/user/user.service */ "./src/app/services/user/user.service.ts");
/* harmony import */ var _interceptors_token_interceptor__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./interceptors/token.interceptor */ "./src/app/interceptors/token.interceptor.ts");
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./services/auth/auth.service */ "./src/app/services/auth/auth.service.ts");
/* harmony import */ var _components_login_login_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/login/login.component */ "./src/app/components/login/login.component.ts");
/* harmony import */ var _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./services/notification/notification.service */ "./src/app/services/notification/notification.service.ts");
/* harmony import */ var _components_user_create_user_create_user_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/user/create-user/create-user.component */ "./src/app/components/user/create-user/create-user.component.ts");
/* harmony import */ var _urlPermission_url_permission__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./urlPermission/url.permission */ "./src/app/urlPermission/url.permission.ts");
/* harmony import */ var _components_user_user_list_user_list_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/user/user-list/user-list.component */ "./src/app/components/user/user-list/user-list.component.ts");
/* harmony import */ var _components_user_user_edit_user_edit_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./components/user/user-edit/user-edit.component */ "./src/app/components/user/user-edit/user-edit.component.ts");
/* harmony import */ var _components_user_account_account_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./components/user/account/account.component */ "./src/app/components/user/account/account.component.ts");


























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_14__["AppComponent"],
                _components_login_login_component__WEBPACK_IMPORTED_MODULE_18__["LoginComponent"],
                _components_user_create_user_create_user_component__WEBPACK_IMPORTED_MODULE_20__["CreateUserComponent"],
                _components_user_user_list_user_list_component__WEBPACK_IMPORTED_MODULE_22__["UserListComponent"],
                _components_user_user_edit_user_edit_component__WEBPACK_IMPORTED_MODULE_23__["UserEditComponent"],
                _components_user_account_account_component__WEBPACK_IMPORTED_MODULE_24__["AccountComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_13__["AppRoutingModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                ngx_bootstrap_buttons__WEBPACK_IMPORTED_MODULE_5__["ButtonsModule"].forRoot(),
                ngx_bootstrap_alert__WEBPACK_IMPORTED_MODULE_6__["AlertModule"].forRoot(),
                ngx_bootstrap_tabs__WEBPACK_IMPORTED_MODULE_7__["TabsModule"].forRoot(),
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_8__["ModalModule"].forRoot(),
                ngx_bootstrap_dropdown__WEBPACK_IMPORTED_MODULE_9__["BsDropdownModule"].forRoot(),
                ngx_bootstrap_pagination__WEBPACK_IMPORTED_MODULE_10__["PaginationModule"].forRoot(),
                ngx_bootstrap_typeahead__WEBPACK_IMPORTED_MODULE_11__["TypeaheadModule"].forRoot(),
                ngx_bootstrap_collapse__WEBPACK_IMPORTED_MODULE_12__["CollapseModule"].forRoot()
            ],
            providers: [
                _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_17__["AuthService"],
                _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_19__["NotificationService"],
                _services_user_user_service__WEBPACK_IMPORTED_MODULE_15__["UserService"],
                {
                    provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HTTP_INTERCEPTORS"],
                    useClass: _interceptors_token_interceptor__WEBPACK_IMPORTED_MODULE_16__["TokenInterceptor"],
                    multi: true
                },
                _urlPermission_url_permission__WEBPACK_IMPORTED_MODULE_21__["LoginPermission"],
                _urlPermission_url_permission__WEBPACK_IMPORTED_MODULE_21__["SameUserPermission"],
                _urlPermission_url_permission__WEBPACK_IMPORTED_MODULE_21__["AdminPermission"]
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_14__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/components/component.utils.ts":
/*!***********************************************!*\
  !*** ./src/app/components/component.utils.ts ***!
  \***********************************************/
/*! exports provided: ComponentUtils */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentUtils", function() { return ComponentUtils; });
/* harmony import */ var _statics_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../statics/local-storage */ "./src/app/statics/local-storage.ts");

var ComponentUtils = /** @class */ (function () {
    function ComponentUtils(__notificationService) {
        this.__notificationService = __notificationService;
        // bsConfig = Object.assign({}, {locale: 'de', containerClass: 'theme-dark-blue', dateInputFormat: 'DD.MM.YYYY'});
        this.currentUser = _statics_local_storage__WEBPACK_IMPORTED_MODULE_0__["LocalStorage"].currentUser;
    }
    ComponentUtils.prototype.showSuccessMessage = function (message) {
        this.__notificationService.showSuccessMessage(message);
    };
    ComponentUtils.prototype.showWarningMessage = function (message) {
        this.__notificationService.showWarningMessage(message);
    };
    ComponentUtils.prototype.showErrorMessage = function (message) {
        this.__notificationService.showErrorMessage(message);
    };
    ComponentUtils.prototype.userHasRole = function (user, role) {
        if (user == null) {
            return false;
        }
        if (user.roles != null && user.roles.includes(role)) {
            return true;
        }
        return false;
    };
    ComponentUtils.prototype.hasRole = function (role) {
        return this.userHasRole(this.currentUser, role);
    };
    return ComponentUtils;
}());



/***/ }),

/***/ "./src/app/components/login/login.component.css":
/*!******************************************************!*\
  !*** ./src/app/components/login/login.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".card-container.card {\n    max-width: 350px;\n    padding: 40px 40px;\n}\n\n/*\n* Card component\n*/\n\n.card {\n    background-color: #F7F7F7;\n    /* just in case there no content*/\n    padding: 20px 25px 30px;\n    margin: 0 auto 25px;\n    margin-top: 50px;\n    /* shadows and rounded borders */\n    border-radius: 2px;\n    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);\n}\n\n.profile-img-card {\n    width: 96px;\n    height: 96px;\n    margin: 0 auto 10px;\n    display: block;\n    border-radius: 50%;\n}\n\n/*\n* Form styles\n*/\n\n.profile-name-card {\n    font-size: 16px;\n    font-weight: bold;\n    text-align: center;\n    margin: 10px 0 0;\n    min-height: 1em;\n}\n\n.reauth-email {\n    display: block;\n    color: #404040;\n    line-height: 2;\n    margin-bottom: 10px;\n    font-size: 14px;\n    text-align: center;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    box-sizing: border-box;\n}\n\n.form-signin #inputEmail,\n.form-signin #inputPassword {\n    direction: ltr;\n    height: 44px;\n    font-size: 16px;\n}\n\n.form-signin input[type=email],\n.form-signin input[type=password],\n.form-signin input[type=text],\n.form-signin button {\n    width: 100%;\n    display: block;\n    margin-bottom: 10px;\n    z-index: 1;\n    position: relative;\n    box-sizing: border-box;\n}\n\n.form-signin .form-control:focus {\n    border-color: rgb(104, 145, 162);\n    outline: 0;\n    box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgb(104, 145, 162);\n}\n\n.forgot-password {\n    color: rgb(104, 145, 162);\n}\n\n.forgot-password:hover,\n.forgot-password:active,\n.forgot-password:focus{\n    color: rgb(12, 97, 33);\n}\n\n.help-block{\n    color: red\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9sb2dpbi9sb2dpbi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksZ0JBQWdCO0lBQ2hCLGtCQUFrQjtBQUN0Qjs7QUFFQTs7Q0FFQzs7QUFDRDtJQUNJLHlCQUF5QjtJQUN6QixpQ0FBaUM7SUFDakMsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUNuQixnQkFBZ0I7SUFDaEIsZ0NBQWdDO0lBR2hDLGtCQUFrQjtJQUdsQiwwQ0FBMEM7QUFDOUM7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsWUFBWTtJQUNaLG1CQUFtQjtJQUNuQixjQUFjO0lBR2Qsa0JBQWtCO0FBQ3RCOztBQUVBOztDQUVDOztBQUNEO0lBQ0ksZUFBZTtJQUNmLGlCQUFpQjtJQUNqQixrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxjQUFjO0lBQ2QsY0FBYztJQUNkLGNBQWM7SUFDZCxtQkFBbUI7SUFDbkIsZUFBZTtJQUNmLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUduQixzQkFBc0I7QUFDMUI7O0FBRUE7O0lBRUksY0FBYztJQUNkLFlBQVk7SUFDWixlQUFlO0FBQ25COztBQUVBOzs7O0lBSUksV0FBVztJQUNYLGNBQWM7SUFDZCxtQkFBbUI7SUFDbkIsVUFBVTtJQUNWLGtCQUFrQjtJQUdsQixzQkFBc0I7QUFDMUI7O0FBRUE7SUFDSSxnQ0FBZ0M7SUFDaEMsVUFBVTtJQUVWLHVFQUF1RTtBQUMzRTs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTs7O0lBR0ksc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0k7QUFDSiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvbG9naW4vbG9naW4uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jYXJkLWNvbnRhaW5lci5jYXJkIHtcbiAgICBtYXgtd2lkdGg6IDM1MHB4O1xuICAgIHBhZGRpbmc6IDQwcHggNDBweDtcbn1cblxuLypcbiogQ2FyZCBjb21wb25lbnRcbiovXG4uY2FyZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI0Y3RjdGNztcbiAgICAvKiBqdXN0IGluIGNhc2UgdGhlcmUgbm8gY29udGVudCovXG4gICAgcGFkZGluZzogMjBweCAyNXB4IDMwcHg7XG4gICAgbWFyZ2luOiAwIGF1dG8gMjVweDtcbiAgICBtYXJnaW4tdG9wOiA1MHB4O1xuICAgIC8qIHNoYWRvd3MgYW5kIHJvdW5kZWQgYm9yZGVycyAqL1xuICAgIC1tb3otYm9yZGVyLXJhZGl1czogMnB4O1xuICAgIC13ZWJraXQtYm9yZGVyLXJhZGl1czogMnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICAtbW96LWJveC1zaGFkb3c6IDBweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcbiAgICAtd2Via2l0LWJveC1zaGFkb3c6IDBweCAycHggMnB4IHJnYmEoMCwgMCwgMCwgMC4zKTtcbiAgICBib3gtc2hhZG93OiAwcHggMnB4IDJweCByZ2JhKDAsIDAsIDAsIDAuMyk7XG59XG5cbi5wcm9maWxlLWltZy1jYXJkIHtcbiAgICB3aWR0aDogOTZweDtcbiAgICBoZWlnaHQ6IDk2cHg7XG4gICAgbWFyZ2luOiAwIGF1dG8gMTBweDtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICAtbW96LWJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAtd2Via2l0LWJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG59XG5cbi8qXG4qIEZvcm0gc3R5bGVzXG4qL1xuLnByb2ZpbGUtbmFtZS1jYXJkIHtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIG1hcmdpbjogMTBweCAwIDA7XG4gICAgbWluLWhlaWdodDogMWVtO1xufVxuXG4ucmVhdXRoLWVtYWlsIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBjb2xvcjogIzQwNDA0MDtcbiAgICBsaW5lLWhlaWdodDogMjtcbiAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIC1tb3otYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAtd2Via2l0LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLmZvcm0tc2lnbmluICNpbnB1dEVtYWlsLFxuLmZvcm0tc2lnbmluICNpbnB1dFBhc3N3b3JkIHtcbiAgICBkaXJlY3Rpb246IGx0cjtcbiAgICBoZWlnaHQ6IDQ0cHg7XG4gICAgZm9udC1zaXplOiAxNnB4O1xufVxuXG4uZm9ybS1zaWduaW4gaW5wdXRbdHlwZT1lbWFpbF0sXG4uZm9ybS1zaWduaW4gaW5wdXRbdHlwZT1wYXNzd29yZF0sXG4uZm9ybS1zaWduaW4gaW5wdXRbdHlwZT10ZXh0XSxcbi5mb3JtLXNpZ25pbiBidXR0b24ge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XG4gICAgei1pbmRleDogMTtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgLW1vei1ib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4uZm9ybS1zaWduaW4gLmZvcm0tY29udHJvbDpmb2N1cyB7XG4gICAgYm9yZGVyLWNvbG9yOiByZ2IoMTA0LCAxNDUsIDE2Mik7XG4gICAgb3V0bGluZTogMDtcbiAgICAtd2Via2l0LWJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4wNzUpLDAgMCA4cHggcmdiKDEwNCwgMTQ1LCAxNjIpO1xuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMXB4IDFweCByZ2JhKDAsMCwwLC4wNzUpLDAgMCA4cHggcmdiKDEwNCwgMTQ1LCAxNjIpO1xufVxuXG4uZm9yZ290LXBhc3N3b3JkIHtcbiAgICBjb2xvcjogcmdiKDEwNCwgMTQ1LCAxNjIpO1xufVxuXG4uZm9yZ290LXBhc3N3b3JkOmhvdmVyLFxuLmZvcmdvdC1wYXNzd29yZDphY3RpdmUsXG4uZm9yZ290LXBhc3N3b3JkOmZvY3Vze1xuICAgIGNvbG9yOiByZ2IoMTIsIDk3LCAzMyk7XG59XG5cbi5oZWxwLWJsb2Nre1xuICAgIGNvbG9yOiByZWRcbn0iXX0= */"

/***/ }),

/***/ "./src/app/components/login/login.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/login/login.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"card card-container\">\n    <img class=\"profile-img-card\" src=\"./assets/images/mario.jpg\" alt=\"\" />\n    <p id=\"profile-name\" class=\"profile-name-card\"></p>\n\n    <form name=\"form-signin\" (ngSubmit)=\"f.form.valid && login()\" #f=\"ngForm\" novalidate>\n      <div class=\"alert alert-danger\" role=\"alert\" *ngIf=\"errorMessage\">{{errorMessage}}</div>\n    <span id=\"reauth-email\" class=\"reauth-email\"></span>\n    <div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !username.valid }\">\n      <label for=\"username\">Username</label>\n      <input type=\"text\" class=\"form-control\" id=\"username\" name=\"username\" [(ngModel)]=\"user.username\" #username=\"ngModel\" required />\n      <div *ngIf=\"f.submitted && !username.valid\" class=\"help-block\">Please, insert an username.</div>\n    </div>\n    <div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !password.valid }\">\n      <label for=\"password\">Password</label>\n      <input type=\"password\" class=\"form-control\" id=\"password\" name=\"password\" [(ngModel)]=\"user.password\" #password=\"ngModel\" required />\n      <div *ngIf=\"f.submitted && !password.valid\" class=\"help-block\">Please, insert a password.</div>\n    </div>\n    <div id=\"remember\" class=\"checkbox\"></div>\n\n      <!--<button class=\"btn btn-lg btn-primary btn-block btn-signin\" type=\"submit\">Anmelden</button>-->\n      <button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\">Sign in</button>\n    </form><!-- /form -->\n  </div><!-- /card-container -->\n</div><!-- /container -->\n"

/***/ }),

/***/ "./src/app/components/login/login.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/login/login.component.ts ***!
  \*****************************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _model_model_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../model/model.user */ "./src/app/model/model.user.ts");
/* harmony import */ var _services_auth_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/auth/auth.service */ "./src/app/services/auth/auth.service.ts");
/* harmony import */ var _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/notification/notification.service */ "./src/app/services/notification/notification.service.ts");
/* harmony import */ var _statics_local_storage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../statics/local-storage */ "./src/app/statics/local-storage.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../app.component */ "./src/app/app.component.ts");








var LoginComponent = /** @class */ (function () {
    function LoginComponent(authService, notificationService, router, appComponent) {
        this.authService = authService;
        this.notificationService = notificationService;
        this.router = router;
        this.appComponent = appComponent;
        this.user = new _model_model_user__WEBPACK_IMPORTED_MODULE_3__["User"]();
        // If user is logged redirect to home.
        if (_statics_local_storage__WEBPACK_IMPORTED_MODULE_6__["LocalStorage"].currentUser) {
            this.redirectToHome();
        }
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.authService.login(this.user).subscribe(function (user) {
            if (user) {
                _this.notificationService.showSuccessMessage("Logged in as " + user.username);
                _statics_local_storage__WEBPACK_IMPORTED_MODULE_6__["LocalStorage"].saveCurrentUser(user);
                _this.redirectToHome();
            }
            else {
                _this.notificationService.showErrorMessage("Username or password don't match, try again.");
            }
        }, function (error) {
            _this.notificationService.showErrorMessage(error.message);
            console.log(error);
        });
    };
    LoginComponent.prototype.redirectToHome = function () {
        this.router.navigate(['/']);
        this.appComponent.updateUser();
    };
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/components/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/components/login/login.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_auth_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"], _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_5__["NotificationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/components/user/account/account.component.css":
/*!***************************************************************!*\
  !*** ./src/app/components/user/account/account.component.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvdXNlci9hY2NvdW50L2FjY291bnQuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/components/user/account/account.component.html":
/*!****************************************************************!*\
  !*** ./src/app/components/user/account/account.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" *ngIf=\"userForm\">\n  <div class=\"row\">\n    <div class=\"col-md-6 offset-md-3\">\n      <h2>Change profile</h2>\n      <form [formGroup]=\"userForm\"  (ngSubmit)=\"onSubmit()\">\n        <div class=\"form-group\">\n          <label>First Name</label>\n          <input type=\"text\" formControlName=\"firstName\" class=\"form-control\" \n            [ngClass]=\"{ 'is-invalid': submitted && f.firstName.errors }\" \n            placeholder=\"First name\" />\n          <div class=\"invalid-feedback\">First Name is required</div>\n        </div>\n        <div class=\"form-group\">\n          <label>Last Name</label>\n          <input type=\"text\" formControlName=\"lastName\" class=\"form-control\" \n            [ngClass]=\"{ 'is-invalid': submitted && f.lastName.errors }\"\n            placeholder=\"Last name\" />\n          <div class=\"invalid-feedback\">Last Name is required.</div>\n        </div>\n        <div class=\"form-group\">\n          <label>Username</label>\n          <input type=\"text\" formControlName=\"username\" class=\"form-control\" \n            [ngClass]=\"{ 'is-invalid': submitted && f.username.errors }\"\n            autocomplete=\"off\"/>\n          <div *ngIf=\"submitted && f.username.errors\" class=\"invalid-feedback\">\n            <div *ngIf=\"f.username.errors.required\">Username is required.</div>\n            <div *ngIf=\"f.username.errors.isTaken\">This username already exists.</div>\n          </div>\n        </div>\n        <button type=\"button\" class=\"form-group btn btn-info\" (click)=\"onChangePassword()\"\n          [attr.aria-expanded]=\"!changePassword\" aria-controls=\"collapseBasic\">Change password\n        </button>\n        <div id=\"collapseBasic\" [collapse]=\"!changePassword\">\n            <div class=\"form-group\">\n              <label>New Password</label>\n              <input type=\"password\" formControlName=\"password\" class=\"form-control\" \n                [ngClass]=\"{ 'is-invalid': submitted && f.password.errors }\"\n                autocomplete=\"off\"/>\n              <div *ngIf=\"submitted && f.password.errors\" class=\"invalid-feedback\">\n                <div *ngIf=\"f.password.errors.required\">Password is required.</div>\n                <div *ngIf=\"f.password.errors.minlength\">Password must be at least {{passwordMinLenght}} characters.</div>\n              </div>\n            </div>\n            <div class=\"form-group\">\n              <label>Confirm new password</label>\n              <input type=\"password\" formControlName=\"confirmPassword\" class=\"form-control\" \n                [ngClass]=\"{ 'is-invalid': submitted && f.confirmPassword.errors }\" \n                autocomplete=\"off\"/>\n              <div class=\"invalid-feedback\">\n                <div>Password doesn't match.</div>\n              </div>\n            </div>\n        </div>\n        <div class=\"form-group\">\n          <button [disabled]=\"userForm.pending\" class=\"btn btn-info\">Save</button>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/user/account/account.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/components/user/account/account.component.ts ***!
  \**************************************************************/
/*! exports provided: AccountComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AccountComponent", function() { return AccountComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/notification/notification.service */ "./src/app/services/notification/notification.service.ts");
/* harmony import */ var _services_user_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/user/user.service */ "./src/app/services/user/user.service.ts");
/* harmony import */ var _statics_form_validators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../statics/form-validators */ "./src/app/statics/form-validators.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../app.component */ "./src/app/app.component.ts");








var AccountComponent = /** @class */ (function () {
    function AccountComponent(route, formBuilder, appComponent, notificationService, userService) {
        var _this = this;
        this.route = route;
        this.formBuilder = formBuilder;
        this.appComponent = appComponent;
        this.notificationService = notificationService;
        this.userService = userService;
        this.passwordMinLenght = _statics_form_validators__WEBPACK_IMPORTED_MODULE_6__["AppValidador"].passwordMinLenght;
        this.changePassword = false;
        this.submitted = false;
        this.route.params.subscribe(function (params) {
            if (params && params.username) {
                _this.userService.getByUsername(params.username).subscribe(function (data) {
                    _this.user = data;
                    _this.buildForm(_this.user);
                }, function (error) {
                    _this.notificationService.showErrorMessage(error.message);
                    console.log(error);
                });
            }
        }, function (error) {
            console.log(error);
        });
    }
    AccountComponent.prototype.ngOnInit = function () {
    };
    AccountComponent.prototype.buildForm = function (user) {
        this.userForm = this.formBuilder.group({
            username: [this.user.username, { validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required], asyncValidators: [_statics_form_validators__WEBPACK_IMPORTED_MODULE_6__["UserValidador"].validateUsername(this.userService, 500, [this.user.username])], updateOn: 'change' }],
            firstName: [user.name, { validators: _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, updateOn: 'change' }],
            lastName: [user.surname, { validators: _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, updateOn: 'change' }],
            password: ['', { validators: [], updateOn: 'change' }],
            confirmPassword: ['', { validators: [], updateOn: 'change' }],
        });
    };
    AccountComponent.prototype.onChangePassword = function () {
        this.changePassword = !this.changePassword;
        if (this.changePassword) {
            this.f.password.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].minLength(this.passwordMinLenght)]);
            this.f.confirmPassword.setValidators([_statics_form_validators__WEBPACK_IMPORTED_MODULE_6__["AppValidador"].match("password")]);
            this.f.password.updateValueAndValidity();
            this.f.confirmPassword.updateValueAndValidity();
        }
        else {
            this.f.password.clearValidators();
            this.f.confirmPassword.clearValidators();
        }
    };
    Object.defineProperty(AccountComponent.prototype, "f", {
        get: function () { return this.userForm.controls; },
        enumerable: true,
        configurable: true
    });
    AccountComponent.prototype.formToUser = function () {
        this.user.username = this.f.username.value;
        this.user.name = this.f.firstName.value;
        this.user.surname = this.f.lastName.value;
        if (this.changePassword) {
            this.user.password = this.f.password.value;
        }
        return this.user;
    };
    AccountComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // Validade confirmPassowrd before submit.
        this.f.confirmPassword.updateValueAndValidity();
        // stop here if form is invalid
        if (this.userForm.invalid) {
            return;
        }
        var user = this.formToUser();
        this.userService.selfUpdate(user).subscribe(function (updateUser) {
            if (updateUser) {
                _this.notificationService.showSuccessMessage("Profile was uptodate.");
                _this.appComponent.syncUser(updateUser);
            }
            else {
                _this.notificationService.showErrorMessage("Fail to uptodate profile.");
            }
        }, function (error) {
            console.log(error);
            _this.notificationService.showErrorMessage(error.message);
        });
    };
    AccountComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-account',
            template: __webpack_require__(/*! ./account.component.html */ "./src/app/components/user/account/account.component.html"),
            styles: [__webpack_require__(/*! ./account.component.css */ "./src/app/components/user/account/account.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"], _app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"],
            _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_4__["NotificationService"], _services_user_user_service__WEBPACK_IMPORTED_MODULE_5__["UserService"]])
    ], AccountComponent);
    return AccountComponent;
}());



/***/ }),

/***/ "./src/app/components/user/create-user/create-user.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/components/user/create-user/create-user.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvdXNlci9jcmVhdGUtdXNlci9jcmVhdGUtdXNlci5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/user/create-user/create-user.component.html":
/*!************************************************************************!*\
  !*** ./src/app/components/user/create-user/create-user.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" *ngIf=\"userForm\">\n  <div class=\"row\">\n    <div class=\"col-md-6 offset-md-3\">\n      <h2>Create a new user</h2>\n        <form [formGroup]=\"userForm\"  (ngSubmit)=\"onSubmit()\">\n          <div class=\"form-group\">\n            <label>First Name</label>\n            <input type=\"text\" formControlName=\"firstName\" class=\"form-control\" \n              [ngClass]=\"{ 'is-invalid': submitted && f.firstName.errors }\" \n              placeholder=\"First name\" />\n            <div class=\"invalid-feedback\">First Name is required</div>\n          </div>\n          <div class=\"form-group\">\n            <label>Last Name</label>\n            <input type=\"text\" formControlName=\"lastName\" class=\"form-control\" \n              [ngClass]=\"{ 'is-invalid': submitted && f.lastName.errors }\"\n              placeholder=\"Last name\" />\n            <div class=\"invalid-feedback\">Last Name is required.</div>\n          </div>\n          <div class=\"form-group\">\n            <label>Username</label>\n            <input type=\"text\" formControlName=\"username\" class=\"form-control\" \n              [ngClass]=\"{ 'is-invalid': submitted && f.username.errors }\"\n              autocomplete=\"off\"/>\n            <div *ngIf=\"submitted && f.username.errors\" class=\"invalid-feedback\">\n              <div *ngIf=\"f.username.errors.required\">Username is required.</div>\n              <div *ngIf=\"f.username.errors.isTaken\">This username already exists.</div>\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label>Password</label>\n            <input type=\"password\" formControlName=\"password\" class=\"form-control\" \n              [ngClass]=\"{ 'is-invalid': submitted && f.password.errors }\"\n              autocomplete=\"off\"/>\n            <div *ngIf=\"submitted && f.password.errors\" class=\"invalid-feedback\">\n              <div *ngIf=\"f.password.errors.required\">Password is required.</div>\n              <div *ngIf=\"f.password.errors.minlength\">Password must be at least {{passwordMinLenght}} characters.</div>\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label>Confirm password</label>\n            <input type=\"password\" formControlName=\"confirmPassword\" class=\"form-control\" \n              [ngClass]=\"{ 'is-invalid': submitted && f.confirmPassword.errors }\" \n              autocomplete=\"off\"/>\n            <div class=\"invalid-feedback\">\n              <div>Password doesn't match.</div>\n            </div>\n          </div>\n          <tabset>\n            <!--Rollen Tab-->\n            <tab heading=\"Roles\" id=\"roleTab\">\n              <div class=\"form-group\" formGroupName=\"roles\">\n                <div class=\"form-check\">\n                  <div *ngFor=\"let role of roles\">\n                    <input type=\"checkbox\" formControlName=\"{{role.role_id}}\" id=\"{{role.role_id}}\" class=\"form-check-input\" \n                    [ngClass]=\"{ 'is-invalid': submitted && rolesForm.get(role.role_id).errors }\"\n                    [checked]=\"role.selected\" (change)=\"onToogleRole(role)\"/>\n                    <label class=\"form-check-label\" for=\"{{role.role_id}}\">\n                      {{role.label}}\n                    </label>\n                    <div class=\"invalid-feedback\">\n                      <div>You must select at least one role.</div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </tab>\n            <!--Rechte \n            <tab heading=\"Rights\" id=\"rightTab\">\n              <div class=\"form-group mt-3\">\n                <div class=\"col-sm-10\">\n                  <div class=\"form-check\">\n                    <div *ngFor=\"let right of rights\">\n                      <input class=\"form-check-input\" id=\"{{right.authority}}\" type=\"checkbox\" \n                      [checked]=\"right.selected\" (change)=\"right.selected = !right.selected\" \n                      [disabled]=\"right.containedInRole\">\n                      <label class=\"form-check-label\" for=\"{{right.authority}}\">\n                        {{right.label}}\n                      </label>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </tab> Tab-->\n          </tabset>\n          <div class=\"form-group\">\n            <button [disabled]=\"userForm.pending\" class=\"btn btn-info\">Register</button>\n          </div>\n        </form>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/user/create-user/create-user.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/components/user/create-user/create-user.component.ts ***!
  \**********************************************************************/
/*! exports provided: CreateUserComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateUserComponent", function() { return CreateUserComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _model_model_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../model/model.user */ "./src/app/model/model.user.ts");
/* harmony import */ var _services_user_user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../services/user/user.service */ "./src/app/services/user/user.service.ts");
/* harmony import */ var _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/notification/notification.service */ "./src/app/services/notification/notification.service.ts");
/* harmony import */ var _statics_form_validators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../statics/form-validators */ "./src/app/statics/form-validators.ts");







var CreateUserComponent = /** @class */ (function () {
    function CreateUserComponent(formBuilder, userService, notificationService) {
        var _this = this;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.notificationService = notificationService;
        this.submitted = false;
        this.passwordMinLenght = _statics_form_validators__WEBPACK_IMPORTED_MODULE_6__["AppValidador"].passwordMinLenght;
        this.roles = [];
        this.userService.getRoles().subscribe(function (roles) {
            roles.forEach(function (role) {
                _this.roles.push(role);
            });
            _this.buildForm();
        }, function (error) {
            console.log(error);
            notificationService.showErrorMessage(error.error.message);
        });
    }
    CreateUserComponent.prototype.ngOnInit = function () {
    };
    CreateUserComponent.prototype.buildForm = function () {
        var roleForm = {};
        for (var _i = 0, _a = this.roles; _i < _a.length; _i++) {
            var role = _a[_i];
            roleForm[role.role_id] = ['', { validators: [_statics_form_validators__WEBPACK_IMPORTED_MODULE_6__["UserValidador"].validateRoles(this.roles)], updateOn: 'change' }];
        }
        this.userForm = this.formBuilder.group({
            username: [null, { validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required], asyncValidators: [_statics_form_validators__WEBPACK_IMPORTED_MODULE_6__["UserValidador"].validateUsername(this.userService)], updateOn: 'change' }],
            firstName: ['', { validators: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, updateOn: 'change' }],
            lastName: ['', { validators: _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, updateOn: 'change' }],
            password: ['', { validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(this.passwordMinLenght)], updateOn: 'change' }],
            confirmPassword: ['', { validators: [_statics_form_validators__WEBPACK_IMPORTED_MODULE_6__["AppValidador"].match("password")], updateOn: 'change' }],
            roles: this.formBuilder.group(roleForm)
        });
    };
    Object.defineProperty(CreateUserComponent.prototype, "rolesForm", {
        get: function () { return this.userForm.get("roles"); },
        enumerable: true,
        configurable: true
    });
    CreateUserComponent.prototype.onToogleRole = function (role) {
        var _this = this;
        role.selected = !role.selected;
        if (role.role_id == "ROLE_ADMIN" && role.selected) {
            this.roles.forEach(function (role) {
                if (role.role_id != "ROLE_ADMIN") {
                    _this.rolesForm.get(role.role_id).disable();
                }
                role.selected = true;
            });
        }
        else if (role.role_id == "ROLE_ADMIN" && !role.selected) {
            this.roles.forEach(function (role) { return _this.rolesForm.get(role.role_id).enable(); });
        }
        // Force validation of roles to sync. 
        this.roles.forEach(function (role) {
            _this.rolesForm.get(role.role_id).updateValueAndValidity();
        });
    };
    Object.defineProperty(CreateUserComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.userForm.controls; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CreateUserComponent.prototype, "roleControls", {
        get: function () { return this.rolesForm.controls; },
        enumerable: true,
        configurable: true
    });
    CreateUserComponent.prototype.formToUser = function () {
        var user = new _model_model_user__WEBPACK_IMPORTED_MODULE_3__["User"]();
        user.id = null;
        user.token = null;
        user.username = this.f.username.value;
        user.name = this.f.firstName.value;
        user.surname = this.f.lastName.value;
        user.password = this.f.password.value;
        return user;
    };
    CreateUserComponent.prototype.addRoles = function (user) {
        this.roles.forEach(function (role) {
            if (role.selected) {
                user.roles.push(role.role_id);
            }
        });
    };
    CreateUserComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // Validade confirmPassowrd before submit.
        this.f.confirmPassword.updateValueAndValidity();
        // stop here if form is invalid   
        if (this.userForm.invalid) {
            return;
        }
        var user = this.formToUser();
        this.addRoles(user);
        this.userService.createUser(user).subscribe(function (wasCreated) {
            if (wasCreated) {
                _this.notificationService.showSuccessMessage("User " + user.username + " was created.");
            }
            else {
                console.log("Fail.");
                _this.notificationService.showWarningMessage("Fail to create user. Check if this username already exists.");
            }
        }, function (error) {
            console.log(error);
            _this.notificationService.showErrorMessage(error.error.message);
        });
    };
    CreateUserComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-create-user',
            template: __webpack_require__(/*! ./create-user.component.html */ "./src/app/components/user/create-user/create-user.component.html"),
            styles: [__webpack_require__(/*! ./create-user.component.css */ "./src/app/components/user/create-user/create-user.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"], _services_user_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"], _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_5__["NotificationService"]])
    ], CreateUserComponent);
    return CreateUserComponent;
}());



/***/ }),

/***/ "./src/app/components/user/user-edit/user-edit.component.css":
/*!*******************************************************************!*\
  !*** ./src/app/components/user/user-edit/user-edit.component.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvdXNlci91c2VyLWVkaXQvdXNlci1lZGl0LmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/components/user/user-edit/user-edit.component.html":
/*!********************************************************************!*\
  !*** ./src/app/components/user/user-edit/user-edit.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" *ngIf=\"userForm\">\n  <div class=\"row\">\n    <div class=\"col-md-6 offset-md-3\">\n      <h2>Update the user {{user.username}}</h2>\n      <form [formGroup]=\"userForm\"  (ngSubmit)=\"onSubmit()\">\n        <div class=\"form-group\">\n            <label>First Name</label>\n            <input type=\"text\" formControlName=\"firstName\" class=\"form-control\" \n              [ngClass]=\"{ 'is-invalid': submitted && f.firstName.errors }\" \n              placeholder=\"First name\" />\n            <div class=\"invalid-feedback\">First Name is required</div>\n        </div>\n        <div class=\"form-group\">\n            <label>Last Name</label>\n            <input type=\"text\" formControlName=\"lastName\" class=\"form-control\" \n              [ngClass]=\"{ 'is-invalid': submitted && f.lastName.errors }\"\n              placeholder=\"Last name\" />\n            <div class=\"invalid-feedback\">Last Name is required.</div>\n        </div>\n        <div class=\"form-group\">\n          <label>Username</label>\n          <input type=\"text\" formControlName=\"username\" class=\"form-control\" \n            [ngClass]=\"{ 'is-invalid': submitted && f.username.errors }\"\n            autocomplete=\"off\"/>\n          <div *ngIf=\"submitted && f.username.errors\" class=\"invalid-feedback\">\n            <div *ngIf=\"f.username.errors.required\">Username is required.</div>\n            <div *ngIf=\"f.username.errors.isTaken\">This username already exists.</div>\n          </div>\n        </div>\n        <tabset>\n          <!--Rollen Tab-->\n          <tab heading=\"Roles\" id=\"roleTab\">\n            <div class=\"form-group\" formGroupName=\"roles\">\n                <div class=\"form-check\">\n                  <div *ngFor=\"let role of roles\">\n                    <input type=\"checkbox\" formControlName=\"{{role.role_id}}\" id=\"{{role.role_id}}\" class=\"form-check-input\" \n                    [ngClass]=\"{ 'is-invalid': submitted && rolesForm.get(role.role_id).errors }\"\n                    [checked]=\"role.selected\" (change)=\"onToogleRole(role)\"/>\n                    <label class=\"form-check-label\" for=\"{{role.role_id}}\">\n                      {{role.label}}\n                    </label>\n                    <div class=\"invalid-feedback\">\n                      <div>You must select at least one role.</div>\n                    </div>\n                  </div>\n                </div>\n            </div>\n          </tab>\n          <!--Rechte \n          <tab heading=\"Rights\" id=\"rightTab\">\n            <div class=\"form-group mt-3\">\n              <div class=\"col-sm-10\">\n                <div class=\"form-check\">\n                  <div *ngFor=\"let right of rights\">\n                    <input class=\"form-check-input\" id=\"{{right.authority}}\" type=\"checkbox\" \n                    [checked]=\"right.selected\" (change)=\"right.selected = !right.selected\" \n                    [disabled]=\"right.containedInRole\">\n                    <label class=\"form-check-label\" for=\"{{right.authority}}\">\n                      {{right.label}}\n                    </label>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </tab> Tab-->\n        </tabset>\n        <div class=\"form-group\">\n            <button [disabled]=\"userForm.pending\" class=\"btn btn-primary\">Save</button>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/components/user/user-edit/user-edit.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/components/user/user-edit/user-edit.component.ts ***!
  \******************************************************************/
/*! exports provided: UserEditComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserEditComponent", function() { return UserEditComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../services/notification/notification.service */ "./src/app/services/notification/notification.service.ts");
/* harmony import */ var _services_user_user_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../services/user/user.service */ "./src/app/services/user/user.service.ts");
/* harmony import */ var _statics_form_validators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../statics/form-validators */ "./src/app/statics/form-validators.ts");








var UserEditComponent = /** @class */ (function () {
    function UserEditComponent(route, router, formBuilder, notificationService, userService) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.formBuilder = formBuilder;
        this.notificationService = notificationService;
        this.userService = userService;
        this.submitted = false;
        this.roles = [];
        this.route.params.subscribe(function (params) {
            if (params && params.id) {
                Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["forkJoin"])(_this.userService.get(params.id), _this.userService.getRoles()).subscribe(function (data) {
                    _this.user = data[0];
                    _this.roles = data[1];
                    _this.buildForm(_this.user);
                }, function (error) {
                    _this.notificationService.showErrorMessage(error.message);
                    console.log(error);
                });
            }
        }, function (error) {
            console.log(error);
        });
    }
    UserEditComponent.prototype.ngOnInit = function () {
    };
    UserEditComponent.prototype.buildForm = function (user) {
        var roleForm = {};
        for (var _i = 0, _a = this.roles; _i < _a.length; _i++) {
            var role = _a[_i];
            if (this.user.roles.includes(role.role_id)) {
                role.selected = true;
            }
            roleForm[role.role_id] = ['', { validators: [_statics_form_validators__WEBPACK_IMPORTED_MODULE_7__["UserValidador"].validateRoles(this.roles)], updateOn: 'change' }];
        }
        this.userForm = this.formBuilder.group({
            username: [this.user.username, { validators: [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required], asyncValidators: [_statics_form_validators__WEBPACK_IMPORTED_MODULE_7__["UserValidador"].validateUsername(this.userService, 500, [this.user.username])], updateOn: 'change' }],
            firstName: [user.name, { validators: _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, updateOn: 'change' }],
            lastName: [user.surname, { validators: _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, updateOn: 'change' }],
            roles: this.formBuilder.group(roleForm)
        });
    };
    Object.defineProperty(UserEditComponent.prototype, "f", {
        get: function () { return this.userForm.controls; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UserEditComponent.prototype, "rolesForm", {
        get: function () { return this.userForm.get("roles"); },
        enumerable: true,
        configurable: true
    });
    UserEditComponent.prototype.onToogleRole = function (role) {
        var _this = this;
        role.selected = !role.selected;
        if (role.role_id == "ROLE_ADMIN" && role.selected) {
            this.roles.forEach(function (role) {
                if (role.role_id != "ROLE_ADMIN") {
                    _this.rolesForm.get(role.role_id).disable();
                }
                role.selected = true;
            });
        }
        else if (role.role_id == "ROLE_ADMIN" && !role.selected) {
            this.roles.forEach(function (role) { return _this.rolesForm.get(role.role_id).enable(); });
        }
        // Force validation of roles to sync. 
        this.roles.forEach(function (role) {
            _this.rolesForm.get(role.role_id).updateValueAndValidity();
        });
    };
    UserEditComponent.prototype.formToUser = function () {
        this.user.username = this.f.username.value;
        this.user.name = this.f.firstName.value;
        this.user.surname = this.f.lastName.value;
        return this.user;
    };
    UserEditComponent.prototype.updateRoles = function (user) {
        // Clean roles
        user.roles = [];
        // Add selected
        this.roles.forEach(function (role) {
            if (role.selected) {
                user.roles.push(role.role_id);
            }
        });
    };
    UserEditComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.userForm.invalid) {
            return;
        }
        var user = this.formToUser();
        this.updateRoles(user);
        this.userService.updateUser(user).subscribe(function (wasUpdate) {
            if (wasUpdate) {
                _this.notificationService.showSuccessMessage("User was update.");
                _this.router.navigate(["/user/users"]);
            }
            else {
                _this.notificationService.showErrorMessage("Fail to update user.");
            }
        }, function (error) {
            console.log(error);
            _this.notificationService.showErrorMessage(error.message);
        });
    };
    UserEditComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-user-edit',
            template: __webpack_require__(/*! ./user-edit.component.html */ "./src/app/components/user/user-edit/user-edit.component.html"),
            styles: [__webpack_require__(/*! ./user-edit.component.css */ "./src/app/components/user/user-edit/user-edit.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"],
            _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_5__["NotificationService"], _services_user_user_service__WEBPACK_IMPORTED_MODULE_6__["UserService"]])
    ], UserEditComponent);
    return UserEditComponent;
}());



/***/ }),

/***/ "./src/app/components/user/user-list/user-list.component.css":
/*!*******************************************************************!*\
  !*** ./src/app/components/user/user-list/user-list.component.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvdXNlci91c2VyLWxpc3QvdXNlci1saXN0LmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/components/user/user-list/user-list.component.html":
/*!********************************************************************!*\
  !*** ./src/app/components/user/user-list/user-list.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"page-header\">\n  <h3 style=\"font-weight: bold; text-align: center; padding-bottom: 1%;\">Users</h3>\n</div>\n<div class=\"pull-left\">\n  <a routerLink=\"/user/createUser\" class=\"btn btn-default\" *ngIf=\"hasRole('ROLE_ADMIN')\" title=\"Create a new user\">\n    <span class=\"fa fa-user-plus icon-big icon-link\"></span>\n  </a>\n</div>\n<div class=\"d-flex justify-content-start navbar\" id=\"header\">\n  <div class=\"form-inline\">\n    <input [(ngModel)]=\"searchUsername\"\n      [typeahead]=\"dataSource\"\n      (typeaheadLoading)=\"changeTypeaheadLoading($event)\"\n      (typeaheadOnSelect)=\"typeaheadOnSelect($event)\"\n      [typeaheadOptionsLimit]=\"10\"\n      typeaheadWaitMs=\"500\"\n      typeaheadOptionField=\"username\"\n      placeholder=\"Username\"\n      class=\"form-control mr-sm-2\">\n    <button class=\"btn btn-outline-dark my-2 my-sm-0\" type=\"submit\"\n      (click)=\"searchUsers(searchUsername,'username')\" [disabled]=\"typeaheadLoading\">\n        <span *ngIf=\"typeaheadLoading\" class=\"fa fa-spinner fa-spin\"></span>\n        <span *ngIf=\"!typeaheadLoading\" class=\"fa fa-search\"></span>\n    </button>\n  </div>\n</div>\n<table class=\"table table-striped table-hover table-condensed\">\n  <thead>\n    <tr>\n      <th>Username</th>\n      <th>Role</th>\n      <th>Name</th>\n      <th></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr *ngFor=\"let user of users\">\n      <td>{{user.username}}</td>\n      <td>\n        <i class=\"fa fa-cogs icon-medium\" *ngIf=\"userHasRole(user, 'ROLE_ADMIN')\" title=\"Admin\"></i>\n        <i class=\"fa fa-user icon-medium\" *ngIf=\"userHasRole(user, 'ROLE_USER') && !userHasRole(user, 'ROLE_ADMIN')\" title=\"User\"></i>\n      </td>\n      <td>{{user.name}} {{user.surname}}</td>\n      <td>\n        <div class=\"pull-right\">\n          <a routerLink=\"/user/edit/{{user.id}}\" class=\"btn btn-xs btn-default\" *ngIf=\"hasRole('ROLE_ADMIN')\" title=\"edit\">\n            <span class=\"fa fa-pencil icon-medium\"></span>\n          </a>\n          <button (click)=\"openDeleteModal(deleteModalTemplate, user)\" class=\"btn btn-xs btn-default\" \n            *ngIf=\"hasRole('ROLE_ADMIN')\" title=\"delete\" [disabled]=\"isCurrentUser(user)\">\n            <span class=\"fa fa-trash-o icon-medium\"></span>\n          </button>\n        </div>\n      </td>\n    </tr>\n  </tbody>\n</table>\n<ng-template [ngTemplateOutlet]=\"pagination\"></ng-template>\n\n<!-- Modal temples -->\n<ng-template #deleteModalTemplate let-c=\"close\" let-d=\"dismiss\">\n  <div class=\"modal-header\">\n    <h4 class=\"modal-title\">Delete user {{deleteUser?.username}}</h4>\n  </div>\n  <div class=\"modal-body\">\n    <p>Are you sure you want to delete this user?</p>\n  </div>\n  <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-outline-dark\" (click)=\"deleteUserFromModal()\">Delete</button>\n    <button type=\"button\" class=\"btn btn-outline-dark\" (click)=\"closeDeleteModal()\">Cancel</button>\n  </div>\n</ng-template>\n\n<ng-template #pagination>\n    <div class=\"d-flex justify-content-end\">\n        <div class=\"p-2\">\n            <div class=\"btn-group\" dropdown style=\"padding-right: 10px;\">\n                <button id=\"button-basic\" dropdownToggle type=\"button\" class=\"btn btn-dark dropdown-toggle\"\n                aria-controls=\"dropdown-basic\">\n                {{itemsPerPage}} <span class=\"caret\"></span>\n                </button>\n                <ul id=\"dropdown-basic\" *dropdownMenu class=\"dropdown-menu\"\n                role=\"menu\" aria-labelledby=\"button-basic\">\n                <li role=\"menuitem\"><button class=\"dropdown-item\" (click)=\"itemsPerPageChanged(10)\">10</button></li>\n                <li role=\"menuitem\"><button class=\"dropdown-item\" (click)=\"itemsPerPageChanged(20)\">20</button></li>\n                <li role=\"menuitem\"><button class=\"dropdown-item\" (click)=\"itemsPerPageChanged(50)\">50</button></li>\n                <li role=\"menuitem\"><button class=\"dropdown-item\" (click)=\"itemsPerPageChanged(100)\">100</button></li>\n                </ul>\n            </div>\n            </div>\n        <div class=\"p-2\">\n            <pagination [totalItems]=\"totalItems\" [(ngModel)]=\"page\" [itemsPerPage]=\"itemsPerPage\"\n            (pageChanged)=\"pageChanged($event)\" [maxSize]=5\n            [boundaryLinks]=\"true\" previousText=\"&lsaquo;\" nextText=\"&rsaquo;\" firstText=\"&laquo;\"\n            lastText=\"&raquo;\">\n            </pagination>\n        </div>\n    </div>\n</ng-template>\n"

/***/ }),

/***/ "./src/app/components/user/user-list/user-list.component.ts":
/*!******************************************************************!*\
  !*** ./src/app/components/user/user-list/user-list.component.ts ***!
  \******************************************************************/
/*! exports provided: UserListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserListComponent", function() { return UserListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/fesm5/ngx-bootstrap-modal.js");
/* harmony import */ var _services_user_user_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../services/user/user.service */ "./src/app/services/user/user.service.ts");
/* harmony import */ var _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../services/notification/notification.service */ "./src/app/services/notification/notification.service.ts");
/* harmony import */ var _component_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../component.utils */ "./src/app/components/component.utils.ts");
/* harmony import */ var _model_model_search__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../model/model.search */ "./src/app/model/model.search.ts");










var UserListComponent = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](UserListComponent, _super);
    function UserListComponent(userService, notificationService, modalService) {
        var _this = _super.call(this, notificationService) || this;
        _this.userService = userService;
        _this.notificationService = notificationService;
        _this.modalService = modalService;
        _this.users = [];
        _this.page = 1;
        _this.itemsPerPage = 10;
        _this.totalItems = 0;
        _this.searchUsers();
        // Search for user
        _this.dataSource = rxjs__WEBPACK_IMPORTED_MODULE_3__["Observable"].create(function (observer) {
            // Runs on every search
            observer.next(_this.searchUsername);
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function (term) { return _this.userService.search(_this.buildQueryParams(term))
            .pipe(
        // Map search result observable to result list.
        Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (data) {
            return data.result;
        })); }));
        return _this;
    }
    UserListComponent.prototype.ngOnInit = function () {
    };
    UserListComponent.prototype.buildQueryParams = function (username, orderBy) {
        if (username === void 0) { username = ""; }
        if (orderBy === void 0) { orderBy = ""; }
        var searchParms = new _model_model_search__WEBPACK_IMPORTED_MODULE_9__["Search"]("username", username).searchParms;
        searchParms.orderBy = orderBy;
        searchParms.orderDesc = false;
        searchParms.page = this.page;
        searchParms.perPage = this.itemsPerPage;
        return new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]({ fromObject: searchParms });
    };
    UserListComponent.prototype.isCurrentUser = function (user) {
        return this.currentUser.username == user.username;
    };
    UserListComponent.prototype.openDeleteModal = function (template, user) {
        this.deleteModalRef = this.modalService.show(template);
        this.deleteUser = user;
    };
    UserListComponent.prototype.closeDeleteModal = function () {
        this.deleteModalRef.hide();
        this.deleteModalRef = null;
    };
    UserListComponent.prototype.removeUserFromList = function () {
        if (this.deleteUser) {
            var index = this.users.indexOf(this.deleteUser);
            if (index > -1) {
                this.users.splice(index, 1);
            }
        }
    };
    UserListComponent.prototype.deleteUserFromModal = function () {
        var _this = this;
        this.userService.deleteUser(this.deleteUser).subscribe(function (wasDeleted) {
            if (wasDeleted) {
                _this.notificationService.showSuccessMessage("User " + _this.deleteUser.username + " has been deleted.");
                _this.removeUserFromList();
            }
            else {
                _this.notificationService.showWarningMessage("Fail to delete user " + _this.deleteUser.username + ".");
            }
            _this.deleteUser = null;
            _this.closeDeleteModal();
        }, function (error) {
            console.log(error);
            _this.notificationService.showErrorMessage(error.error.message);
            _this.closeDeleteModal();
        });
    };
    UserListComponent.prototype.pageChanged = function (event) {
        this.page = event.page;
        this.searchUsers();
    };
    UserListComponent.prototype.itemsPerPageChanged = function (itemsPerPage) {
        this.itemsPerPage = itemsPerPage;
        this.page = 1;
        this.searchUsers();
    };
    UserListComponent.prototype.changeTypeaheadLoading = function (e) {
        this.typeaheadLoading = e;
    };
    UserListComponent.prototype.typeaheadOnSelect = function (e) {
        this.searchUsers(e.value, "username");
    };
    UserListComponent.prototype.searchUsers = function (username, orderBy) {
        var _this = this;
        if (username === void 0) { username = ""; }
        if (orderBy === void 0) { orderBy = "username"; }
        this.userService.search(this.buildQueryParams(username, orderBy)).subscribe(function (data) {
            _this.totalItems = data.total;
            _this.users = data.result;
        }, function (error) {
            console.log(error);
            _this.notificationService.showErrorMessage(error.message);
        });
    };
    UserListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-user-list',
            template: __webpack_require__(/*! ./user-list.component.html */ "./src/app/components/user/user-list/user-list.component.html"),
            styles: [__webpack_require__(/*! ./user-list.component.css */ "./src/app/components/user/user-list/user-list.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_services_user_user_service__WEBPACK_IMPORTED_MODULE_6__["UserService"], _services_notification_notification_service__WEBPACK_IMPORTED_MODULE_7__["NotificationService"], ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__["BsModalService"]])
    ], UserListComponent);
    return UserListComponent;
}(_component_utils__WEBPACK_IMPORTED_MODULE_8__["ComponentUtils"]));



/***/ }),

/***/ "./src/app/interceptors/token.interceptor.ts":
/*!***************************************************!*\
  !*** ./src/app/interceptors/token.interceptor.ts ***!
  \***************************************************/
/*! exports provided: TokenInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TokenInterceptor", function() { return TokenInterceptor; });
/* harmony import */ var _statics_local_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../statics/local-storage */ "./src/app/statics/local-storage.ts");

var TokenInterceptor = /** @class */ (function () {
    function TokenInterceptor() {
    }
    TokenInterceptor.prototype.intercept = function (req, next) {
        var currentUser = _statics_local_storage__WEBPACK_IMPORTED_MODULE_0__["LocalStorage"].currentUser;
        if (currentUser) {
            // // Clone the request to add the new header
            // const clonedRequest = req.clone({
            //   headers: req.headers.set('X-Access-Token', currentUser.token)
            // });
            // // Pass the cloned request instead of the original request to the next handle
            // return next.handle(clonedRequest);
            // return next.handle(req.clone({ setHeaders: { 'X-Access-Token': currentUser.token } }));
            return next.handle(req.clone({ setHeaders: { 'X-Access-Token': currentUser.token } }));
        }
        else {
            return next.handle(req);
        }
    };
    return TokenInterceptor;
}());



/***/ }),

/***/ "./src/app/model/model.search.ts":
/*!***************************************!*\
  !*** ./src/app/model/model.search.ts ***!
  \***************************************/
/*! exports provided: Search */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Search", function() { return Search; });
var Search = /** @class */ (function () {
    function Search(searchBy, value) {
        this.searchParms = {
            "searchBy": "",
            "searchValue": "",
            "orderBy": "",
            "orderDesc": null,
            "page": null,
            "perPage": null
        };
        this.searchParms.searchBy = searchBy;
        this.searchParms.searchValue = value;
        this.searchParms.orderDesc = false;
        this.searchParms.page = 1;
        this.searchParms.perPage = 10;
    }
    return Search;
}());



/***/ }),

/***/ "./src/app/model/model.user.ts":
/*!*************************************!*\
  !*** ./src/app/model/model.user.ts ***!
  \*************************************/
/*! exports provided: User */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
var User = /** @class */ (function () {
    function User() {
        this.username = '';
        this.surname = '';
        this.name = '';
        this.password = '';
        this.enabled = true;
        this.accountNonExpired = true;
        this.accountNonLocked = true;
        this.credentialsNonExpired = true;
        this.roles = [];
        this.rights = [];
        this.settings = [];
    }
    return User;
}());



/***/ }),

/***/ "./src/app/services/auth/auth.service.ts":
/*!***********************************************!*\
  !*** ./src/app/services/auth/auth.service.ts ***!
  \***********************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _statics_server_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../statics/server-url */ "./src/app/statics/server-url.ts");




var AuthService = /** @class */ (function () {
    function AuthService(http) {
        this.http = http;
    }
    AuthService.prototype.login = function (user) {
        // creating base64 encoded String from user name and password
        // const base64Credential: string = btoa(user.username + ':' + user.password);
        var httpOptions = {
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
                'Accept': 'application/json',
                /*'Authorization':  'Basic ' + base64Credential,*/
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })
        };
        var loginForm = 'username=' + user.username + '&password=' + user.password;
        return this.http.post(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/login', loginForm, httpOptions);
    };
    AuthService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/services/notification/notification.service.ts":
/*!***************************************************************!*\
  !*** ./src/app/services/notification/notification.service.ts ***!
  \***************************************************************/
/*! exports provided: NotificationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotificationService", function() { return NotificationService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var NotificationService = /** @class */ (function () {
    function NotificationService() {
        this.successMessageSource = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.successMessage$ = this.successMessageSource.asObservable();
        this.warningMessageSource = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.warningMessage$ = this.warningMessageSource.asObservable();
        this.errorMessageSource = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this.errorMessage$ = this.errorMessageSource.asObservable();
    }
    NotificationService.prototype.showSuccessMessage = function (message) {
        this.successMessageSource.next(message);
    };
    NotificationService.prototype.showWarningMessage = function (message) {
        this.warningMessageSource.next(message);
    };
    NotificationService.prototype.showErrorMessage = function (message) {
        this.errorMessageSource.next(message);
    };
    NotificationService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], NotificationService);
    return NotificationService;
}());



/***/ }),

/***/ "./src/app/services/user/user.service.ts":
/*!***********************************************!*\
  !*** ./src/app/services/user/user.service.ts ***!
  \***********************************************/
/*! exports provided: UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _statics_server_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../statics/server-url */ "./src/app/statics/server-url.ts");




var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.get = function (id) {
        return this.http.get(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/' + id);
    };
    UserService.prototype.getAll = function () {
        return this.http.get(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/all');
    };
    UserService.prototype.search = function (params) {
        return this.http.get(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/search', { params: params });
    };
    UserService.prototype.getByUsername = function (username) {
        return this.http.get(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/username/' + username);
    };
    UserService.prototype.createUser = function (user) {
        return this.http.post(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/create', user);
    };
    UserService.prototype.updateUser = function (user) {
        return this.http.post(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/update', user);
    };
    UserService.prototype.selfUpdate = function (user) {
        return this.http.post(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/userSelfUpdate', user);
    };
    UserService.prototype.getRoles = function () {
        return this.http.get(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/roles');
    };
    UserService.prototype.isUsernameTaken = function (username) {
        return this.http.get(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/isTaken/' + username);
    };
    UserService.prototype.deleteUser = function (user) {
        return this.http.delete(_statics_server_url__WEBPACK_IMPORTED_MODULE_3__["ServerUrl"].rootUrl + '/api/user/delete/' + user.id);
    };
    UserService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "./src/app/statics/form-validators.ts":
/*!********************************************!*\
  !*** ./src/app/statics/form-validators.ts ***!
  \********************************************/
/*! exports provided: AppValidador, UserValidador */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppValidador", function() { return AppValidador; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserValidador", function() { return UserValidador; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");




var AppValidador = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](AppValidador, _super);
    function AppValidador() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AppValidador.parentControlsValue = function (control, controlKey) {
        if (control != undefined && control.parent != undefined && control.parent.controls != undefined) {
            var parentControls = control.parent.controls;
            if (parentControls[controlKey] == undefined) {
                console.error("The key " + controlKey + " don't exists in this validator control.");
                return null;
            }
            return parentControls[controlKey].value;
        }
    };
    AppValidador.match = function (controlKey) {
        return function (control) {
            var valueToMatch = AppValidador.parentControlsValue(control, controlKey);
            if (control.value !== undefined && control.value != valueToMatch) {
                return { 'match': true };
            }
            return null;
        };
    };
    AppValidador.passwordMinLenght = 6;
    return AppValidador;
}(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"]));

var UserValidador = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](UserValidador, _super);
    function UserValidador() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserValidador.validateRoles = function (roles) {
        return function (control) {
            // console.log(control);
            for (var _i = 0, roles_1 = roles; _i < roles_1.length; _i++) {
                var role = roles_1[_i];
                if (role.selected) {
                    return null;
                }
            }
            return { 'notSelected': true };
        };
    };
    UserValidador.validateUsername = function (userService, time, blacklist) {
        if (time === void 0) { time = 500; }
        if (blacklist === void 0) { blacklist = []; }
        return function (control) {
            if (!control.valueChanges) {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
            }
            else {
                if (blacklist.includes(control.value)) {
                    return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["of"])(null);
                }
                return control.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(time), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(function () { return userService.isUsernameTaken(control.value); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (usernameIsTaken) {
                    return usernameIsTaken ? { 'isTaken': true } : null;
                }));
            }
        };
    };
    return UserValidador;
}(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"]));



/***/ }),

/***/ "./src/app/statics/local-storage.ts":
/*!******************************************!*\
  !*** ./src/app/statics/local-storage.ts ***!
  \******************************************/
/*! exports provided: LocalStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalStorage", function() { return LocalStorage; });
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
    }
    Object.defineProperty(LocalStorage, "currentUser", {
        get: function () {
            var currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return currentUser;
        },
        enumerable: true,
        configurable: true
    });
    LocalStorage.removeCurrentUser = function () {
        localStorage.removeItem('currentUser');
    };
    LocalStorage.saveCurrentUser = function (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    };
    return LocalStorage;
}());



/***/ }),

/***/ "./src/app/statics/server-url.ts":
/*!***************************************!*\
  !*** ./src/app/statics/server-url.ts ***!
  \***************************************/
/*! exports provided: ServerUrl */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerUrl", function() { return ServerUrl; });
var ServerUrl = /** @class */ (function () {
    function ServerUrl() {
    }
    Object.defineProperty(ServerUrl, "rootUrl", {
        get: function () {
            return this.API_URL;
        },
        enumerable: true,
        configurable: true
    });
    ServerUrl.API_URL = 'http://localhost:5000';
    return ServerUrl;
}());



/***/ }),

/***/ "./src/app/urlPermission/url.permission.ts":
/*!*************************************************!*\
  !*** ./src/app/urlPermission/url.permission.ts ***!
  \*************************************************/
/*! exports provided: LoginPermission, AdminPermission, SameUserPermission */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginPermission", function() { return LoginPermission; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminPermission", function() { return AdminPermission; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SameUserPermission", function() { return SameUserPermission; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _statics_local_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../statics/local-storage */ "./src/app/statics/local-storage.ts");




var LoginPermission = /** @class */ (function () {
    function LoginPermission(router) {
        this.router = router;
    }
    LoginPermission.prototype.canActivate = function (route, state) {
        if (_statics_local_storage__WEBPACK_IMPORTED_MODULE_3__["LocalStorage"].currentUser) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    };
    LoginPermission = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], LoginPermission);
    return LoginPermission;
}());

var AdminPermission = /** @class */ (function () {
    function AdminPermission(router) {
        this.router = router;
    }
    AdminPermission.prototype.canActivate = function (route, state) {
        if (_statics_local_storage__WEBPACK_IMPORTED_MODULE_3__["LocalStorage"].currentUser && _statics_local_storage__WEBPACK_IMPORTED_MODULE_3__["LocalStorage"].currentUser.roles.includes("ROLE_ADMIN")) {
            return true;
        }
        // Don't have admin role.
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
    };
    AdminPermission = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], AdminPermission);
    return AdminPermission;
}());

var SameUserPermission = /** @class */ (function () {
    function SameUserPermission(router) {
        this.router = router;
    }
    SameUserPermission.prototype.canActivate = function (route, state) {
        if (_statics_local_storage__WEBPACK_IMPORTED_MODULE_3__["LocalStorage"].currentUser) {
            if (route.params.id && route.params.id == _statics_local_storage__WEBPACK_IMPORTED_MODULE_3__["LocalStorage"].currentUser.id) {
                return true;
            }
            else if (route.params.username && route.params.username == _statics_local_storage__WEBPACK_IMPORTED_MODULE_3__["LocalStorage"].currentUser.username) {
                return true;
            }
            else {
                // Not the same user.
                this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
                return false;
            }
        }
    };
    SameUserPermission = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], SameUserPermission);
    return SameUserPermission;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /media/junqueira/DATA/webapp_projects/webapp_template/web-client/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map