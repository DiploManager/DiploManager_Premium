import React from 'react';
import { Calendar, Users, CreditCard, TrendingUp, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useReservations } from '../contexts/ReservationContext';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { reservations } = useReservations();
  const { user } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter(r => r.checkIn === today);
  const totalRevenue = reservations.reduce((sum, r) => sum + r.totalAmount, 0);
  const occupancyRate = Math.min(100, (reservations.length / 50) * 100); // Assuming 50 total rooms

  const stats = [
    {
      title: 'Reservas Hoy',
      value: todayReservations.length,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Huéspedes Activos',
      value: reservations.filter(r => r.status === 'confirmed').length,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Ingresos del Mes',
      value: `$${(totalRevenue / 1000).toFixed(0)}K`,
      icon: CreditCard,
      color: 'bg-purple-500',
      change: '+15%',
    },
    {
      title: 'Ocupación',
      value: `${occupancyRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5%',
    },
  ];

  const recentReservations = reservations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              ¡Bienvenido, {user?.name}!
            </h1>
            <p className="text-blue-100 text-lg">
              Gestiona tu hotel de manera eficiente
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 rounded-lg p-4">
              <Clock className="text-white mb-2" size={32} />
              <p className="text-sm text-blue-100">
                {new Date().toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Reservas Recientes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentReservations.map((reservation) => (
              <div key={reservation.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{reservation.guestName}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : reservation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status === 'confirmed' ? 'Confirmada' : 
                         reservation.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>Hab. {reservation.roomNumber}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{reservation.checkIn} - {reservation.checkOut}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Phone size={14} />
                        <span>{reservation.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail size={14} />
                        <span>{reservation.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${reservation.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {reservation.source === 'direct' ? 'Directo' : 
                       reservation.source === 'booking' ? 'Booking' : 'Externo'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200">
              <Calendar className="text-blue-600 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-900">Ver Calendario</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all duration-200">
              <Users className="text-green-600 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-900">Nueva Reserva</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-200">
              <CreditCard className="text-purple-600 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-900">Reportes</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all duration-200">
              <TrendingUp className="text-orange-600 mb-2" size={32} />
              <span className="text-sm font-medium text-gray-900">Analíticas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;