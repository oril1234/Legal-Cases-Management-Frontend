// Sidebar route metadata
import { Roles } from '../../_models/roles.enum';
export interface RouteInfo
{
  path: string;
  title: string;
  icon: string;
  class: string;
  extralink: boolean;
  submenu: RouteInfo[];
  role: Roles[];
  params:string
  hasSub:boolean
}
