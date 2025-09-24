import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit2, Trash2, Download } from 'lucide-react';
import { useReservations, Reservation } from '../contexts/ReservationContext';

const Reservations: React.FC = () => {
  const { reservations, deleteReservation } = useReservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.roomNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    const matchesSource = filterSource === 'all' || reservation.source === filterSource;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'direct':
        return 'bg-blue-100 text-blue-800';
      case 'booking':
        return 'bg-purple-100 text-purple-800';
      case 'external':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'direct':
        return 'Directo';
      case 'booking':
        return 'Booking.com';
      case 'external':
        return 'API Externa';
      default:
        return source;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
            <p className="text-gray-600 mt-1">Gestiona todas las reservas del hotel</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200">
              <Download size={20} />
              <span>Exportar</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Plus size={20} />
              <span>Nueva Reserva</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por huésped, email o habitación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="confirmed">Confirmadas</option>
            <option value="pending">Pendientes</option>
            <option value="cancelled">Canceladas</option>
          </select>

          {/* Source Filter */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las fuentes</option>
            <option value="direct">Directo</option>
            <option value="booking">Booking.com</option>
            <option value="external">API Externa</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterSource('all');
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Filter size={20} />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Huésped</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Habitación</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fechas</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fuente</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Total</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{reservation.guestName}</div>
                      <div className="text-sm text-gray-600">{reservation.email}</div>
                      <div className="text-sm text-gray-600">{reservation.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">#{reservation.roomNumber}</div>
                      <div className="text-sm text-gray-600">{reservation.roomType}</div>
                      <div className="text-sm text-gray-600">{reservation.guests} huésped{reservation.guests > 1 ? 'es' : ''}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Check-in: {new Date(reservation.checkIn).toLocaleDateString('es-ES')}</div>
                      <div>Check-out: {new Date(reservation.checkOut).toLocaleDateString('es-ES')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSourceBadge(reservation.source)}`}>
                      {getSourceLabel(reservation.source)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      ${reservation.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteReservation(reservation.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detalles de la Reserva</h3>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información del Huésped</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nombre:</span> {selectedReservation.guestName}</p>
                    <p><span className="font-medium">Email:</span> {selectedReservation.email}</p>
                    <p><span className="font-medium">Teléfono:</span> {selectedReservation.phone}</p>
                    <p><span className="font-medium">Huéspedes:</span> {selectedReservation.guests}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Información de la Reserva</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Habitación:</span> #{selectedReservation.roomNumber}</p>
                    <p><span className="font-medium">Tipo:</span> {selectedReservation.roomType}</p>
                    <p><span className="font-medium">Check-in:</span> {new Date(selectedReservation.checkIn).toLocaleDateString('es-ES')}</p>
                    <p><span className="font-medium">Check-out:</span> {new Date(selectedReservation.checkOut).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Información Adicional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p><span className="font-medium">Estado:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedReservation.status)}`}>
                      {getStatusLabel(selectedReservation.status)}
                    </span>
                  </p>
                  <p><span className="font-medium">Fuente:</span> 
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getSourceBadge(selectedReservation.source)}`}>
                      {getSourceLabel(selectedReservation.source)}
                    </span>
                  </p>
                  <p><span className="font-medium">Total:</span> ${selectedReservation.totalAmount.toLocaleString()}</p>
                  <p><span className="font-medium">Creada:</span> {new Date(selectedReservation.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
                
                {selectedReservation.specialRequests && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-900 mb-2">Solicitudes Especiales:</p>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedReservation.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{filteredReservations.length}</div>
            <div className="text-sm text-gray-600">Total Reservas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredReservations.filter(r => r.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredReservations.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${filteredReservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Ingresos Totales</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;