import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'menu',
    loadComponent: () => import('./features/dashboard/menu/menu.component').then(m => m.MenuComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin-menu',
    loadComponent: () => import('./features/dashboard/admin-menu/admin-menu.component').then(m => m.AdminMenuComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'accounts',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/accounts/account-list/account-list.component').then(m => m.AccountListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/accounts/account-view/account-view.component').then(m => m.AccountViewComponent)
      },
      {
        path: ':id/update',
        loadComponent: () => import('./features/accounts/account-update/account-update.component').then(m => m.AccountUpdateComponent),
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: 'cards',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/cards/card-list/card-list.component').then(m => m.CardListComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./features/cards/card-search/card-search.component').then(m => m.CardSearchComponent)
      },
      {
        path: ':id/update',
        loadComponent: () => import('./features/cards/card-update/card-update.component').then(m => m.CardUpdateComponent),
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: 'transactions',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/transactions/transaction-list/transaction-list.component').then(m => m.TransactionListComponent)
      },
      {
        path: 'add',
        loadComponent: () => import('./features/transactions/transaction-add/transaction-add.component').then(m => m.TransactionAddComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/transactions/transaction-detail/transaction-detail.component').then(m => m.TransactionDetailComponent)
      }
    ]
  },
  {
    path: 'users',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'add',
        loadComponent: () => import('./features/users/user-add/user-add.component').then(m => m.UserAddComponent)
      },
      {
        path: ':id/update',
        loadComponent: () => import('./features/users/user-update/user-update.component').then(m => m.UserUpdateComponent)
      },
      {
        path: ':id/delete',
        loadComponent: () => import('./features/users/user-delete/user-delete.component').then(m => m.UserDeleteComponent)
      }
    ]
  },
  {
    path: 'authorizations',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/authorizations/authorization-list/authorization-list.component').then(m => m.AuthorizationListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/authorizations/authorization-detail/authorization-detail.component').then(m => m.AuthorizationDetailComponent)
      }
    ]
  },
  {
    path: 'bill-payment',
    loadComponent: () => import('./features/bill-payment/bill-payment.component').then(m => m.BillPaymentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
