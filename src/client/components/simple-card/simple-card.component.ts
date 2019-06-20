import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-simple-card',
    templateUrl: './simple-card.component.html'
})
export class SimpleCardComponent {
    @Input()
    public title: string;
}
