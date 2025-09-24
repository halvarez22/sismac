import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id'> & { id?: number }) => void;
    user: Omit<User, 'password'> | null;
}

const allRoles: Role[] = ['Administrador', 'Gerente', 'Comprador', 'Almacenista', 'Planificador', 'Ingeniero de Producto'];

const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose, onSave, user }) => {
    const getInitialState = (): Omit<User, 'id' | 'avatarUrl'> => ({
        displayName: '',
        username: '',
        password: '',
        role: 'Comprador',
        status: 'Activo',
    });

    const [formData, setFormData] = useState(getInitialState());
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            if (user) {
                setFormData({
                    displayName: user.displayName,
                    username: user.username,
                    role: user.role,
                    status: user.status,
                    password: ''
                });
            } else {
                setFormData(getInitialState());
            }
            setConfirmPassword('');
            setErrors({});
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.displayName.trim()) newErrors.displayName = "El nombre es requerido.";
        if (!formData.username.trim()) newErrors.username = "El nombre de usuario es requerido.";
        
        if (!isEditing) {
            if (!formData.password) {
                 newErrors.password = "La contraseña es requerida para nuevos usuarios.";
            } else if (formData.password.length < 6) {
                newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
            } else if (formData.password !== confirmPassword) {
                newErrors.confirmPassword = "Las contraseñas no coinciden.";
            }
        } else if (formData.password && formData.password.length < 6) {
             newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
        } else if (formData.password && formData.password !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden.";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // FIX: Add avatarUrl to the saved user data.
            // For new users, generate a new avatar URL. For existing users, preserve the old one.
            const dataToSave: Omit<User, 'id'> & { id?: number } = {
                 ...formData,
                 avatarUrl: user?.avatarUrl || `https://picsum.photos/seed/${formData.username}/40/40`
            };
            if (user?.id) {
                dataToSave.id = user.id;
            }
             if (!dataToSave.password) {
                delete dataToSave.password; // Don't send empty password
            }
            onSave(dataToSave);
        }
    };

    const isEditing = !!user;
    
    const baseInputClasses = "w-full bg-slate-700 border rounded-lg p-2.5 text-sm text-white";
    const errorInputClasses = "border-rose-500 focus:border-rose-500 focus:ring-rose-500";
    const normalInputClasses = "border-slate-600 focus:ring-sky-500 focus:border-sky-500";

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-50" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg">
                <header className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">
                        {isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-1">Nombre Completo</label>
                            <input type="text" id="displayName" name="displayName" value={formData.displayName} onChange={handleChange} className={`${baseInputClasses} ${errors.displayName ? errorInputClasses : normalInputClasses}`} />
                            {errors.displayName && <p className="text-xs text-rose-400 mt-1">{errors.displayName}</p>}
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">Usuario (para login)</label>
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} disabled={isEditing} className={`${baseInputClasses} ${errors.username ? errorInputClasses : normalInputClasses} ${isEditing ? 'bg-slate-800 cursor-not-allowed' : ''}`} />
                            {errors.username && <p className="text-xs text-rose-400 mt-1">{errors.username}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">Rol</label>
                                <select id="role" name="role" value={formData.role} onChange={handleChange} className={`${baseInputClasses} ${normalInputClasses}`}>
                                    {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">Estado</label>
                                <select id="status" name="status" value={formData.status} onChange={handleChange} className={`${baseInputClasses} ${normalInputClasses}`}>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                        <div className="border-t border-slate-700 pt-4">
                            <p className="text-sm text-slate-400 mb-2">{isEditing ? 'Establecer nueva contraseña (opcional)' : 'Establecer contraseña'}</p>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className={`${baseInputClasses} ${errors.password ? errorInputClasses : normalInputClasses}`} />
                                    {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">Confirmar Contraseña</label>
                                    <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`${baseInputClasses} ${errors.confirmPassword ? errorInputClasses : normalInputClasses}`} />
                                    {errors.confirmPassword && <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="flex justify-end p-6 border-t border-slate-700 bg-slate-800/50 rounded-b-xl gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 text-slate-200 rounded-lg hover:bg-slate-500 transition-colors text-sm font-semibold">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-md shadow-sky-900/50">
                            {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default UserManagementModal;