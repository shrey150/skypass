import { Component, ViewChild, OnInit, Renderer } from '@angular/core';

@Component({
  selector: 'accordion',
  templateUrl: 'accordion.html'
})
export class AccordionComponent implements OnInit {

	accordionExpanded = false;
	@ViewChild("cc") content : any;

	constructor(public renderer : Renderer) {

	}

	ngOnInit() {

		console.log(this.content.nativeElement);
		this.renderer.setElementStyle(this.content.nativeElement, "webkitTransition", "max-height 500ms, padding 500ms");

	}

	toggleAccordion() {

		if (this.accordionExpanded) {

			this.renderer.setElementStyle(this.content.nativeElement, "max-height", "0px");
			this.renderer.setElementStyle(this.content.nativeElement, "padding", "0px 16px");

		} else {

			this.renderer.setElementStyle(this.content.nativeElement, "max-height", "500px");
			this.renderer.setElementStyle(this.content.nativeElement, "padding", "13px 16px");

		}

		this.accordionExpanded = !this.accordionExpanded;

	}

}
