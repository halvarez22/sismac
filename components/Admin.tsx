import React, { useState } from 'react';
import UserManagementModal from './UserManagementModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { User, Role } from '../types';
import { useAuth } from '../App';

const getStatusClass = (status: 'Activo' | 'Inactivo') => {
    return status === 'Activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400';
};

const getRoleClass = (role: Role) => {
    switch (role) {
        case 'Administrador': return 'border-sky-500 text-sky-400';
        case 'Gerente': return 'border-amber-500 text-amber-400';
        case 'Comprador': return 'border-indigo-500 text-indigo-400';
        case 'Almacenista': return 'border-teal-500 text-teal-400';
        case 'Planificador': return 'border-slate-500 text-slate-400';
        case 'Ingeniero de Producto': return 'border-pink-500 text-pink-400';
        default: return 'border-slate-600 text-slate-300';
    }
}

const Admin: React.FC = () => {
    const { users, addUser, editUser, deleteUser, user: currentUser } = useAuth();
    
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Omit<User, 'password'> | null>(null);
    const [deletingUser, setDeletingUser] = useState<Omit<User, 'password'> | null>(null);

    const handleOpenAddModal = () => {
        setEditingUser(null);
        setIsUserModalOpen(true);
    };

    const handleOpenEditModal = (user: Omit<User, 'password'>) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const handleOpenDeleteModal = (user: Omit<User, 'password'>) => {
        setDeletingUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsUserModalOpen(false);
        setIsDeleteModalOpen(false);
        setEditingUser(null);
        setDeletingUser(null);
    };

    const handleSaveUser = (userToSave: Omit<User, 'id'> & { id?: number }) => {
        if (userToSave.id) { // Editing
            editUser(userToSave as Partial<User> & { id: number });
        } else { // Adding
            addUser(userToSave);
        }
        handleCloseModals();
    };

    const handleDeleteUser = () => {
        if (deletingUser) {
            deleteUser(deletingUser.id);
        }
        handleCloseModals();
    };

    return (
        <div>
            {isUserModalOpen && (
                <UserManagementModal
                    isOpen={isUserModalOpen}
                    onClose={handleCloseModals}
                    onSave={handleSaveUser}
                    user={editingUser}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleCloseModals}
                    onConfirm={handleDeleteUser}
                    title="Confirmar Eliminación"
                    message={`¿Estás seguro de que deseas eliminar al usuario ${deletingUser?.displayName}? Esta acción no se puede deshacer.`}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Administración de Usuarios</h3>
                <button
                    onClick={handleOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors text-sm font-semibold shadow-lg shadow-sky-900/50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Añadir Nuevo Usuario
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100 dark:bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nombre</th>
                                <th scope="col" className="px-6 py-3">Usuario (Login)</th>
                                <th scope="col" className="px-6 py-3 text-center">Rol</th>
                                <th scope="col" className="px-6 py-3 text-center">Estado</th>
                                <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: Omit<User, 'password'>) => (
                                <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatarUrl} alt={user.displayName} className="w-8 h-8 rounded-full" />
                                            <span>{user.displayName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">{user.username}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${getRoleClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button onClick={() => handleOpenEditModal(user)} className="p-1 rounded-md text-amber-500 dark:text-amber-400 hover:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-colors" aria-label={`Editar ${user.displayName}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleOpenDeleteModal(user)} 
                                            className="p-1 rounded-md text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors disabled:text-slate-500 dark:disabled:text-slate-600 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                            disabled={user.id === currentUser?.id}
                                            aria-label={user.id === currentUser?.id ? 'No se puede eliminar el usuario actual' : `Eliminar ${user.displayName}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
