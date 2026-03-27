import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { planningService as planningAPI } from '../services/planningService';

import { Link } from 'react-router-dom';

interface DashboardStats {
    modules_total: number;
    modules_planifies: number;
    creneaux_planifies: number;
    volume_horaire_total: number;
    volume_horaire_planifie: number;
    heures_restantes: number;
    taux_completion: number;
}

const DashboardChefPole: React.FC = () => {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await planningAPI.getDashboardStats(undefined);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Erreur chargement stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-primary-100 rounded-lg">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard - Chef de Pôle</h1>
                                <p className="text-sm text-gray-600">Bienvenue, {user?.username}</p>
                            </div>
                        </div>
                        <button onClick={logout} className="btn-secondary">
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card-hover">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Modules Total</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.modules_total || 0}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card-hover">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Créneaux Planifiés</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.creneaux_planifies || 0}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card-hover">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Heures Planifiées</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.volume_horaire_planifie.toFixed(0) || 0}h</p>
                                <p className="text-xs text-gray-500 mt-1">sur {stats?.volume_horaire_total || 0}h</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="card-hover">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Taux de Complétion</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.taux_completion.toFixed(1) || 0}%</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {stats && (
                    <div className="card mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progression de la Planification</h3>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(stats.taux_completion, 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>{stats.heures_restantes.toFixed(0)}h restantes</span>
                            <span>{stats.volume_horaire_total}h total</span>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link to="/planning" className="card-hover group cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Planification</h3>
                                <p className="text-sm text-gray-600">Gérer les emplois du temps</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/referentiel" className="card-hover group cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Référentiel</h3>
                                <p className="text-sm text-gray-600">Gérer les ressources</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/exports" className="card-hover group cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Exports</h3>
                                <p className="text-sm text-gray-600">Télécharger les plannings</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default DashboardChefPole;
