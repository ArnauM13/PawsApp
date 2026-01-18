import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/pets/pages/pets-home/pets-home.component').then(
        (m) => m.PetsHomeComponent
      )
  },
  {
    path: 'pet/:id',
    loadComponent: () =>
      import('./features/pets/pages/pet-detail/pet-detail.component').then(
        (m) => m.PetDetailComponent
      )
  }
];
