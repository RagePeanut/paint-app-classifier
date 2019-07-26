declare var require: any;

import { Component, OnInit } from '@angular/core';
import * as fontColorContrast from 'font-color-contrast';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    objectKeys = Object.keys;
    paints: any[] = (require('../assets/paints.json')).paints;
    currentIndex: number = (require('../assets/paints.json')).currentIndex;
    colors = {
        beige: '#f5f5dc',
        black: '#000000',
        blue: '#0000ff',
        brown: '#a52a2a',
        flesh: '#d2b48c',
        green: '#008000',
        grey: '#808080',
        ivory: '#fffff0',
        orange: '#ffa500',
        pink: '#ffc0cb',
        purple: '#800080',
        red: '#ff0000',
        sand: '#f4a460',
        turquoise: '#40e0d0',
        white: '#ffffff',
        yellow: '#ffff00'
    };
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

    capitalize(text: string): string {
        return text.slice(0, 1) + text.slice(1, text.length);
    }
}
