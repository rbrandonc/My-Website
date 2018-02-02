import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'projects',
	templateUrl: './projects.component.html',
	styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
	projects = require('../../assets/projects.json');
	colors = require('../../assets/colors.json').colors;

	constructor() { }

	ngOnInit() {
	}

}
