import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading',
    template: `
    <div class="spinner">
        <mat-progress-spinner color="primary" mode="indeterminate" diameter="20">
        </mat-progress-spinner>
    </div>
    <ng-content></ng-content>
    `,
    styles: [`:host {
        display: block;
        padding: 10px;
    }

    .spinner {
        display: inline-block;
        margin-right: 10px;
    }`]
})
export class LoadingComponent {
}
