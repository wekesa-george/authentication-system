import * as Icons from "./icons.js";

import type { Icon } from "lucide-svelte";
import type { ComponentType } from "svelte";

export type Route = {
	title: string;
	label: string;
	href: string,
	icon: ComponentType<Icon>;
	variant: "default" | "ghost";
	separate: boolean;
	hasChildren: boolean;
	expanded: boolean;
	children:any[]
};

export const primaryRoutes: Route[] = [
	{
		title: "Dashboard",
		label: "",
		href:'/app/home',
		icon: Icons.Dashboard,
		variant: "default",
		separate:false,
		hasChildren: false,
		expanded:false,
		children:[]
		
	},
	{
		title: "Loans",
		label: "",
		href:'/app/loans/new-loan',
		icon: Icons.Loans,
		variant: "ghost",
		separate:false,
		hasChildren: true,
		expanded:false,
		children:[{
			title:"Add New Loan",
			href:'/app/loans/new-loan',
			active: false
		},{
			title:"Active Portifolio",
			active: false,
			href:'/app/loans/active-portifolio'
		},{
			title:"Due Loans",
			active: false,
			href:'/app/loans/due'
		},{
			title:"Overdue Loans",
			active: false,
			href:'/app/loans/arrears'
		}]
	},
	{
		title: "Collections",
		label: "",
		href:'/app/collections/post-single-payment',
		icon: Icons.Pay,
		variant: "ghost",
		separate:false,
		hasChildren: true,
		expanded:false,
		children:[{
			title:"Post Single Repayment",
			active: false,
			href:'/app/collections/post-single-payment'
		},{
			title:"Post Multiple Repayments",
			active: false,
			href:'/app/collections/post-multiple-payments'
		}]
	},
	{
		title: "Collateral Register",
		label: "",
		href:'/app/collateral-register',
		icon: Icons.Archive,
		variant: "ghost",
		separate:false,
		hasChildren: false,
		expanded:false,
		children:[]
	},
	{
		title: "Clients",
		label: "",
		href:'/app/borrowers/new-borrower',
		icon: Icons.Users,
		variant: "ghost",
		separate:false,
		hasChildren: true,
		expanded:false,
		children:[{
			title:"Add new Client",
			active: false,
			href:'/app/borrowers/new-borrower'
		},{
			title:"View Clients",
			active: false,
			href:'/app/borrowers/all-borrowers'
		}]
	},
	{
		title: "Targets",
		label: "",
		href:'/app/targets',
		icon: Icons.CrossHair,
		variant: "ghost",
		separate:false,
		hasChildren: false,
		expanded:false,
		children:[]
	},
	{
		title: "Reports",
		label: "",
		href:'/app/reports/total-portifolio',
		icon: Icons.Reports,
		variant: "ghost",
		separate:false,
		hasChildren: true,
		expanded:false,
		children:[{
			title:"Total Portifolio",
			active: false,
			href:'/app/reports/total-portifolio'
		},{
			title:"Active Portifolio",
			active: false,
			href:'/app/reports/active-portifolio'
		},{
			title:"Loans Due",
			active: false,
			href:'/app/reports/loan-due'
		},{
			title:"Portifolio At Risk",
			active: false,
			href:'/app/reports/par'
		},{
			title:"Collections",
			active: false,
			href:'/app/reports/collections'
		},{
			title:"Finance Types",
			active: false,
			href:'/app/reports/products'
		},{
			title:"Deffered Income",
			active: false,
			href:'/app/reports/deffered-income'
		}]
	},
	{
		title: "Notifications",
		label: "2",
		href:'/app/notifications',
		icon: Icons.Bell,
		variant: "ghost",
		separate:true,
		hasChildren: false,
		expanded:false,
		children:[]
	}
];

export const secondaryRoutes: Route[] = [
	{
		title: "Loan Officers",
		label: "",
		href:'/app/loan-officers',
		icon: Icons.Users,
		variant: "ghost",
		separate:false,
		hasChildren: false,
		expanded:false,
		children:[]
	},
	{
		title: "Accounting",
		label: "",
		href:'/app/accounting',
		icon: Icons.Accounting,
		variant: "ghost",
		separate:false,
		hasChildren: false,
		expanded:false,
		children:[]
	},
	{
		title: "Configurations",
		label: "",
		href:'/app/configurations',
		icon: Icons.Settings,
		variant: "ghost",
		separate:false,
		hasChildren: false,
		expanded:false,
		children:[]
	},
	{
		title: "Account Settings",
		label: "",
		href:'/app/account-settings',
		icon: Icons.UserCog,
		variant: "ghost",
		separate:false,
		hasChildren: false,
		expanded:false,
		children:[]
	},
	{
		title: "User Management",
		label: "",
		href:'/app/user-management',
		icon: Icons.BookUser,
		variant: "ghost",
		separate:false,
		hasChildren: false,
		expanded:false,
		children:[]
	},
];