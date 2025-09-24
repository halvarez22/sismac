import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { Routes, Route, Link, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';

// Import all types
import {
    User, Role, PurchaseOrder, PurchaseSuggestion, MaterialInventory, InventoryStatus,
    ProductionOrder, ProductModel
} from './types';

// Import page components
import Dashboard from './components/Dashboard';
import Abastecimiento from './components/Abastecimiento';
import Almacen from './components/Almacen';
import Planificacion from './components/Planificacion';
import Contabilidad from './components/Contabilidad';
import Ingenieria from './components/Ingenieria';
import Admin from './components/Admin';
import { Copilot } from './components/Copilot';

// --- MOCK DATA ---

const initialUsers: User[] = [
    { id: 1, displayName: 'Admin User', username: 'admin', password: 'password', role: 'Administrador', status: 'Activo', avatarUrl: 'https://picsum.photos/seed/admin/40/40' },
    { id: 2, displayName: 'Gerente Logistica', username: 'gerente', password: 'password', role: 'Gerente', status: 'Activo', avatarUrl: 'https://picsum.photos/seed/gerente/40/40' },
    { id: 3, displayName: 'Ana la Compradora', username: 'ana.c', password: 'password', role: 'Comprador', status: 'Activo', avatarUrl: 'https://picsum.photos/seed/anac/40/40' },
    { id: 4, displayName: 'Juan Almacenista', username: 'juan.a', password: 'password', role: 'Almacenista', status: 'Inactivo', avatarUrl: 'https://picsum.photos/seed/juana/40/40' },
    { id: 5, displayName: 'Javier Garcia', username: 'jgarcia', password: 'sismac123', role: 'Ingeniero de Producto', status: 'Activo', avatarUrl: 'https://picsum.photos/seed/jgarcia/40/40' },
    { id: 6, displayName: 'Planificador Maestro', username: 'plan', password: 'sismac123', role: 'Planificador', status: 'Activo', avatarUrl: 'https://picsum.photos/seed/plan/40/40' },
];

// Load from localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
};

// Save to localStorage
const saveToStorage = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

const calculateStatus = (quantity: number, reorderPoint: number): InventoryStatus => {
    if (reorderPoint <= 0) return 'OK';
    const ratio = quantity / reorderPoint;
    if (ratio <= 0.75) return 'Crítico';
    if (ratio <= 1.1) return 'Bajo';
    if (ratio >= 2.5) return 'Exceso';
    return 'OK';
};

const initialMaterialInventoryData: Omit<MaterialInventory, 'status'>[] = [
    { id: 'PN-N-001', name: 'Piel Nappa Negra', category: 'Pieles', quantity: 850, unit: 'm²', location: 'A-01-B', unitCost: 310, totalValue: 263500, reorderPoint: 400, lastMovementDate: '2024-07-26' },
    { id: 'PN-R-002', name: 'Piel Nappa Roja', category: 'Pieles', quantity: 210, unit: 'm²', location: 'A-01-C', unitCost: 300, totalValue: 63000, reorderPoint: 200, lastMovementDate: '2024-07-22' },
    { id: 'SH-T-501', name: 'Suela Hule TR Mod. 501', category: 'Suelas', quantity: 950, unit: 'pares', location: 'B-03-A', unitCost: 35, totalValue: 33250, reorderPoint: 1000, lastMovementDate: '2024-07-28' },
    { id: 'HD-03', name: 'Hebilla Dorada #HD-03', category: 'Herrajes', quantity: 8500, unit: 'pzas', location: 'C-11-D', unitCost: 4, totalValue: 34000, reorderPoint: 5000, lastMovementDate: '2024-07-25' },
    { id: 'FC-01', name: 'Forro de cerdo', category: 'Textiles', quantity: 450, unit: 'm²', location: 'A-02-A', unitCost: 30, totalValue: 13500, reorderPoint: 300, lastMovementDate: '2024-07-18' },
    { id: 'OM-01', name: 'Ojal Metálico #OM-01', category: 'Herrajes', quantity: 9800, unit: 'pzas', location: 'C-12-B', unitCost: 1.5, totalValue: 14700, reorderPoint: 10000, lastMovementDate: '2024-07-22' },
    { id: 'ADH-PU-05', name: 'Adhesivo Poliuretano 5L', category: 'Químicos', quantity: 50, unit: 'L', location: 'D-01-F', unitCost: 800, totalValue: 40000, reorderPoint: 40, lastMovementDate: '2024-07-29' },
    { id: 'SH-C-300', name: 'Suela Cuero Mod. 300', category: 'Suelas', quantity: 80, unit: 'pares', location: 'B-04-C', unitCost: 120, totalValue: 9600, reorderPoint: 150, lastMovementDate: '2024-07-27' },
    { id: 'CV-A-001', name: 'Cuero Vegano Azul', category: 'Pieles', quantity: 600, unit: 'm²', location: 'A-03-A', unitCost: 250, totalValue: 150000, reorderPoint: 200, lastMovementDate: '2024-04-15' },
];

const initialProductModels: ProductModel[] = [
    { id: 'MOD-ZAP-001', name: 'Zapato de Vestir "Elegance"', bom: [{ materialSku: 'PN-N-001', quantityPerUnit: 0.3 }, { materialSku: 'SH-T-501', quantityPerUnit: 1 }, { materialSku: 'FC-01', quantityPerUnit: 0.25 }] },
    { id: 'MOD-BOT-002', name: 'Botín Casual "Aventura"', bom: [{ materialSku: 'PN-R-002', quantityPerUnit: 0.4 }, { materialSku: 'SH-T-501', quantityPerUnit: 1 }, { materialSku: 'HD-03', quantityPerUnit: 2 }, { materialSku: 'OM-01', quantityPerUnit: 8 }] },
];

const initialProductionOrders: ProductionOrder[] = [
    { id: 'OP-5510', productModel: 'Zapato de Vestir "Elegance"', productModelId: 'MOD-ZAP-001', quantity: 500, requiredDate: '2024-08-15', status: 'En Progreso', materials: [ { sku: 'PN-N-001', name: 'Piel Nappa Negra', required: 150, unit: 'm²' }, { sku: 'SH-T-501', name: 'Suela Hule TR Mod. 501', required: 500, unit: 'pares' }, { sku: 'FC-01', name: 'Forro de cerdo', required: 125, unit: 'm²' } ] },
    { id: 'OP-5511', productModel: 'Botín Casual "Aventura"', productModelId: 'MOD-BOT-002', quantity: 200, requiredDate: '2024-08-20', status: 'Pendiente', suggestionStatus: 'generated', materials: [ { sku: 'PN-R-002', name: 'Piel Nappa Roja', required: 80, unit: 'm²' }, { sku: 'SH-T-501', name: 'Suela Hule TR Mod. 501', required: 200, unit: 'pares' }, { sku: 'HD-03', name: 'Hebilla Dorada #HD-03', required: 400, unit: 'pzas' }, { sku: 'OM-01', name: 'Ojal Metálico #OM-01', required: 1600, unit: 'pzas' } ] },
];

const initialPurchaseOrders: PurchaseOrder[] = [
    { id: 'OC-2407-001', supplierName: 'Pieles del Bajío S.A.', createdDate: '2024-07-15', expectedDate: '2024-08-01', status: 'Enviada', items: [{ material: 'Piel Nappa Negra', quantity: 200, unit: 'm²', unitCost: 310, totalCost: 62000 }], totalCost: 62000 },
    { id: 'OC-2407-002', supplierName: 'Suelas Modernas de León', createdDate: '2024-07-18', expectedDate: '2024-08-05', status: 'Recibida Parcialmente', items: [{ material: 'Suela Hule TR Mod. 501', quantity: 1000, unit: 'pares', unitCost: 35, totalCost: 35000 }], totalCost: 35000 },
    { id: 'OC-2406-015', supplierName: 'Herrajes Internacionales', createdDate: '2024-06-25', expectedDate: '2024-07-10', status: 'Recibida Completa', items: [{ material: 'Hebilla Dorada #HD-03', quantity: 5000, unit: 'pzas', unitCost: 4, totalCost: 20000 }], totalCost: 20000 },
];

const initialPurchaseSuggestions: PurchaseSuggestion[] = [
    { id: 1, materialId: 'PN-R-002', materialName: 'Piel Nappa Roja', quantityNeeded: 80, unit: 'm²', recommendedSupplier: 'Pieles del Bajío S.A.', sourceProductionOrderId: 'OP-5511' },
    { id: 2, materialId: 'OM-01', materialName: 'Ojal Metálico #OM-01', quantityNeeded: 1600, unit: 'pzas', recommendedSupplier: 'Herrajes Internacionales', sourceProductionOrderId: 'OP-5511' },
];

// --- Theme Context ---
type Theme = 'light' | 'dark';
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('sismac_theme');
        return (storedTheme as Theme) || 'dark'; // Default to dark
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('sismac_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const value = { theme, toggleTheme };
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};


// --- Auth Context ---
interface AuthContextType {
    user: Omit<User, 'password'> | null;
    users: Omit<User, 'password'>[];
    login: (username: string, password?: string) => boolean;
    logout: () => void;
    addUser: (newUser: Omit<User, 'id'>) => void;
    editUser: (updatedUser: Partial<User> & { id: number }) => void;
    deleteUser: (userId: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allUsers, setAllUsers] = useState<User[]>(() => loadFromStorage('sismac_users', initialUsers));
    const [currentUser, setCurrentUser] = useState<Omit<User, 'password'> | null>(() => {
        try {
            const storedUser = sessionStorage.getItem('sismac_user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from session storage", error);
            return null;
        }
    });

    const login = useCallback((username: string, password?: string) => {
        const foundUser = allUsers.find(u => u.username === username && u.password === password);
        if (foundUser && foundUser.status === 'Activo') {
            const { password: _, ...userToStore } = foundUser;
            setCurrentUser(userToStore);
            sessionStorage.setItem('sismac_user', JSON.stringify(userToStore));
            return true;
        }
        return false;
    }, [allUsers]);

    const logout = useCallback(() => {
        setCurrentUser(null);
        sessionStorage.removeItem('sismac_user');
    }, []);
    
    const addUser = useCallback((newUser: Omit<User, 'id' | 'password'> & { password?: string }) => {
        setAllUsers(prev => {
            const newId = Math.max(...prev.map(u => u.id), 0) + 1;
            const userWithId: User = { ...newUser, id: newId, password: newUser.password || 'password' }; // Set a default password if none is provided
            return [...prev, userWithId];
        });
    }, []);

    const editUser = useCallback((updatedUser: Partial<User> & { id: number }) => {
        setAllUsers(prev => prev.map(u => {
            if (u.id === updatedUser.id) {
                const finalUser = { ...u, ...updatedUser };
                // Ensure password is not set to an empty string if it's not being changed.
                if (updatedUser.password === undefined) {
                    finalUser.password = u.password;
                }
                return finalUser;
            }
            return u;
        }));
    }, []);

    const deleteUser = useCallback((userId: number) => {
        setAllUsers(prev => prev.filter(u => u.id !== userId));
    }, []);

    // Save to localStorage when users change
    useEffect(() => {
        saveToStorage('sismac_users', allUsers);
    }, [allUsers]);

    const publicUsers = useMemo(() => allUsers.map(({ password, ...user }) => user), [allUsers]);

    const value = useMemo(() => ({ user: currentUser, users: publicUsers, login, logout, addUser, editUser, deleteUser }), [currentUser, publicUsers, login, logout, addUser, editUser, deleteUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

// --- Login Page ---
const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (login(username, password)) {
            navigate('/');
        } else {
            setError('Credenciales inválidas o usuario inactivo.');
        }
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">SISMAC</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Sistema Inteligente de Suministros, Materiales y Almacén Centralizado</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">Usuario</label>
                        <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    <div>
                        <label htmlFor="password"  className="text-sm font-medium text-slate-700 dark:text-slate-300">Contraseña</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-sky-500 focus:border-sky-500" />
                    </div>
                    {error && <p className="text-sm text-rose-500 dark:text-rose-400">{error}</p>}
                    <button type="submit" className="w-full py-3 px-4 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors shadow-lg shadow-sky-900/50">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Responsive Layout Hooks & Components ---
const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
        
        mediaQueryList.addEventListener('change', listener);
        
        if (mediaQueryList.matches !== matches) {
            setMatches(mediaQueryList.matches);
        }

        return () => mediaQueryList.removeEventListener('change', listener);
    }, [query, matches]);

    return matches;
};


interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    label: string;
    allowedRoles: Role[];
    isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, allowedRoles, isCollapsed }) => {
    const location = useLocation();
    const { user } = useAuth();
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return (
        <div className="relative group">
            <Link 
                to={to} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isCollapsed ? 'justify-center' : ''
                } ${
                    isActive 
                        ? 'bg-sky-500/20 text-sky-400 dark:text-sky-300' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
                {icon}
                {!isCollapsed && <span className="font-medium">{label}</span>}
            </Link>
            {isCollapsed && (
                 <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 whitespace-nowrap">
                    {label}
                </div>
            )}
        </div>
    );
};


const NavItemsList: { to: string; label: string; icon: React.ReactNode; allowedRoles: Role[]; }[] = [
    { to: "/", label: "Dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>, allowedRoles: ['Administrador', 'Gerente', 'Comprador', 'Almacenista', 'Planificador', 'Ingeniero de Producto'] },
    { to: "/abastecimiento", label: "Abastecimiento", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 1a1 1 0 000 2h2a1 1 0 100-2H8zM4 3a1 1 0 000 2h2a1 1 0 100-2H4zM1 9a1 1 0 011-1h12a1 1 0 110 2H2a1 1 0 01-1-1zm15 2a1 1 0 100-2h-3a1 1 0 100 2h3zM4 17a1 1 0 100-2H2a1 1 0 100 2h2zm9-1a1 1 0 11-2 0 1 1 0 012 0z" /></svg>, allowedRoles: ['Gerente', 'Comprador'] },
    { to: "/almacen", label: "Almacén", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L9 9.61V16.5a1 1 0 00.5.866l7 4a1 1 0 001 0l7-4A1 1 0 0025 16.5V9.61l6.394-2.69a1 1 0 000-1.84l-7-3zM10 8.39L4.606 5.91 10 3.43l5.394 2.48L10 8.39z" /></svg>, allowedRoles: ['Gerente', 'Almacenista'] },
    { to: "/planificacion", label: "Planificación", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>, allowedRoles: ['Gerente', 'Planificador'] },
    { to: "/contabilidad", label: "Contabilidad", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2v4a2 2 0 002 2h8a2 2 0 002-2v-4a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1H6zm1 4a1 1 0 100 2h6a1 1 0 100-2H7zm6-4a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1h-1z" clipRule="evenodd" /></svg>, allowedRoles: ['Gerente'] },
    { to: "/ingenieria", label: "Ingeniería", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>, allowedRoles: ['Gerente', 'Ingeniero de Producto'] },
    { to: "/admin", label: "Admin", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>, allowedRoles: ['Administrador'] }
];


interface SidebarProps {
    isMobile: boolean;
    isMobileOpen: boolean;
    isDesktopCollapsed: boolean;
    onToggleDesktop: () => void;
    onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, isMobileOpen, isDesktopCollapsed, onToggleDesktop, onCloseMobile }) => {
    const { theme, toggleTheme } = useTheme();

    const sidebarContent = (isUiCollapsed: boolean) => (
        <>
            <div className={`text-2xl font-bold text-slate-900 dark:text-white mb-10 transition-all duration-300 ${isUiCollapsed ? 'text-center' : 'pl-3'}`}>
                {isUiCollapsed ? 'S' : 'SISMAC'}
            </div>
            <nav className="space-y-2 flex-1" onClick={isMobile ? onCloseMobile : undefined}>
                {NavItemsList.map(item => <NavItem key={item.to} {...item} isCollapsed={isUiCollapsed} />)}
            </nav>
            <div className="mt-auto space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                 <button 
                    onClick={toggleTheme}
                    aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200 ${isUiCollapsed ? 'justify-center' : ''}`}
                >
                    {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.95-4.243-1.59-1.59M3 12h2.25m.386-6.364 1.591 1.591M12 6.375a5.625 5.625 0 1 1-11.25 0 5.625 5.625 0 0 1 11.25 0Z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
                    )}
                     {!isUiCollapsed && <span className="font-medium">Tema</span>}
                 </button>
                 {!isMobile && (
                     <button 
                        onClick={onToggleDesktop}
                        aria-label={isUiCollapsed ? 'Expandir menú' : 'Colapsar menú'}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200 ${isUiCollapsed ? 'justify-center' : ''}`}
                    >
                        {isUiCollapsed ? (
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 4.5 7.5 7.5-7.5 7.5m-6-15 7.5 7.5-7.5 7.5" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>
                        )}
                        {!isUiCollapsed && <span className="font-medium">Colapsar</span>}
                    </button>
                 )}
            </div>
        </>
    );

    if (isMobile) {
        return (
            <aside className={`fixed top-0 left-0 h-full z-50 bg-white dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700/50 p-4 flex-shrink-0 flex flex-col w-64 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {sidebarContent(false)}
            </aside>
        );
    }
    
    // Desktop View
    return (
        <aside className={`relative bg-white dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-700/50 p-4 flex-shrink-0 flex flex-col transition-all duration-300 ${isDesktopCollapsed ? 'w-20 items-center' : 'w-64'}`}>
            {sidebarContent(isDesktopCollapsed)}
        </aside>
    );
};


interface HeaderProps {
    isMobile: boolean;
    onToggleMobileMenu: () => void;
}
const Header: React.FC<HeaderProps> = ({ isMobile, onToggleMobileMenu }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={`h-20 flex items-center px-4 md:px-8 flex-shrink-0 ${isMobile ? 'justify-between' : 'justify-end'}`}>
            {isMobile && (
                <button
                    onClick={onToggleMobileMenu}
                    className="p-2 text-slate-500 dark:text-slate-400"
                    aria-label="Abrir menú"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            )}
            <div className="flex items-center gap-4">
                <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-right">{user?.displayName}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 text-right">{user?.role}</div>
                </div>
                <img src={user?.avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full" />
                <button onClick={handleLogout} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Cerrar sesión">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
            </div>
        </header>
    );
};

const MainLayout: React.FC = () => {
    const { user, users } = useAuth();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);
    
    // Application-wide state management
    const [inventoryData, setInventoryData] = useState<MaterialInventory[]>(() => loadFromStorage('sismac_inventory', initialMaterialInventoryData.map(item => ({...item, status: calculateStatus(item.quantity, item.reorderPoint)}))));
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadFromStorage('sismac_purchaseOrders', initialPurchaseOrders));
    const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() => loadFromStorage('sismac_productionOrders', initialProductionOrders));
    const [purchaseSuggestions, setPurchaseSuggestions] = useState<PurchaseSuggestion[]>(() => loadFromStorage('sismac_purchaseSuggestions', initialPurchaseSuggestions));
    const [productModels, setProductModels] = useState<ProductModel[]>(() => loadFromStorage('sismac_productModels', initialProductModels));

    useEffect(() => {
        if (!isMobile) {
            setIsMobileSidebarOpen(false);
        }
    }, [isMobile]);

    const removePurchaseSuggestion = (id: number) => {
        setPurchaseSuggestions(prev => prev.filter(s => s.id !== id));
    };

    const addPurchaseSuggestions = (suggestions: Omit<PurchaseSuggestion, 'id'>[]) => {
        setPurchaseSuggestions(prev => {
            let nextId = Math.max(0, ...prev.map(s => s.id)) + 1;
            const newSuggestions = suggestions.map(s => ({ ...s, id: nextId++ }));
            return [...prev, ...newSuggestions];
        });
    };
    
    const addProductModel = (newModel: ProductModel) => {
        setProductModels(prev => [...prev, newModel]);
    };
    
    const editProductModel = (updatedModel: ProductModel) => {
        setProductModels(prev => prev.map(m => m.id === updatedModel.id ? updatedModel : m));
    };

    // Save to localStorage when data changes
    useEffect(() => {
        saveToStorage('sismac_inventory', inventoryData);
    }, [inventoryData]);

    useEffect(() => {
        saveToStorage('sismac_purchaseOrders', purchaseOrders);
    }, [purchaseOrders]);

    useEffect(() => {
        saveToStorage('sismac_productionOrders', productionOrders);
    }, [productionOrders]);

    useEffect(() => {
        saveToStorage('sismac_purchaseSuggestions', purchaseSuggestions);
    }, [purchaseSuggestions]);

    useEffect(() => {
        saveToStorage('sismac_productModels', productModels);
    }, [productModels]);

    const contextValue = {
        inventoryData,
        purchaseOrders, setPurchaseOrders,
        productionOrders, setProductionOrders,
        purchaseSuggestions, removePurchaseSuggestion, addPurchaseSuggestions,
        productModels, addProductModel, editProductModel
    };
    
    const location = useLocation();
    const navItems: Omit<NavItemProps, 'icon' | 'label' | 'isCollapsed'>[] = [
        { to: '/', allowedRoles: ['Administrador', 'Gerente', 'Comprador', 'Almacenista', 'Planificador', 'Ingeniero de Producto'] },
        { to: '/abastecimiento', allowedRoles: ['Gerente', 'Comprador'] },
        { to: '/almacen', allowedRoles: ['Gerente', 'Almacenista'] },
        { to: '/planificacion', allowedRoles: ['Gerente', 'Planificador'] },
        { to: '/contabilidad', allowedRoles: ['Gerente'] },
        { to: '/ingenieria', allowedRoles: ['Gerente', 'Ingeniero de Producto'] },
        { to: '/admin', allowedRoles: ['Administrador'] }
    ];

    const currentRoute = navItems.find(item => location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to)));

    if(user && currentRoute && !currentRoute.allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-300 min-h-screen flex">
            {isMobile && isMobileSidebarOpen && (
                <div 
                    onClick={() => setIsMobileSidebarOpen(false)} 
                    className="fixed inset-0 bg-black/60 z-40" 
                    aria-hidden="true"
                ></div>
            )}
            <Sidebar
                isMobile={isMobile}
                isMobileOpen={isMobileSidebarOpen}
                isDesktopCollapsed={isDesktopSidebarCollapsed}
                onToggleDesktop={() => setIsDesktopSidebarCollapsed(prev => !prev)}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
            <div className={`flex-1 flex flex-col transition-all duration-300 ${!isMobile && isDesktopSidebarCollapsed ? 'max-w-[calc(100vw-5rem)]' : !isMobile ? 'max-w-[calc(100vw-16rem)]' : 'w-full'}`}>
                <Header 
                    isMobile={isMobile}
                    onToggleMobileMenu={() => setIsMobileSidebarOpen(prev => !prev)}
                />
                <main className="p-6 lg:p-8 flex-1 overflow-y-auto relative">
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="abastecimiento" element={<Outlet context={contextValue} />} >
                            <Route index element={<Abastecimiento />}/>
                        </Route>
                        <Route path="almacen" element={<Outlet context={contextValue} />} >
                            <Route index element={<Almacen />}/>
                        </Route>
                        <Route path="planificacion" element={<Outlet context={contextValue} />} >
                            <Route index element={<Planificacion />}/>
                        </Route>
                        <Route path="contabilidad" element={<Contabilidad />} />
                        <Route path="ingenieria" element={<Outlet context={contextValue} />} >
                            <Route index element={<Ingenieria />}/>
                        </Route>
                        <Route path="admin" element={<Admin />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <button
                        onClick={() => setIsCopilotOpen(true)}
                        className="fixed bottom-8 right-8 bg-violet-600 hover:bg-violet-500 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 z-30"
                        aria-label="Abrir SISMAC Copilot"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.898 20.572 16.5 21.75l-.398-1.178a3.375 3.375 0 0 0-2.456-2.456L12.75 18l1.178-.398a3.375 3.375 0 0 0 2.456-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 0 0 2.456 2.456L20.25 18l-1.178.398a3.375 3.375 0 0 0-2.456 2.456Z" />
                        </svg>
                    </button>
                </main>
            </div>
             <Copilot
                isOpen={isCopilotOpen}
                onClose={() => setIsCopilotOpen(false)}
                appData={{ ...contextValue, users }}
            />
        </div>
    );
};

// --- App Component ---
function App() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
            <Route path="/*" element={user ? <MainLayout /> : <Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;