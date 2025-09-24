import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Eye } from 'lucide-react';
import { useReservations } from '../contexts/ReservationContext';

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const { reservations, getReservationsByDate } = useReservations();
  const [currentDate, setCurrentDate] = useState(new Date());

  const rooms = [
    { number: '101', type: 'Suite Deluxe', capacity: 2 },
    { number: '102', type: 'Habitación Estándar', capacity: 2 },
    { number: '103', type: 'Suite Junior', capacity: 3 },
    { number: '201', type: 'Habitación Estándar', capacity: 2 },
    { number: '202', type: 'Suite Deluxe', capacity: 2 },
    { number: '203', type: 'Habitación Estándar', capacity: 1 },
    { number: '301', type: 'Suite Presidencial', capacity: 4 },
    { number: '302', type: 'Suite Deluxe', capacity: 2 },
    { number: '303', type: 'Suite Junior', capacity: 3 },
    { number: '401', type: 'Habitación Estándar', capacity: 2 },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getWeekDays = () => {
    const today = new Date();
    const currentWeek = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      currentWeek.push(day);
    }

    return currentWeek;
  };

  const weekDays = getWeekDays();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getReservationForRoomAndDate = (roomNumber: string, date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return reservations.find(reservation => 
      reservation.roomNumber === roomNumber &&
      reservation.checkIn <= dateString &&
      reservation.checkOut > dateString
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendario de Ocupación</h1>
            <p className="text-gray-600 mt-1">Gestiona las reservas por habitación y fecha</p>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Plus size={20} />
            <span>Nueva Reserva</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Semana del {weekDays[0].toLocaleDateString('es-ES')} al {weekDays[6].toLocaleDateString('es-ES')}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() - 7);
                  setCurrentDate(newDate);
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                Hoy
              </button>
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() + 7);
                  setCurrentDate(newDate);
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <span className="text-sm font-medium text-gray-600">Habitación</span>
              </div>
              {weekDays.map((day, index) => (
                <div key={day.toISOString()} className="p-4 bg-gray-50 border-r border-gray-200 last:border-r-0 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {dayNames[day.getDay()]}
                  </div>
                  <div className="text-lg font-bold text-gray-700 mt-1">
                    {day.getDate()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.toLocaleDateString('es-ES', { month: 'short' })}
                  </div>
                </div>
              ))}
            </div>

            {/* Room Rows */}
            {rooms.map((room) => (
              <div key={room.number} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
                {/* Room Info */}
                <div className="p-4 border-r border-gray-200 bg-gray-50">
                  <div className="font-medium text-gray-900">{room.number}</div>
                  <div className="text-sm text-gray-600">{room.type}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {room.capacity} huéspedes
                  </div>
                </div>

                {/* Day Cells */}
                {weekDays.map((day) => {
                  const reservation = getReservationForRoomAndDate(room.number, day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={`${room.number}-${day.toISOString()}`}
                      className={`p-2 border-r border-gray-200 last:border-r-0 min-h-[100px] ${
                        isToday ? 'bg-blue-50' : 'bg-white'
                      } hover:bg-gray-50 transition-colors duration-200`}
                    >
                      {reservation ? (
                        <div className={`p-2 rounded-lg border text-xs ${getStatusColor(reservation.status)}`}>
                          <div className="font-medium truncate">{reservation.guestName}</div>
                          <div className="text-xs opacity-75 mt-1">
                            {reservation.checkIn} - {reservation.checkOut}
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            {reservation.guests} huésped{reservation.guests > 1 ? 'es' : ''}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium">
                              ${(reservation.totalAmount / 1000).toFixed(0)}K
                            </span>
                            <button className="opacity-50 hover:opacity-100">
                              <Eye size={12} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity duration-200">
                          <Plus size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Leyenda</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-700">Confirmada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-sm text-gray-700">Pendiente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-sm text-gray-700">Cancelada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span className="text-sm text-gray-700">Día actual</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;