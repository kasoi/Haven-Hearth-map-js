import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ResourceMarker, AddMarkerInfo, MapMarker } from 'src/app/shared/interfaces';
import { MarkerType } from 'src/app/shared/enums/marker-type.enum';
import { MarkersService } from 'src/app/shared/services/markers.service';
import { MatSelectChange } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-object-dialog',
  templateUrl: './add-object-dialog.component.html',
  styleUrls: ['./add-object-dialog.component.scss']
})
export class AddObjectDialogComponent implements OnInit {

  typeControl: FormControl = new FormControl('test type', Validators.required);

  resourceTypes: ResourceMarker[] = [
    {type: MarkerType.Default, name: 'Default'},
    {type: MarkerType.Tree, name: 'Tree', icon: './assets/images/resources/select/tree.png'},
    {type: MarkerType.Clay, name: 'Clay'},
    {type: MarkerType.Water, name: 'Water'},
    {type: MarkerType.Animal, name: 'Animal'}];

  selectedResourceType: ResourceMarker = this.resourceTypes[0];
  selectedResourceTypeValue = this.selectedResourceType.name;

  resourceName = '';

  constructor(
    public dialogRef: MatDialogRef<AddObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddMarkerInfo,
    private markersService: MarkersService) { }

  ngOnInit(): void {
  }

  selectionChanged(event: MatSelectChange): void {
    this.selectedResourceTypeValue = event.value;

    const found = this.resourceTypes.find(resource => {
      if (resource.name === this.selectedResourceTypeValue) { return resource; }
    });

    this.selectedResourceType = found;
  }

  sendMarker(): void {
    const marker: MapMarker = {
      position: this.data.position,
      type: this.selectedResourceType.type,
      header: this.resourceName,
      text: null
    };

    this.markersService.addMarker(marker).subscribe(response => {
      // todo
    });

  }
}
