import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ShirtSize {
  size: string;
}

interface ControlDefaults {
  controlID: string;
  controlFirst: string;
  controlLast: string;
  controlSize: string;
  controlColour: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'A4patellirja';
  url = 'assets/data/A4Form.json';
  controlDefaults!: ControlDefaults;
  shirtSizes: ShirtSize[] = [];
  currentDate = new Date();
  patelLirjaForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>(this.url).subscribe(data => {
      this.controlDefaults = data.controlDefaults;
      this.shirtSizes = data.shirtSizes;

      this.patelLirjaForm = this.fb.group({
        id991738587: [this.controlDefaults.controlID],
        Lirja: [this.controlDefaults.controlFirst],
        patel: [this.controlDefaults.controlLast],
        patelLirjasize: [this.controlDefaults.controlSize],
        patelLirjacolour: [this.controlDefaults.controlColour],
        patelLirjainclude1: [false],
        patelLirjainclude2: [false],
        patelLirjadate: [this.currentDate]
      });
    });
  }

  onSubmit(): void {
    const formValues = this.patelLirjaForm.value;
    const inclusions = [];
    if (formValues.patelLirjainclude1) {
      inclusions.push('Name');
    }
    if (formValues.patelLirjainclude2) {
      inclusions.push('Logo');
    }
    const inclusionsText = inclusions.length > 0 ? inclusions.join(' and ') : 'No Inclusions';

    const output = `
      ${formValues.id991738587} / ${formValues.Lirja} ${formValues.patel}
      Ordered ${formValues.patelLirjasize} size shirt in colour ${formValues.patelLirjacolour}
      Includes: ${inclusionsText}
      Ordered: ${this.currentDate.toDateString()}
    `;

    const outputElement = document.querySelector('#output');
    if (outputElement) {
      outputElement.innerHTML = output;
    } else {
      console.error('Output element not found');
    }
  }
}
