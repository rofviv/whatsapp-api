import { PAGE_ROUTE } from "../constants/page_route";
import HomePage from "../pages/HomePage";

interface Route {
    path: string,
    component: React.ComponentType,
}

export const ROUTES: Route[] = [
    {
        path:PAGE_ROUTE.HOME,
        component: HomePage,
    }
]