import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FloorComponent } from './floor/floor.component';
import { RoomtypeComponent } from './roomtype/roomtype.component';
import { RoomCreateComponent } from './room-create/room-create.component';
import { IdentificationComponent } from './identification/identification.component';
import { RoomRegistrationComponent, AddRoomDialog } from './room-registration/room-registration.component';
import { RoomSettlementComponent, AddcardDialog } from './room-settlement/room-settlement.component';

export const routes = [
  { path: 'floor', component: FloorComponent },
  { path: 'roomtype', component: RoomtypeComponent },
  { path: 'room', component: RoomCreateComponent },
  { path: 'identification', component: IdentificationComponent },
  { path: 'roomregister', component: RoomRegistrationComponent },
  { path: 'roomsettlement', component: RoomSettlementComponent },
];

@NgModule({
  declarations: [
    FloorComponent, RoomtypeComponent, RoomCreateComponent, IdentificationComponent,
     RoomRegistrationComponent,AddRoomDialog, RoomSettlementComponent,AddcardDialog],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents:[AddRoomDialog,AddcardDialog],
  exports: []
})

export class BookingsModule { }