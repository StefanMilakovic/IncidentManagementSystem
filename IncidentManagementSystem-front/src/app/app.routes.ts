import { Routes } from '@angular/router';
import {Dashboard} from './pages/dashboard/dashboard';
import {Incidents} from './pages/incidents/incidents';
import {ModerationDashboard} from './pages/moderation-dashboard/moderation-dashboard';
import {
  MapViewWrapperComponent
} from './pages/moderation-dashboard/map-view-wrapper-component/map-view-wrapper-component';
import {ModerationComponent} from './pages/moderation-dashboard/moderation-component/moderation-component';
import {NoAccess} from './pages/no-access/no-access';
import {roleGuard} from './auth/role.guard';
import {authGuard} from './auth/auth.guard';
import {
  IncidentStatusHistoryComponent
} from './pages/moderation-dashboard/incident-status-history-component/incident-status-history-component';


export const routes: Routes = [
  {
    path: '',
    component: Dashboard
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'incidents',
    component: Incidents,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['USER'] }
  },

  {
    path: 'moderation-dashboard',
    component: ModerationDashboard,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MODERATOR'] },
    children: [
      {
        path: '',
        component: MapViewWrapperComponent
      },
      {
        path: 'map-view',
        component: MapViewWrapperComponent
      },
      {
        path: 'moderation',
        component: ModerationComponent
      },
      {
        path: 'history',
        component: IncidentStatusHistoryComponent
      },
    ]
  },

  {
    path: 'no-access',
    component: NoAccess
  },
  
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
