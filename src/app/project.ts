import { Component, Input } from '@angular/core';
	import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'project',
  templateUrl: './project.html',
  styleUrls: ['./app.component.scss']
})

export class Project {
  @Input('project') project;
  @Input('color') color;
  title = 'project';

  constructor(private sanitizer : DomSanitizer) {
  }

  bgcolor : Function = () => {
    return this.color;
  };
}
