import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class DialogComponent {

  public json: string;

  constructor(
      @Inject(MAT_DIALOG_DATA) private data: any[]
  ) {
    this.json = JSON.stringify(this.data, null, 4);

    const graph  = this.data.reduce((a, b) => {
      a.CD1____KM_ += Math.ceil(b.properties.CD1____KM_);
      a.CD2____KM_ += Math.ceil(b.properties.CD2____KM_);
      a.CD3____KM_ += Math.ceil(b.properties.CD3____KM_);
      a.CD4____KM_ += Math.ceil(b.properties.CD4____KM_);

      return a;
    }, {
      CD1____KM_: 0,
      CD2____KM_: 0,
      CD3____KM_: 0,
      CD4____KM_: 0,
    });

    console.log(graph);
  }
}
