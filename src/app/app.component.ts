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
    currentIndex: number = (require('../assets/paints.json')).currentIndex;
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
            this.currentIndex = result.currentIndex;
        };
        const blob = new Blob([JSON.stringify({paints: this.paints, currentIndex: this.currentIndex})], { type: 'application/json' });
        this.jsonUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        console.log(event);
        if (event.charCode === 32) {
            this.isNextClicked();
        }
    }

    isActive(color: string): boolean {
        return this.paints[this.currentIndex].basicHues.includes(color);
    }

    isPreviousClicked(): void {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        }
    }

    isNextClicked(): void {
        if (this.currentIndex < this.paints.length - 1) {
            this.currentIndex++;
        }
    }

    isFileLoaded(event: any): void {
        this.reader.readAsText(event.target.files[0]);
    }

    isMetallicPaint(): boolean {
        return this.paints[this.currentIndex].types.includes('metallic');
    }

    changeBasicHues(color: string) {
        if (this.isActive(color)) {
            this.paints[this.currentIndex].basicHues = this.paints[this.currentIndex].basicHues.filter(bh => bh !== color);
        } else {
            this.paints[this.currentIndex].basicHues.push(color);
        }
        const blob = new Blob([JSON.stringify({paints: this.paints, currentIndex: this.currentIndex})], { type: 'application/json' });
        this.jsonUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
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

    capitalize(text: string): string {
        return text.slice(0, 1) + text.slice(1, text.length);
    }
}
