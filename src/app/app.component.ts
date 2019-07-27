declare var require: any;

import { Component, OnInit, HostListener } from '@angular/core';
import * as fontColorContrast from 'font-color-contrast';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    paints: any[] = (require('../assets/paints.json')).paints;
    aside: any[] = (require('../assets/paints.json')).aside;
    currentIndex: any = (require('../assets/paints.json')).currentIndex;
    activeSide: string = (require('../assets/paints.json')).activeSide;
    colors = {
        beige: '#f5f5dc',
        black: '#000000',
        blue: '#0000ff',
        brass: '#b5a642',
        bronze: '#b08d57',
        brown: '#a52a2a',
        copper: '#b87333',
        flesh: '#d2b48c',
        gold: '#ffd700',
        green: '#008000',
        grey: '#808080',
        ivory: '#fffff0',
        orange: '#ffa500',
        pink: '#ffc0cb',
        purple: '#800080',
        red: '#ff0000',
        sand: '#f4a460',
        silver: '#c0c0c0',
        steel: '#8f908f',
        turquoise: '#40e0d0',
        white: '#ffffff',
        yellow: '#ffff00'
    };
    metalColors = ['brass', 'bronze', 'copper', 'gold', 'silver', 'steel'];
    reader: any;
    jsonUrl: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this.reader = new FileReader();
        this.reader.onload = () => {
            const result = JSON.parse(this.reader.result);
            this.paints = result.paints;
            this.aside = result.aside;
            this.currentIndex = result.currentIndex;
            this.activeSide = result.activeSide;
            this.createBlob();
        };
        this.createBlob();
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.charCode === 32) {
            this.isNextClicked();
        }
    }

    createBlob(): void {
        // tslint:disable-next-line:max-line-length
        const blob = new Blob([JSON.stringify({paints: this.paints, aside: this.aside, currentIndex: this.currentIndex, activeSide: this.activeSide})], { type: 'application/json' });
        this.jsonUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    }

    isActive(color: string): boolean {
        return this.getActivePaint().basicHues.includes(color);
    }

    isPreviousClicked(): void {
        if (this.currentIndex[this.activeSide] > 0) {
            this.currentIndex[this.activeSide]--;
        }
        this.createBlob();
    }

    isNextClicked(): void {
        if (this.currentIndex[this.activeSide] < this[this.activeSide].length - 1) {
            this.currentIndex[this.activeSide]++;
        }
        this.createBlob();
    }

    isAsideClicked(): void {
        this[this.activeSide === 'paints' ? 'aside' : 'paints'].push(this.getActivePaint());
        this[this.activeSide] = this[this.activeSide].filter(p => p.id !== this.getActivePaint().id);
        if (this.currentIndex[this.activeSide] >= this[this.activeSide].length) {
            if (this.currentIndex[this.activeSide] === 0) {
                this.isSideClicked();
            } else {
                this.isPreviousClicked();
            }
        } else {
            this.createBlob();
        }
    }

    isSideClicked(): void {
        this.activeSide = this.activeSide === 'paints' ? 'aside' : 'paints';
        this.createBlob();
    }

    isFileLoaded(event: any): void {
        this.reader.readAsText(event.target.files[0]);
    }

    isMetallicPaint(): boolean {
        return this.getActivePaint().types.includes('metallic');
    }

    changeBasicHues(color: string) {
        if (this.isActive(color)) {
            // tslint:disable-next-line:max-line-length
            this[this.activeSide][this.currentIndex[this.activeSide]].basicHues = this.getActivePaint().basicHues.filter(bh => bh !== color);
        } else {
            this[this.activeSide][this.currentIndex[this.activeSide]].basicHues.push(color);
        }
        this.createBlob();
    }

    getTextColor(background: string): string {
        return fontColorContrast(background);
    }

    getColors(type: string): string[] {
        if (type === 'normal') {
            return Object.keys(this.colors).filter(color => !this.metalColors.includes(color));
        }
        return Object.keys(this.colors).filter(color => this.metalColors.includes(color));
    }

    getActivePaint(): any {
        return this[this.activeSide][this.currentIndex[this.activeSide]];
    }

    capitalize(text: string): string {
        return text.slice(0, 1) + text.slice(1, text.length);
    }
}
